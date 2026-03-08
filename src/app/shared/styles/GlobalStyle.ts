import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light;

    /* Primitive OKLCH palette */
    --oklch-neutral-99: oklch(99% 0.003 250);
    --oklch-neutral-96: oklch(96% 0.004 250);
    --oklch-neutral-90: oklch(90% 0.008 250);
    --oklch-neutral-84: oklch(84% 0.01 250);
    --oklch-neutral-28: oklch(28% 0.012 250);
    --oklch-neutral-20: oklch(20% 0.013 250);
    --oklch-neutral-16: oklch(16% 0.012 250);

    /* Brand green: #2ECC71 느낌을 유지하되 과하지 않게 조정 */
    --oklch-brand-72: oklch(72% 0.16 151);
    --oklch-brand-64: oklch(64% 0.17 151);
    --oklch-brand-56: oklch(56% 0.16 151);
    --oklch-brand-48: oklch(48% 0.14 151);

    /* Status */
    --oklch-success: oklch(64% 0.16 151);
    --oklch-warning: oklch(76% 0.16 84);
    --oklch-error: oklch(60% 0.2 28);
    --oklch-info: oklch(66% 0.15 245);

    /* Semantic colors */
    --color-bg: var(--oklch-neutral-99);
    --color-surface: #ffffff;
    --color-surface-elevated: var(--oklch-neutral-96);
    --color-text-primary: oklch(24% 0.013 252);
    --color-text-secondary: oklch(40% 0.012 252);
    --color-text-muted: oklch(54% 0.01 252);
    --color-border: var(--oklch-neutral-84);

    --color-brand: var(--oklch-brand-56);
    --color-brand-strong: var(--oklch-brand-48);
    --color-brand-soft: var(--oklch-brand-72);

    --color-success: var(--oklch-success);
    --color-warning: var(--oklch-warning);
    --color-error: var(--oklch-error);
    --color-info: var(--oklch-info);

    --color-focus-ring: var(--oklch-brand-64);
    --color-selection-bg: color-mix(in oklab, var(--color-brand) 32%, transparent);
    --color-selection-text: var(--color-text-primary);
    --color-placeholder: color-mix(in oklab, var(--color-text-muted) 80%, transparent);
    --color-disabled-bg: color-mix(in oklab, var(--color-bg) 70%, var(--color-border));
    --color-disabled-text: color-mix(in oklab, var(--color-text-muted) 76%, transparent);

    /* Typography */
    --font-body: "Pretendard Variable", "Pretendard", "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    --font-mono: "JetBrains Mono", "Fira Code", "Consolas", monospace;
    --font-size-sm: 14px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --line-height-sm: 1.45;
    --line-height-md: 1.5;
    --line-height-lg: 1.6;
    --letter-spacing-tight: -0.012em;
    --letter-spacing-normal: -0.005em;

    /* Radius / shadow */
    --radius-xs: 8px;
    --radius-sm: 12px;
    --radius-md: 16px;
    --radius-lg: 22px;
    --shadow-1: 0 2px 8px color-mix(in oklab, black 8%, transparent);
    --shadow-2: 0 10px 24px color-mix(in oklab, black 12%, transparent);
    --shadow-focus: 0 0 0 3px color-mix(in oklab, var(--color-focus-ring) 40%, transparent);
  }

  html[data-theme="dark"] {
    color-scheme: dark;
    --color-bg: oklch(16% 0.012 252);
    --color-surface: oklch(21% 0.013 252);
    --color-surface-elevated: oklch(25% 0.013 252);
    --color-text-primary: oklch(94% 0.01 252);
    --color-text-secondary: oklch(82% 0.01 252);
    --color-text-muted: oklch(69% 0.01 252);
    --color-border: oklch(34% 0.012 252);

    --color-brand: var(--oklch-brand-64);
    --color-brand-strong: var(--oklch-brand-72);
    --color-brand-soft: oklch(38% 0.09 151);

    --color-focus-ring: var(--oklch-brand-72);
    --color-selection-text: oklch(96% 0.01 252);
    --color-placeholder: color-mix(in oklab, var(--color-text-muted) 72%, transparent);
    --color-disabled-bg: color-mix(in oklab, var(--color-surface) 70%, var(--color-border));
    --color-disabled-text: color-mix(in oklab, var(--color-text-muted) 70%, transparent);

    --shadow-1: 0 4px 14px color-mix(in oklab, black 34%, transparent);
    --shadow-2: 0 14px 30px color-mix(in oklab, black 45%, transparent);
    --shadow-focus: 0 0 0 3px color-mix(in oklab, var(--color-focus-ring) 35%, transparent);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
  }

  html,
  body,
  #root {
    width: 100%;
    min-height: 100%;
  }

  html {
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    background: var(--color-bg);
  }

  body {
    background: var(--color-bg);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    font-size: var(--font-size-md);
    line-height: var(--line-height-md);
    letter-spacing: var(--letter-spacing-normal);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;

    /* Mobile web safe area */
    padding-top: env(safe-area-inset-top);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
  }

  #root {
    display: flex;
    flex-direction: column;
  }

  a {
    color: var(--color-brand);
    text-decoration: none;
    text-underline-offset: 0.15em;
  }

  a:hover {
    color: var(--color-brand-strong);
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
    color: inherit;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    line-height: var(--line-height-sm);
  }

  button {
    cursor: pointer;
    border: 0;
  }

  input,
  textarea,
  select {
    border: 1px solid var(--color-border);
  }

  ::placeholder {
    color: var(--color-placeholder);
  }

  :disabled,
  [aria-disabled="true"] {
    background: var(--color-disabled-bg);
    color: var(--color-disabled-text);
    cursor: not-allowed;
  }

  :focus-visible {
    outline: 2px solid var(--color-focus-ring);
    outline-offset: 2px;
    box-shadow: var(--shadow-focus);
  }

  ::selection {
    background: var(--color-selection-bg);
    color: var(--color-selection-text);
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: color-mix(in oklab, var(--color-text-muted) 35%, transparent) transparent;
  }

  *::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    background: color-mix(in oklab, var(--color-text-muted) 35%, transparent);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: content-box;
  }
`;
