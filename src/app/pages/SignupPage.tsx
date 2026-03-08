import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
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

  const inputStyle = {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block" as const,
    marginBottom: "5px",
    fontWeight: "bold" as const,
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
      <h1>회원가입</h1>

      <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={labelStyle}>로그인 ID *</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={formData.loginId}
              onChange={(e) => {
                setFormData({ ...formData, loginId: e.target.value });
                setLoginIdAvailable(null);
              }}
              placeholder="로그인 ID를 입력해 주세요"
              style={inputStyle}
              disabled={isPending}
            />
            <button
              type="button"
              onClick={checkLoginIdAvailability}
              disabled={loadingCheckLoginId || isPending || !formData.loginId}
              style={{
                padding: "8px 15px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {loadingCheckLoginId ? "확인 중..." : "중복확인"}
            </button>
          </div>
          {loginIdAvailable !== null && (
            <div style={{ color: loginIdAvailable ? "green" : "red", fontSize: "12px", marginTop: "5px" }}>
              {loginIdAvailable ? "사용 가능한 로그인 ID입니다." : "이미 사용 중입니다."}
            </div>
          )}
        </div>

        <div>
          <label style={labelStyle}>비밀번호 *</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="6자 이상 입력해 주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        <div>
          <label style={labelStyle}>비밀번호 확인 *</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        <div>
          <label style={labelStyle}>이름 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="이름을 입력해 주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        <div>
          <label style={labelStyle}>이메일 *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="이메일을 입력해 주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        <div>
          <label style={labelStyle}>역할</label>
          <select
            value={formData.roleType}
            onChange={(e) => setFormData({ ...formData, roleType: e.target.value as UserRoleType })}
            style={inputStyle}
            disabled={isPending}
          >
            <option value="MEMBER">MEMBER</option>
            <option value="TRAINER">TRAINER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {isError && (
          <div style={{ color: "red", fontSize: "14px", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px" }}>
            {error instanceof Error ? error.message : "회원가입에 실패했습니다."}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: "10px",
            backgroundColor: isPending ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isPending ? "default" : "pointer",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {isPending ? "가입 중..." : "회원가입"}
        </button>

        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <span>이미 계정이 있으신가요? </span>
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
            }}
          >
            로그인
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
