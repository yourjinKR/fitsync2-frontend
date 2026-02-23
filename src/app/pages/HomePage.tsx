import styled from "styled-components";
import BackendConnectionTest from "../test/BackendConnectionTest";
import LogoutButton from "../features/user/components/LogoutButton";
import { Link } from "react-router-dom";

const Wrap = styled.main`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
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
      <Nav>
        <Link to="/test/exercises">운동 목록</Link>
        <Link to="/test/exercises/new">운동 생성</Link>
        <Link to="/test/workouts">운동 기록 목록</Link>
        <Link to="/test/workouts/new">운동 기록 생성</Link>
      </Nav>
      <BackendConnectionTest/>
    </Wrap>
  );
}
