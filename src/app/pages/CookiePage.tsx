import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../shared/api/http";

type JWTResponse = {
  accessToken: string;
  refreshToken: string;
};

const CookiePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const cookieToBody = async () => {
      try {
        const { data } = await authApi.post<JWTResponse>(
          "/jwt/exchange",
          null,
          { withCredentials: true } // ✅ 여기만 true
        );

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        navigate("/");
      } catch (error) {
        console.error(error);
        alert("소셜 로그인 실패");
        navigate("/login");
      }
    };

    cookieToBody();
  }, [navigate]);

  return <div>소셜 로그인 처리 중...</div>;
};

export default CookiePage;
