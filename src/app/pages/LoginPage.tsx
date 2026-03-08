import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useLoginMutation } from "../features/user/hooks/useLoginMutation";
import type { SocialProviderType } from "../features/user/types/member";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const Page = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
`;

const Section = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 700;
`;

const Field = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
`;

const ErrorText = styled.div`
  color: var(--color-error);
  margin-bottom: 15px;
  font-size: 14px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 10px;
  background: var(--color-brand);
  color: #fff;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 700;
  margin-bottom: 20px;
  box-shadow: var(--shadow-1);

  &:hover:not(:disabled) {
    background: var(--color-brand-strong);
  }
`;

const Center = styled.div`
  text-align: center;
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0;
  color: var(--color-text-muted);
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: var(--color-brand);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
`;

const SocialStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SocialButton = styled.button<{ $background: string; $color?: string }>`
  padding: 10px;
  background: ${({ $background }) => $background};
  color: ${({ $color }) => $color ?? "#fff"};
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  box-shadow: var(--shadow-1);
`;

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
    <Page>
      <h1>로그인</h1>

      {/* 자체 로그인 폼 */}
      <form onSubmit={handleLogin}>
        <Section>
          <Label htmlFor="loginId">아이디</Label>
          <Field
            id="loginId"
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디를 입력해주세요"
            disabled={isPending}
          />
        </Section>

        <Section>
          <Label htmlFor="password">비밀번호</Label>
          <Field
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            disabled={isPending}
          />
        </Section>

        {isError && (
          <ErrorText>
            {error instanceof Error ? error.message : "로그인에 실패했습니다."}
          </ErrorText>
        )}

        <PrimaryButton type="submit" disabled={isPending}>
          {isPending ? "로그인 중..." : "로그인"}
        </PrimaryButton>
      </form>

      {/* 회원가입 링크 */}
      <Center style={{ marginBottom: "20px" }}>
        <span>계정이 없으신가요? </span>
        <LinkButton onClick={() => navigate("/signup")}>
          회원가입
        </LinkButton>
      </Center>

      {/* 구분선 */}
      <Divider>또는</Divider>

      {/* 소셜 로그인 버튼 */}
      <SocialStack>
        <SocialButton
          onClick={() => handleSocialLogin("NAVER")}
          $background="#00c73c"
        >
          Naver로 계속하기
        </SocialButton>

        <SocialButton
          onClick={() => handleSocialLogin("GOOGLE")}
          $background="#db4437"
        >
          Google로 계속하기
        </SocialButton>

        <SocialButton
          onClick={() => handleSocialLogin("KAKAO")}
          $background="#fee500"
          $color="#3c1e1e"
        >
          Kakao로 계속하기
        </SocialButton>
      </SocialStack>
    </Page>
  );
};

export default LoginPage;
