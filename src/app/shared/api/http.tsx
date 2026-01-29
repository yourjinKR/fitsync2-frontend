import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type JWTResponse = {
  accessToken: string;
  refreshToken?: string;
};

type RefreshRequest = {
  refreshToken: string;
};

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
 * 일반 API 호출용 (B안)
 */
export const api: AxiosInstance = axios.create({
  baseURL: "", // Vite proxy 사용
  timeout: 15_000,
  withCredentials: false, // B안: 기본은 쿠키 불필요
});

/**
 * 인증 전용 (인터셉터 없음)
 */
export const authApi: AxiosInstance = axios.create({
  baseURL: "",
  timeout: 15_000,
  withCredentials: false,
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

    if (!originalConfig) return Promise.reject(err);

    const isRefreshCall = originalConfig.url?.includes("/jwt/refresh");

    if (status === 401 && !originalConfig._retry && !isRefreshCall) {
      originalConfig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeRefresh((newToken) => {
            originalConfig.headers = originalConfig.headers ?? {};
            originalConfig.headers.Authorization = `Bearer ${newToken}`;
            api(originalConfig).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        flushRefreshQueue(newToken);

        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${newToken}`;
        return api(originalConfig);
      } catch (refreshErr) {
        tokenStore.clear();
        window.location.href = "/test/login";
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
