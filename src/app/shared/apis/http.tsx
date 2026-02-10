import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

/**
 * TODO :
 * refresh 실패 시 대기 큐 reject 처리(영구 pending 방지)
 * refreshToken 저장 방식 재검토(가능하면 HttpOnly 쿠키로 전환)
 * axios 유틸에서 window.location.href 제거 → 상위 레이어(라우터/전역 상태)에서 처리
 * 401 중 TOKEN_EXPIRED 같은 케이스만 refresh(서버 error code 기반 분기)
 * (옵션) 네트워크/5xx만 짧은 재시도(backoff), 비멱등 요청은 제외
 */

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

type JWTResponse = {
  accessToken: string;
  refreshToken?: string;
};

type RefreshRequest = {
  refreshToken: string;
};

// 백엔드의 ErrorResponse 구조와 일치시킴
export interface ApiErrorScheme {
  code: string;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export class ApiError extends Error {
  code: string;
  status?: number;
  errors?: Array<{ field: string; message: string }>;
  originalError: AxiosError;

  constructor(error: AxiosError<unknown>) {
    super();
    this.name = "ApiError";
    this.originalError = error as AxiosError;

    const errorData = error.response?.data as ApiErrorScheme | undefined;

    if (errorData && errorData.code) {
      this.message = errorData.message;
      this.code = errorData.code;
      this.errors = errorData.errors;
      this.status = error.response?.status;
    }

    else if (error.request) {
      this.code = "NETWORK_ERROR";
      this.message = "서버와 연결할 수 없습니다.";
      this.status = 0;
    }

    else {
      this.code = "UNKNOWN_ERROR";
      this.message = error.message || "알 수 없는 오류가 발생했습니다.";
    }
  }
}

const tokenStore = {
  getAccess: () => localStorage.getItem("accessToken"),
  getRefresh: () => localStorage.getItem("refreshToken"),
  setAccess: (v: string) => localStorage.setItem("accessToken", v),
  setRefresh: (v: string) => localStorage.setItem("refreshToken", v),
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// TODO : 배포시 env-production을 통해 불러오기

/**
 * 일반 API 호출용
 */
export const api: AxiosInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL, // Vite proxy 사용
  timeout: 15_000,
  withCredentials: true
});

/**
 * 인증 전용 (인터셉터 없음)
 */
export const authApi: AxiosInstance = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  timeout: 15_000,
  withCredentials: true,
});

// ----- request interceptor: Bearer 자동 부착 -----
api.interceptors.request.use((config) => {
  const accessToken = tokenStore.getAccess();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ----- refresh 동시성 제어 -----
let isRefreshing = false;
let refreshQueue: Array<(newToken: string) => void> = [];

function subscribeRefresh(cb: (newToken: string) => void) {
  refreshQueue.push(cb);
}
function flushRefreshQueue(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) throw new Error("RefreshToken이 없습니다.");

  const { data } = await authApi.post<JWTResponse>("/jwt/refresh", {
    refreshToken,
  } satisfies RefreshRequest);

  tokenStore.setAccess(data.accessToken);
  if (data.refreshToken) tokenStore.setRefresh(data.refreshToken);

  return data.accessToken;
}

// ----- response interceptor: 401이면 refresh 후 재시도 -----
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const status = err.response?.status;
    const originalConfig = err.config as RetryConfig | undefined;

    if (!originalConfig) return Promise.reject(new ApiError(err));

    const isRefreshCall = originalConfig.url?.includes("/jwt/refresh");

    if (status === 401 && !originalConfig._retry && !isRefreshCall) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeRefresh((newToken) => {
            originalConfig.headers = originalConfig.headers ?? {};
            originalConfig.headers.Authorization = `Bearer ${newToken}`;

            api(originalConfig)
              .then(resolve)
              .catch((e) => reject(new ApiError(e)));
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        flushRefreshQueue(newToken);

        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${newToken}`;

        return await api(originalConfig);

      } catch (refreshErr) {
        tokenStore.clear();
        window.location.href = "/login";

        if (axios.isAxiosError(refreshErr)) {
          return Promise.reject(new ApiError(refreshErr));
        }

        return Promise.reject(refreshErr);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(new ApiError(err));
  }
);
