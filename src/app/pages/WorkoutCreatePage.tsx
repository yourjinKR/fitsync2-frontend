import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateWorkoutMutation } from "../features/workout/hooks/useCreateWorkoutMutation";
import type { WorkoutExerciseRequest, WorkoutRequest } from "../features/workout/types/workout";

const Wrap = styled.main`
  padding: 24px;
`;

const DEFAULT_EXERCISES = JSON.stringify(
  [
    {
      exerciseId: 1,
      order: 1,
      sets: [{ order: 1, reps: 10, weight: 40 }],
    },
  ],
  null,
  2,
);

export function WorkoutCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateWorkoutMutation();

  const [writerId, setWriterId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [memo, setMemo] = useState("");
  const [workoutExercisesText, setWorkoutExercisesText] = useState(DEFAULT_EXERCISES);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let workoutExercises: WorkoutExerciseRequest[] = [];
    try {
      workoutExercises = JSON.parse(workoutExercisesText) as WorkoutExerciseRequest[];
    } catch {
      alert("workoutExercises는 JSON 배열 형식으로 입력해야 합니다.");
      return;
    }

    const parsedWriterId = Number(writerId);
    const parsedOwnerId = Number(ownerId);
    if (!parsedWriterId || !parsedOwnerId) {
      alert("writerId, ownerId를 입력해주세요.");
      return;
    }

    const request: WorkoutRequest = {
      writerId: parsedWriterId,
      ownerId: parsedOwnerId,
      memo: memo || undefined,
      workoutExercises,
    };

    const created = await mutateAsync(request);
    navigate(`/workouts/${created.id}`);
  };

  return (
    <Wrap>
      <h1>운동 기록 생성</h1>
      <p>
        <Link to="/workouts">운동 기록 목록</Link>
      </p>
      <form onSubmit={onSubmit}>
        <p>
          <label htmlFor="workout-writer-id">writerId </label>
          <input
            id="workout-writer-id"
            type="number"
            value={writerId}
            onChange={(e) => setWriterId(e.target.value)}
            required
          />
        </p>
        <p>
          <label htmlFor="workout-owner-id-create">ownerId </label>
          <input
            id="workout-owner-id-create"
            type="number"
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            required
          />
        </p>
        <p>
          <label htmlFor="workout-memo">memo </label>
          <input
            id="workout-memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor="workout-exercises-json">workoutExercises(JSON)</label>
          <br />
          <textarea
            id="workout-exercises-json"
            value={workoutExercisesText}
            onChange={(e) => setWorkoutExercisesText(e.target.value)}
            rows={14}
            style={{ width: "100%", maxWidth: "680px" }}
          />
        </p>
        <button type="submit" disabled={isPending}>
          {isPending ? "생성 중..." : "생성"}
        </button>
      </form>
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
    </Wrap>
  );
}

