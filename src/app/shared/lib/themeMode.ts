export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "fitsync-theme-mode";

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark";
}

export function getInitialThemeMode(): ThemeMode {
  const savedMode = window.localStorage.getItem(STORAGE_KEY);
  if (isThemeMode(savedMode)) {
    return savedMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyThemeMode(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
  window.localStorage.setItem(STORAGE_KEY, mode);
}
