type ErrorStateProps = {
  message?: string;
  error?: unknown;
};

/**
 * 요청 실패 등 오류 상태를 표현하는 공통 UI입니다.
 * `error`가 `Error` 인스턴스인 경우 해당 메시지를 상세 정보로 노출합니다.
 *
 * @param props.message 오류 상황에서 기본으로 보여줄 사용자 메시지
 * @param props.error 원본 오류 객체(옵션)
 */
export function ErrorState({ message = "오류가 발생했습니다.", error }: ErrorStateProps) {
  const detail = error instanceof Error ? error.message : "알 수 없는 오류";
  return (
    <p>
      {message} ({detail})
    </p>
  );
}
