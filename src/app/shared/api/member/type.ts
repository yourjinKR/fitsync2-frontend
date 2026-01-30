// src/api/user/types.ts

// 예: MALE/FEMALE 등 (프로젝트 enum에 맞게 수정)
export type Gender =
  | "MALE"
  | "FEMALE"
  | "UNKNOWN";

// 예: USER/TRAINER/ADMIN 등 (프로젝트 enum에 맞게 수정)
export type UserRoleType =
  | "USER"
  | "TRAINER"
  | "ADMIN";

// 예: NAVER/GOOGLE/KAKAO 등 (프로젝트 enum에 맞게 수정)
export type SocialProviderType =
  | "NAVER"
  | "GOOGLE"
  | "KAKAO";

/**
 * Java LocalDateTime
 */
export type LocalDateTimeString = string;

/**
 * 자체 회원가입/유저 생성 요청 DTO
 */
export type UserRequest = {
  loginId: string;
  password: string;
  name: string;
  gender: Gender;
  birth: LocalDateTimeString;
  roleType: UserRoleType;
  email: string;
  isSocial: boolean;
  socialProviderType: SocialProviderType | null;
};

/**
 * Spring Security GrantedAuthority 단순화 타입
 * (백엔드에서 authorities를 어떻게 내려주는지에 따라 변경 가능)
 */
export type GrantedAuthority = {
  authority: string;
};

/**
 * ✅ 소셜 로그인 사용자 표현 (CustomOAuth2User 대응)
 * Java: attributes(Map), authorities(Collection), loginId(String)
 *
 * getName()은 loginId를 리턴하지만,
 * 프론트에서는 보통 loginId를 직접 쓰므로 name 필드는 선택으로 둡니다.
 */
export type CustomOAuth2User = {
  attributes: Record<string, unknown>;
  authorities: GrantedAuthority[]; // 혹시 string[]으로 내려오면 그에 맞게 변경
  loginId: string;

  // 선택: 서버가 name을 포함해서 내려주는 경우 대비
  name?: string;
};
