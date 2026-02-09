import React from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../hooks/useLogoutMutation";

interface LogoutButtonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 로그아웃 버튼 컴포넌트
 * 클릭 시 로그아웃 처리 후 로그인 페이지로 이동합니다.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({ className, style }) => {
  const navigate = useNavigate();
  const { mutate: logout, isPending, isError, error } = useLogoutMutation();

  const handleLogout = () => {
    // 로그아웃 API 호출
    logout(undefined, {
      onSuccess: () => {
        // 로그아웃 성공 후 로그인 페이지로 이동
        navigate("/login");
      },
      onError: () => {
        // 로그아웃 실패해도 토큰을 삭제하고 이동
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      },
    });
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        disabled={isPending}
        className={className}
        style={style}
      >
        {isPending ? "로그아웃 중..." : "로그아웃"}
      </button>

      {/* 에러 표시 (선택적) */}
      {isError && (
        <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
          로그아웃 중 오류가 발생했습니다: {error instanceof Error ? error.message : "알 수 없는 오류"}
        </div>
      )}
    </div>
  );
};

export default LogoutButton;
