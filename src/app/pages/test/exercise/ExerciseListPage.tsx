import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { useExerciseListQuery } from "../../../features/exercise/hooks/useExerciseListQuery";
import type { ExerciseCategory } from "../../../features/exercise/types/exercise";

const Wrap = styled.main`
  padding: 24px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
`;

export function ExerciseListPage() {
  const [category, setCategory] = useState<ExerciseCategory | "">("");
  const [hidden, setHidden] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState("id,desc");
  const { data, isLoading, isError, error } = useExerciseListQuery({
    category: category || undefined,
    hidden,
    page,
    size,
    sort: [sort],
  });

  return (
    <Wrap>
      <h1>운동 목록</h1>
      <Row>
        <Link to="/test/exercises/new">운동 생성</Link>
        <Link to="/">홈으로</Link>
      </Row>
      <Row>
        <label htmlFor="exercise-category">카테고리</label>
        <select
          id="exercise-category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value as ExerciseCategory | "");
            setPage(0);
          }}
        >
          <option value="">전체</option>
          <option value="FITNESS">FITNESS</option>
          <option value="CROSSFIT">CROSSFIT</option>
          <option value="YOGA">YOGA</option>
          <option value="PILATES">PILATES</option>
          <option value="REHAB">REHAB</option>
        </select>
        <label htmlFor="exercise-hidden">숨김 포함</label>
        <input
          id="exercise-hidden"
          type="checkbox"
          checked={hidden}
          onChange={(e) => {
            setHidden(e.target.checked);
            setPage(0);
          }}
        />
      </Row>
      <Row>
        <label htmlFor="exercise-size">size</label>
        <select
          id="exercise-size"
          value={size}
          onChange={(e) => {
            setSize(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <label htmlFor="exercise-sort">sort</label>
        <select
          id="exercise-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="id,desc">id desc</option>
          <option value="id,asc">id asc</option>
        </select>
        <button type="button" onClick={() => setPage((prev) => Math.max(0, prev - 1))} disabled={page === 0}>
          이전
        </button>
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={data ? page >= Math.max(0, data.totalPages - 1) : false}
        >
          다음
        </button>
        <span>
          page {page + 1} / {Math.max(1, data?.totalPages ?? 1)}
        </span>
      </Row>
      {isLoading && <p>목록 조회 중...</p>}
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
      {!isLoading && !isError && (
        <ul>
          {data?.content.map((item) => (
            <li key={item.id}>
              <Link to={`/test/exercises/${item.id}`}>{item.name}</Link> ({item.category})
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}
