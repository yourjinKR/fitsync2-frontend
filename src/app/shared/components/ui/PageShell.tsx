import type { ReactNode } from "react";
import styled from "styled-components";

const Wrap = styled.main`
  padding: 24px;
  width: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
`;

type PageShellProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function PageShell({ title, actions, children }: PageShellProps) {
  return (
    <Wrap>
      <Header>
        <Title>{title}</Title>
        {actions}
      </Header>
      {children}
    </Wrap>
  );
}

