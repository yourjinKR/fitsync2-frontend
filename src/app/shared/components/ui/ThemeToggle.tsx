import { useEffect, useState } from "react";
import styled from "styled-components";
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from "../../lib/themeMode";

const ToggleButton = styled.button`
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  border-radius: var(--radius-sm);
  padding: 8px 12px;
  box-shadow: var(--shadow-1);
`;

/**
 * 전역 라이트/다크 모드 전환 버튼입니다.
 * 선택된 모드는 `data-theme`와 localStorage에 동기화합니다.
 */
export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialThemeMode());

  useEffect(() => {
    applyThemeMode(mode);
  }, [mode]);

  const handleToggle = () => {
    const nextMode: ThemeMode = mode === "light" ? "dark" : "light";
    setMode(nextMode);
    applyThemeMode(nextMode);
  };

  return (
    <ToggleButton type="button" onClick={handleToggle} aria-label="테마 전환">
      {mode === "light" ? "다크 모드" : "라이트 모드"}
    </ToggleButton>
  );
}
