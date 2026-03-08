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

/**
 * 페이지 단위 레이아웃의 기본 골격을 제공합니다.
 * 제목 영역과 우측 액션 영역, 본문 콘텐츠 영역을 일관된 간격으로 렌더링합니다.
 *
 * @param props.title 페이지 제목 텍스트
 * @param props.actions 제목 우측에 노출할 액션 영역(버튼, 필터 등)
 * @param props.children 페이지 본문 콘텐츠
 */
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
