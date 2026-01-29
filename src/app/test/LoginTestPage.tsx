import React from 'react';
import type { SocialProviderType } from '../shared/api/member/type';

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

const LoginTestPage = () => {
    const handleSocialLogin = (provider : SocialProviderType) => {
        window.location.href = `${BACKEND_API_BASE_URL}/oauth2/authorization/${provider.toLowerCase()}`
    };

  return (
    <div>
      <button onClick={() => handleSocialLogin("NAVER")}>Naver로 계속하기</button>
    </div>
  );
};

export default LoginTestPage;