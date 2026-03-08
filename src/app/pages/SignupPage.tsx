import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { createUser } from "../features/user/apis/createUser";
import { authApi, ApiError } from "../shared/apis/http";
import type { UserRequest, UserRoleType } from "../features/user/types/member";

type SignupForm = {
  loginId: string;
  password: string;
  name: string;
  email: string;
  roleType: UserRoleType;
};

const Page = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  font-weight: 700;
`;

const Field = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
`;

const PrimaryButton = styled.button`
  padding: 10px;
  background: var(--color-brand);
  color: #fff;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 700;
  margin-top: 10px;
  box-shadow: var(--shadow-1);

  &:hover:not(:disabled) {
    background: var(--color-brand-strong);
  }
`;

const ErrorBox = styled.div`
  color: var(--color-error);
  font-size: 14px;
  padding: 10px;
  background: color-mix(in oklab, var(--color-error) 12%, var(--color-surface));
  border: 1px solid color-mix(in oklab, var(--color-error) 28%, var(--color-border));
  border-radius: var(--radius-sm);
`;

const AvailabilityText = styled.div<{ $available: boolean }>`
  color: ${({ $available }) => ($available ? "var(--color-success)" : "var(--color-error)")};
  font-size: 12px;
  margin-top: 5px;
`;

const Center = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: var(--color-brand);
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
`;

const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, isError, error } = useMutation({
    mutationFn: (request: UserRequest) => createUser(request),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다. 로그인해 주세요.");
      navigate("/login");
    },
  });

  const [formData, setFormData] = useState<SignupForm>({
    loginId: "",
    password: "",
    name: "",
    email: "",
    roleType: "MEMBER",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loadingCheckLoginId, setLoadingCheckLoginId] = useState(false);
  const [loginIdAvailable, setLoginIdAvailable] = useState<boolean | null>(null);

  const checkLoginIdAvailability = async () => {
    if (!formData.loginId) {
      alert("로그인 ID를 입력해 주세요.");
      return;
    }

    setLoadingCheckLoginId(true);
    try {
      const response = await authApi.get<boolean>(`/api/users/exists/${formData.loginId}`);
      const exists = response.data;
      setLoginIdAvailable(!exists);
      alert(exists ? "이미 사용 중인 로그인 ID입니다." : "사용 가능한 로그인 ID입니다.");
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "중복 확인에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setLoadingCheckLoginId(false);
    }
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.loginId || !formData.password || !formData.name || !formData.email) {
      alert("필수 항목을 모두 입력해 주세요.");
      return;
    }

    if (loginIdAvailable === false) {
      alert("다른 로그인 ID를 사용해 주세요.");
      return;
    }

    if (formData.password !== passwordConfirm) {
      alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    signup({
      loginId: formData.loginId,
      password: formData.password,
      name: formData.name,
      roleType: formData.roleType,
      email: formData.email,
      isSocial: false,
      socialProviderType: null,
    });
  };

  return (
    <Page>
      <h1>회원가입</h1>

      <Form onSubmit={handleSignup}>
        <div>
          <Label>로그인 ID *</Label>
          <Row>
            <Field
              type="text"
              value={formData.loginId}
              onChange={(e) => {
                setFormData({ ...formData, loginId: e.target.value });
                setLoginIdAvailable(null);
              }}
              placeholder="로그인 ID를 입력해 주세요"
              disabled={isPending}
            />
            <ActionButton
              type="button"
              onClick={checkLoginIdAvailability}
              disabled={loadingCheckLoginId || isPending || !formData.loginId}
            >
              {loadingCheckLoginId ? "확인 중..." : "중복확인"}
            </ActionButton>
          </Row>
          {loginIdAvailable !== null && (
            <AvailabilityText $available={loginIdAvailable}>
              {loginIdAvailable ? "사용 가능한 로그인 ID입니다." : "이미 사용 중입니다."}
            </AvailabilityText>
          )}
        </div>

        <div>
          <Label>비밀번호 *</Label>
          <Field
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="6자 이상 입력해 주세요"
            disabled={isPending}
          />
        </div>

        <div>
          <Label>비밀번호 확인 *</Label>
          <Field
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            disabled={isPending}
          />
        </div>

        <div>
          <Label>이름 *</Label>
          <Field
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="이름을 입력해 주세요"
            disabled={isPending}
          />
        </div>

        <div>
          <Label>이메일 *</Label>
          <Field
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="이메일을 입력해 주세요"
            disabled={isPending}
          />
        </div>

        <div>
          <Label>역할</Label>
          <Select
            value={formData.roleType}
            onChange={(e) => setFormData({ ...formData, roleType: e.target.value as UserRoleType })}
            disabled={isPending}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="TRAINER">TRAINER</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
        </div>

        {isError && (
          <ErrorBox>
            {error instanceof Error ? error.message : "회원가입에 실패했습니다."}
          </ErrorBox>
        )}

        <PrimaryButton type="submit" disabled={isPending}>
          {isPending ? "가입 중..." : "회원가입"}
        </PrimaryButton>

        <Center>
          <span>이미 계정이 있으신가요? </span>
          <LinkButton type="button" onClick={() => navigate("/login")}>
            로그인
          </LinkButton>
        </Center>
      </Form>
    </Page>
  );
};

export default SignupPage;
