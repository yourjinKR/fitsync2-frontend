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

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <Field>
      {label ? <Label htmlFor={htmlFor}>{label}</Label> : null}
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  );
}

