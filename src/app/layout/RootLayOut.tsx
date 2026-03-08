import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

const Shell = styled.div<{ $isTestRoute: boolean }>`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
  align-items: ${({ $isTestRoute }) => ($isTestRoute ? "stretch" : "center")};
`;

const Content = styled.main<{ $isTestRoute: boolean }>`
  width: 100%;
  flex: 1;

  ${({ $isTestRoute }) =>
    $isTestRoute
      ? `
    max-width: none;
    padding: 0;
  `
      : `
    max-width: 430px;
    margin: 0 auto;
    padding: 0 12px 16px;
  `}

  @media (min-width: 768px) {
    ${({ $isTestRoute }) =>
      $isTestRoute
        ? ""
        : `
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      box-shadow: var(--shadow-1);
      background: var(--color-bg);
    `}
  }
`;

export function RootLayout() {
  const location = useLocation();
  const isTestRoute = location.pathname === "/test" || location.pathname.startsWith("/test/");

  return (
    <Shell $isTestRoute={isTestRoute}>
      <Content $isTestRoute={isTestRoute}>
        <Outlet />
      </Content>
    </Shell>
  );
}
