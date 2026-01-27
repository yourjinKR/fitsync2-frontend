import styled from "styled-components";
import BackendConnectionTest from "../shared/ui/BackendConnectionTest";

const Wrap = styled.main`
  padding: 24px;
`;

export function HomePage() {
  return (
    <Wrap>
      <h1>Home</h1>
      <p>Vite + React + TS + styled-components baseline</p>
      <BackendConnectionTest/>
    </Wrap>
  );
}