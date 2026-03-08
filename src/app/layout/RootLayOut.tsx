import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { ThemeToggle } from "../shared/components/ui/ThemeToggle";

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px 0;
`;

export function RootLayout() {
  return (
    <Shell>
      <Header>
        <ThemeToggle />
      </Header>
      <Outlet />
    </Shell>
  );
}
