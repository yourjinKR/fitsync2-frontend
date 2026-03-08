type EmptyStateProps = {
  message?: string;
};

/**
 * 조회 결과가 비어있는 상태를 표현하는 공통 UI입니다.
 *
 * @param props.message 빈 상태에서 사용자에게 보여줄 안내 문구
 */
export function EmptyState({ message = "표시할 데이터가 없습니다." }: EmptyStateProps) {
  return <p>{message}</p>;
}
