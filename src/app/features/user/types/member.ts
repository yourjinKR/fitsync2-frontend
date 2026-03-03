export type Gender = "MALE" | "FEMALE";

export type UserRoleType = "MEMBER" | "TRAINER" | "ADMIN";

export type SocialProviderType = "NAVER" | "GOOGLE" | "KAKAO";

/**
 * Java LocalDate
 */
export type LocalDateString = string;

/**
 * 회원 생성 요청 DTO (backend UserRequest 기준)
 */
export type UserRequest = {
  loginId: string;
  password: string;
  name: string;
  roleType: UserRoleType;
  email: string;
  isSocial: boolean;
  socialProviderType: SocialProviderType | null;
};

export type UserResponse = {
  id: number;
};

/**
 * 자체 로그인 요청 DTO
 */
export type LoginRequest = {
  loginId: string;
  password: string;
};

/**
 * 로그인 응답 DTO (JWT 토큰)
 */
export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type GrantedAuthority = {
  authority: string;
};

export type CustomOAuth2User = {
  attributes: Record<string, unknown>;
  authorities: GrantedAuthority[];
  loginId: string;
  name?: string;
};
