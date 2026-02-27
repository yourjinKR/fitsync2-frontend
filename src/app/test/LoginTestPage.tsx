import type { SocialProviderType } from '../features/user/types/member';

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const LoginTestPage = () => {
    const handleSocialLogin = (provider : SocialProviderType) => {
        window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider.toLowerCase()}`
    };

  return (
    <div>
      <button onClick={() => handleSocialLogin("NAVER")}>Naver로 계속하기</button>
      <button onClick={() => handleSocialLogin("GOOGLE")}>Google로 계속하기</button>
      <button onClick={() => handleSocialLogin("KAKAO")}>Kakao로 계속하기</button>
    </div>
  );
};

export default LoginTestPage;