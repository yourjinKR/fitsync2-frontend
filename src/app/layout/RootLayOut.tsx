import { Outlet } from "react-router-dom";
import styled from "styled-components";

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export function RootLayout() {
  return (
    <Shell>
      {/* Header 자리 */}
      <Outlet />
    </Shell>
  );
}