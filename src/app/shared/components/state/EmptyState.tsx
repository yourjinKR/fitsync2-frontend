type EmptyStateProps = {
  message?: string;
};

export function EmptyState({ message = "표시할 데이터가 없습니다." }: EmptyStateProps) {
  return <p>{message}</p>;
}

