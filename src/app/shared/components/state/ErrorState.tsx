type ErrorStateProps = {
  message?: string;
  error?: unknown;
};

export function ErrorState({ message = "오류가 발생했습니다.", error }: ErrorStateProps) {
  const detail = error instanceof Error ? error.message : "알 수 없는 오류";
  return (
    <p>
      {message} ({detail})
    </p>
  );
}

