import styled from "styled-components";
import BackendConnectionTest from "../test/BackendConnectionTest";
import LogoutButton from "../features/user/components/LogoutButton";

const Wrap = styled.main`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export function HomePage() {
  return (
    <Wrap>
      <Header>
        <h1>Home</h1>
        <LogoutButton
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        />
      </Header>
      <p>Vite + React + TS + styled-components baseline</p>
      <BackendConnectionTest/>
    </Wrap>
  );
}