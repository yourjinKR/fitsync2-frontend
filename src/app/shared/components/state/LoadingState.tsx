type LoadingStateProps = {
  message?: string;
};

/**
 * 비동기 작업 진행 중 상태를 표현하는 공통 UI입니다.
 *
 * @param props.message 로딩 상태에서 사용자에게 보여줄 안내 문구
 */
export function LoadingState({ message = "로딩 중..." }: LoadingStateProps) {
  return <p>{message}</p>;
}
