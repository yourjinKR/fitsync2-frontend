import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useExerciseDetailQuery } from "../features/exercise/hooks/useExerciseDetailQuery";

const Wrap = styled.main`
  padding: 24px;
`;

export function ExerciseDetailPage() {
  const { exerciseId } = useParams();
  const parsedId = Number(exerciseId);
  const { data, isLoading, isError, error } = useExerciseDetailQuery(parsedId);

  return (
    <Wrap>
      <h1>운동 상세</h1>
      <p>
        <Link to="/test/exercises">운동 목록</Link>
      </p>
      {isLoading && <p>상세 조회 중...</p>}
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
      {!isLoading && !isError && data && (
        <>
          <p>ID: {data.id}</p>
          <p>이름: {data.name}</p>
          <p>카테고리: {data.category}</p>
          <p>설명: {data.description}</p>
          <p>효과: {data.effects.join(", ")}</p>
          <p>장비: {data.equipments.join(", ")}</p>
          <p>지표: {data.requiredMetrics.join(", ")}</p>
        </>
      )}
    </Wrap>
  );
}
