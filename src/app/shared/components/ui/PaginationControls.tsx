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