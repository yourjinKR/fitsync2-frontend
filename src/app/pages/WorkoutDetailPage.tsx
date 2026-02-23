import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useWorkoutDetailQuery } from "../features/workout/hooks/useWorkoutDetailQuery";

const Wrap = styled.main`
  padding: 24px;
`;

export function WorkoutDetailPage() {
  const { workoutId } = useParams();
  const parsedId = Number(workoutId);
  const { data, isLoading, isError, error } = useWorkoutDetailQuery(parsedId);

  return (
    <Wrap>
      <h1>운동 기록 상세</h1>
      <p>
        <Link to="/test/workouts">운동 기록 목록</Link>
      </p>
      {isLoading && <p>상세 조회 중...</p>}
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
      {!isLoading && !isError && data && (
        <>
          <p>ID: {data.id}</p>
          <p>ownerId: {data.ownerId}</p>
          <p>writerId: {data.writerId}</p>
          <p>memo: {data.memo || "-"}</p>
          <h3>운동 목록</h3>
          <ul>
            {data.workoutExercises.map((exercise) => (
              <li key={`${exercise.exerciseId}-${exercise.order}`}>
                exerciseId={exercise.exerciseId}, sets={exercise.sets.length}
              </li>
            ))}
          </ul>
        </>
      )}
    </Wrap>
  );
}
