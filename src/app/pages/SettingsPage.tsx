import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ThemeToggle } from "../shared/components/ui/ThemeToggle";

const Page = styled.div`
  max-width: 760px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  cursor: pointer;
`;

const Section = styled.section`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  padding: 16px;
`;

const Label = styled.p`
  margin-bottom: 10px;
  color: var(--color-text-secondary);
`;

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <Header>
        <h1>설정</h1>
        <BackButton type="button" onClick={() => navigate("/me")}>
          마이페이지로
        </BackButton>
      </Header>

      <Section>
        <h2>화면 테마</h2>
        <Label>밝은 테마/어두운 테마를 선택할 수 있습니다.</Label>
        <ThemeToggle />
      </Section>
    </Page>
  );
}
