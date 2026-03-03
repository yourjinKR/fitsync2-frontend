type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = "로딩 중..." }: LoadingStateProps) {
  return <p>{message}</p>;
}

