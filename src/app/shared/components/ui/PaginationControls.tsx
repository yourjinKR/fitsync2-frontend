import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

/**
 * 목록 화면에서 사용하는 기본 페이지네이션 컨트롤입니다.
 * 0-based `page` 기준으로 이전/다음 버튼 활성 상태를 계산합니다.
 *
 * @param props.page 현재 페이지(0부터 시작)
 * @param props.totalPages 전체 페이지 수
 * @param props.onPrev 이전 페이지 이동 핸들러
 * @param props.onNext 다음 페이지 이동 핸들러
 */
export function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const isPrevDisabled = page <= 0;
  const isNextDisabled = page >= safeTotalPages - 1;

  return (
    <Wrap>
      <button type="button" onClick={onPrev} disabled={isPrevDisabled}>
        Prev
      </button>
      <button type="button" onClick={onNext} disabled={isNextDisabled}>
        Next
      </button>
      <span>
        page {page + 1} / {safeTotalPages}
      </span>
    </Wrap>
  );
}
