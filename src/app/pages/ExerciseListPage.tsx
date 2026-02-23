import { Link } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import { useExerciseListQuery } from "../features/exercise/hooks/useExerciseListQuery";
import type { ExerciseCategory } from "../features/exercise/types/exercise";

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
  const { data, isLoading, isError, error } = useExerciseListQuery({
    category: category || undefined,
    hidden,
    page: 0,
    size: 20,
  });

  return (
    <Wrap>
      <h1>운동 목록</h1>
      <Row>
        <Link to="/exercises/new">운동 생성</Link>
        <Link to="/">홈으로</Link>
      </Row>
      <Row>
        <label htmlFor="exercise-category">카테고리</label>
        <select
          id="exercise-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as ExerciseCategory | "")}
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
          onChange={(e) => setHidden(e.target.checked)}
        />
      </Row>
      {isLoading && <p>목록 조회 중...</p>}
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
      {!isLoading && !isError && (
        <ul>
          {data?.content.map((item) => (
            <li key={item.id}>
              <Link to={`/exercises/${item.id}`}>{item.name}</Link> ({item.category})
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}

