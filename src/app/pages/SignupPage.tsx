import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "../features/user/apis/createUser";
import { authApi, ApiError } from "../shared/apis/http";
import type { UserRequest, Gender, UserRoleType } from "../features/user/types/member";

const SignupPage = () => {
  const navigate = useNavigate();
  const { mutate: signup, isPending, isError, error } = useMutation({
    mutationFn: (request: UserRequest) => createUser(request),
    onSuccess: () => {
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    },
  });

  const [formData, setFormData] = useState<Partial<UserRequest>>({
    loginId: "",
    password: "",
    name: "",
    gender: "MALE",
    birth: "",
    email: "",
    roleType: "MEMBER",
    isSocial: false,
    socialProviderType: null,
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loadingCheckLoginId, setLoadingCheckLoginId] = useState(false);
  const [loginIdAvailable, setLoginIdAvailable] = useState<boolean | null>(null);

  // 로그인 아이디 중복 확인
  const checkLoginIdAvailability = async () => {
    if (!formData.loginId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    setLoadingCheckLoginId(true);
    try {
      const response = await authApi.get<boolean>(`/api/users/exists/${formData.loginId}`);
      const exists = response.data;
      setLoginIdAvailable(!exists);
      if (exists) {
        alert("이미 사용 중인 아이디입니다.");
      } else {
        alert("사용 가능한 아이디입니다.");
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "중복 확인에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setLoadingCheckLoginId(false);
    }
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.loginId || !formData.password || !formData.name || !formData.email || !formData.birth) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (loginIdAvailable === false) {
      alert("아이디 중복 확인을 해주세요.");
      return;
    }

    if (formData.password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      alert("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    // 회원가입 요청
    signup({
      loginId: formData.loginId,
      password: formData.password,
      name: formData.name,
      gender: (formData.gender || "MALE") as Gender,
      birth: formData.birth,
      email: formData.email,
      roleType: (formData.roleType || "USER") as UserRoleType,
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
        {/* 아이디 */}
        <div>
          <label style={labelStyle}>아이디 *</label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={formData.loginId || ""}
              onChange={(e) => {
                setFormData({ ...formData, loginId: e.target.value });
                setLoginIdAvailable(null);
              }}
              placeholder="아이디를 입력해주세요"
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
              {loginIdAvailable ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."}
            </div>
          )}
        </div>

        {/* 비밀번호 */}
        <div>
          <label style={labelStyle}>비밀번호 *</label>
          <input
            type="password"
            value={formData.password || ""}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="비밀번호를 입력해주세요 (6자 이상)"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div>
          <label style={labelStyle}>비밀번호 확인 *</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        {/* 이름 */}
        <div>
          <label style={labelStyle}>이름 *</label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="이름을 입력해주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        {/* 성별 */}
        <div>
          <label style={labelStyle}>성별</label>
          <select
            value={formData.gender || "MALE"}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })}
            style={inputStyle}
            disabled={isPending}
          >
            <option value="MALE">남성</option>
            <option value="FEMALE">여성</option>
            <option value="UNKNOWN">선택 안 함</option>
          </select>
        </div>

        {/* 생년월일 */}
        <div>
          <label style={labelStyle}>생년월일 *</label>
          <input
            type="date"
            value={formData.birth || ""}
            onChange={(e) => setFormData({ ...formData, birth: e.target.value })}
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        {/* 이메일 */}
        <div>
          <label style={labelStyle}>이메일 *</label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="이메일을 입력해주세요"
            style={inputStyle}
            disabled={isPending}
          />
        </div>

        {/* 에러 메시지 */}
        {isError && (
          <div style={{ color: "red", fontSize: "14px", padding: "10px", backgroundColor: "#ffe0e0", borderRadius: "4px" }}>
            {error instanceof Error ? error.message : "회원가입에 실패했습니다."}
          </div>
        )}

        {/* 가입 버튼 */}
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
          {isPending ? "회원가입 중..." : "회원가입"}
        </button>

        {/* 로그인 링크 */}
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
