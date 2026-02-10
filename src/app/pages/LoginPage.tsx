import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/user/hooks/useLoginMutation";
import type { SocialProviderType } from "../features/user/types/member";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending, isError, error } = useLoginMutation();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginId && password) {
      login(
        { loginId, password },
        {
          onSuccess: () => {
            // 로그인 성공 후 페이지 이동
            navigate("/");
          },
        }
      );
    } else {
      alert("아이디와 비밀번호를 입력해주세요.");
    }
  };

  const handleSocialLogin = (provider: SocialProviderType) => {
    window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider.toLowerCase()}`;
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>로그인</h1>

      {/* 자체 로그인 폼 */}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="loginId" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            아이디
          </label>
          <input
            id="loginId"
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디를 입력해주세요"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
            disabled={isPending}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
            disabled={isPending}
          />
        </div>

        {isError && (
          <div style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
            {error instanceof Error ? error.message : "로그인에 실패했습니다."}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: isPending ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isPending ? "default" : "pointer",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          {isPending ? "로그인 중..." : "로그인"}
        </button>
      </form>

      {/* 회원가입 링크 */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span>계정이 없으신가요? </span>
        <button
          onClick={() => navigate("/signup")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
          }}
        >
          회원가입
        </button>
      </div>

      {/* 구분선 */}
      <div style={{ textAlign: "center", margin: "20px 0", color: "#999" }}>
        또는
      </div>

      {/* 소셜 로그인 버튼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button
          onClick={() => handleSocialLogin("NAVER")}
          style={{
            padding: "10px",
            backgroundColor: "#00c73c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Naver로 계속하기
        </button>

        <button
          onClick={() => handleSocialLogin("GOOGLE")}
          style={{
            padding: "10px",
            backgroundColor: "#db4437",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Google로 계속하기
        </button>

        <button
          onClick={() => handleSocialLogin("KAKAO")}
          style={{
            padding: "10px",
            backgroundColor: "#fee500",
            color: "#3c1e1e",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Kakao로 계속하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
