import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useWorkoutListQuery } from "../features/workout/hooks/useWorkoutListQuery";

const Wrap = styled.main`
  padding: 24px;
`;

export function WorkoutListPage() {
  const [ownerIdInput, setOwnerIdInput] = useState("");
  const ownerId = ownerIdInput ? Number(ownerIdInput) : undefined;
  const { data, isLoading, isError, error } = useWorkoutListQuery({
    ownerId,
    page: 0,
    size: 20,
  });

  return (
    <Wrap>
      <h1>운동 기록 목록</h1>
      <p>
        <Link to="/workouts/new">운동 기록 생성</Link> | <Link to="/">홈으로</Link>
      </p>
      <p>
        <label htmlFor="workout-owner-id">ownerId 필터 </label>
        <input
          id="workout-owner-id"
          type="number"
          value={ownerIdInput}
          onChange={(e) => setOwnerIdInput(e.target.value)}
          placeholder="예: 1"
        />
      </p>
      {isLoading && <p>목록 조회 중...</p>}
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
      {!isLoading && !isError && (
        <ul>
          {data?.content.map((item) => (
            <li key={item.id}>
              <Link to={`/workouts/${item.id}`}>#{item.id}</Link> owner:{item.ownerId} writer:
              {item.writerId}
            </li>
          ))}
        </ul>
      )}
    </Wrap>
  );
}

