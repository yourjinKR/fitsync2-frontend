export const theme = {
  colors: {
    bg: "#0b0d12",
    surface: "#121621",
    text: "#e9ecf1",
    subText: "#aab2c0",
    primary: "#FEDA3E" // 사용자님 테마 컬러 기억 반영
  }
} as const;

export type AppTheme = typeof theme;
