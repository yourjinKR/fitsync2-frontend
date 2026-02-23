import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateWorkoutMutation } from "../features/workout/hooks/useCreateWorkoutMutation";
import { ApiError } from "../shared/apis/http";
import type { WorkoutExerciseRequest, WorkoutRequest } from "../features/workout/types/workout";

const Wrap = styled.main`
  padding: 24px;
`;

const DEFAULT_EXERCISES = JSON.stringify(
  [
    {
      exerciseId: 1,
      memo: "스쿼트",
      sets: [{ displayOrder: 1, reps: 10, weightKg: 40, restTimeSec: 90 }],
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
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    let workoutExercises: WorkoutExerciseRequest[] = [];
    try {
      workoutExercises = JSON.parse(workoutExercisesText) as WorkoutExerciseRequest[];
    } catch {
      setFormError("workoutExercises는 JSON 배열 형식이어야 합니다.");
      return;
    }

    const parsedWriterId = Number(writerId);
    const parsedOwnerId = Number(ownerId);
    if (!parsedWriterId || !parsedOwnerId) {
      setFormError("writerId, ownerId는 1 이상의 숫자여야 합니다.");
      return;
    }

    if (!workoutExercises.length) {
      setFormError("workoutExercises는 최소 1개 이상이어야 합니다.");
      return;
    }

    const hasInvalidExercise = workoutExercises.some(
      (exercise) =>
        !exercise.exerciseId ||
        exercise.exerciseId <= 0 ||
        !exercise.sets?.length ||
        exercise.sets.some((set) => !set.displayOrder || set.displayOrder <= 0),
    );
    if (hasInvalidExercise) {
      setFormError("각 exercise는 exerciseId(>0)와 sets(displayOrder>0)을 포함해야 합니다.");
      return;
    }

    const request: WorkoutRequest = {
      writerId: parsedWriterId,
      ownerId: parsedOwnerId,
      memo: memo || undefined,
      workoutExercises,
    };

    try {
      const created = await mutateAsync(request);
      navigate(`/test/workouts/${created.id}`);
    } catch {
      // 에러 표시는 mutation state로 처리
    }
  };

  return (
    <Wrap>
      <h1>운동 기록 생성</h1>
      <p>
        <Link to="/test/workouts">운동 기록 목록</Link>
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
          <small>
            예시: [{`{"exerciseId":1,"memo":"스쿼트","sets":[{"displayOrder":1,"weightKg":40,"reps":10}]}`}]
          </small>
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
      {formError && <p style={{ color: "#ffb4b4" }}>{formError}</p>}
      {isError && (
        <div>
          <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>
          {error instanceof ApiError && error.errors?.length ? (
            <ul>
              {error.errors.map((fieldError, idx) => (
                <li key={`${fieldError.field}-${idx}`}>
                  {fieldError.field}: {fieldError.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </Wrap>
  );
}
