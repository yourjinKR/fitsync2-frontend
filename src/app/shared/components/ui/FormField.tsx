import type { ReactNode } from "react";
import styled from "styled-components";

const Field = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.label`
  display: inline-block;
  margin-bottom: 4px;
`;

const ErrorText = styled.p`
  margin: 4px 0 0;
  font-size: 12px;
  color: #ffb4b4;
`;

type FormFieldProps = {
  label?: string;
  htmlFor?: string;
  error?: string;
  children: ReactNode;
};

/**
 * 폼 입력 UI를 라벨/입력요소/에러메시지 구조로 감싸는 공통 필드 래퍼입니다.
 *
 * @param props.label 입력 요소 상단 라벨 텍스트
 * @param props.htmlFor 라벨과 입력 요소를 연결할 `id` 값
 * @param props.error 검증 실패 시 노출할 에러 메시지
 * @param props.children 실제 입력 컴포넌트(`input`, `select`, 커스텀 필드 등)
 */
export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <Field>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  );
}
