import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  withCredentials: true // 세션/쿠키 기반이면 true 유지, JWT만 쓰면 false로
});

// 필요 시 토큰/에러 공통 처리
http.interceptors.response.use(
  (res) => res,
  (err) => {
    // TODO: 401 처리(로그아웃/리프레시), 500 토스트 등 공통 처리 위치
    return Promise.reject(err);
  }
);
