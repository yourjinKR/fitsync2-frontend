import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateWorkoutMutation } from "../features/workout/hooks/useCreateWorkoutMutation";
import { ApiError } from "../shared/apis/http";
import { useExerciseListQuery } from "../features/exercise/hooks/useExerciseListQuery";
import type { ExerciseListItemResponse } from "../features/exercise/types/exercise";
import type { WorkoutExerciseRequest, WorkoutRequest, WorkoutSetRequest } from "../features/workout/types/workout";

const Wrap = styled.main`
  padding: 24px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 16px;
`;

type DraftSet = {
  memo: string;
  displayOrder: string;
  weightKg: string;
  reps: string;
  distanceM: string;
  durationSec: string;
  speedKmh: string;
  rpe: string;
  restTimeSec: string;
};

type DraftWorkoutExercise = {
  exerciseId: number;
  exerciseName: string;
  memo: string;
  sets: DraftSet[];
};

const makeDraftSet = (displayOrder: number): DraftSet => ({
  memo: "",
  displayOrder: String(displayOrder),
  weightKg: "",
  reps: "",
  distanceM: "",
  durationSec: "",
  speedKmh: "",
  rpe: "",
  restTimeSec: "",
});

const parseOptionalPositiveInt = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) return undefined;
  return num;
};

const parseRequiredPositiveInt = (value: string): number | null => {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) return null;
  return num;
};

export function WorkoutCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateWorkoutMutation();
  const { data: exercisePage, isLoading: isExerciseListLoading } = useExerciseListQuery({
    hidden: false,
    page: 0,
    size: 100,
  });

  const [writerId, setWriterId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [memo, setMemo] = useState("");
  const [search, setSearch] = useState("");
  const [workoutExercises, setWorkoutExercises] = useState<DraftWorkoutExercise[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    const list = exercisePage?.content ?? [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;
    return list.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [exercisePage?.content, search]);

  const addExercise = (exercise: ExerciseListItemResponse) => {
    setWorkoutExercises((prev) => {
      if (prev.some((item) => item.exerciseId === exercise.id)) return prev;
      return [
        ...prev,
        {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          memo: "",
          sets: [makeDraftSet(1)],
        },
      ];
    });
  };

  const removeExercise = (exerciseId: number) => {
    setWorkoutExercises((prev) => prev.filter((item) => item.exerciseId !== exerciseId));
  };

  const updateExerciseMemo = (exerciseId: number, nextMemo: string) => {
    setWorkoutExercises((prev) =>
      prev.map((item) => (item.exerciseId === exerciseId ? { ...item, memo: nextMemo } : item)),
    );
  };

  const addSet = (exerciseId: number) => {
    setWorkoutExercises((prev) =>
      prev.map((item) => {
        if (item.exerciseId !== exerciseId) return item;
        return { ...item, sets: [...item.sets, makeDraftSet(item.sets.length + 1)] };
      }),
    );
  };

  const removeSet = (exerciseId: number, setIndex: number) => {
    setWorkoutExercises((prev) =>
      prev.map((item) => {
        if (item.exerciseId !== exerciseId) return item;
        if (item.sets.length === 1) return item;
        return { ...item, sets: item.sets.filter((_, idx) => idx !== setIndex) };
      }),
    );
  };

  const updateSetField = (
    exerciseId: number,
    setIndex: number,
    field: keyof DraftSet,
    value: string,
  ) => {
    setWorkoutExercises((prev) =>
      prev.map((item) => {
        if (item.exerciseId !== exerciseId) return item;
        return {
          ...item,
          sets: item.sets.map((set, idx) => (idx === setIndex ? { ...set, [field]: value } : set)),
        };
      }),
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parsedWriterId = parseRequiredPositiveInt(writerId);
    const parsedOwnerId = parseRequiredPositiveInt(ownerId);
    if (!parsedWriterId || !parsedOwnerId) {
      setFormError("writerId, ownerId는 1 이상의 숫자여야 합니다.");
      return;
    }

    if (!workoutExercises.length) {
      setFormError("workoutExercises는 최소 1개 이상이어야 합니다.");
      return;
    }

    const parsedWorkoutExercises: WorkoutExerciseRequest[] = [];
    for (const exercise of workoutExercises) {
      if (!exercise.sets.length) {
        setFormError(`운동(${exercise.exerciseName})에는 최소 1개 set이 필요합니다.`);
        return;
      }

      const parsedSets: WorkoutSetRequest[] = [];
      for (const set of exercise.sets) {
        const displayOrder = parseRequiredPositiveInt(set.displayOrder);
        if (!displayOrder) {
          setFormError(`운동(${exercise.exerciseName})의 set displayOrder는 1 이상의 정수여야 합니다.`);
          return;
        }

        parsedSets.push({
          memo: set.memo.trim() || undefined,
          displayOrder,
          weightKg: parseOptionalPositiveInt(set.weightKg),
          reps: parseOptionalPositiveInt(set.reps),
          distanceM: parseOptionalPositiveInt(set.distanceM),
          durationSec: parseOptionalPositiveInt(set.durationSec),
          speedKmh: parseOptionalPositiveInt(set.speedKmh),
          rpe: parseOptionalPositiveInt(set.rpe),
          restTimeSec: parseOptionalPositiveInt(set.restTimeSec),
        });
      }

      parsedWorkoutExercises.push({
        exerciseId: exercise.exerciseId,
        memo: exercise.memo.trim() || undefined,
        sets: parsedSets,
      });
    }

    const request: WorkoutRequest = {
      writerId: parsedWriterId,
      ownerId: parsedOwnerId,
      memo: memo || undefined,
      workoutExercises: parsedWorkoutExercises,
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
        <Layout>
          <section>
            <h3>운동 선택</h3>
            <input
              placeholder="운동명 검색"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "100%", marginBottom: "8px" }}
            />
            {isExerciseListLoading && <p>운동 목록 조회 중...</p>}
            <ul style={{ maxHeight: "420px", overflow: "auto", paddingLeft: "18px" }}>
              {filteredExercises.map((exercise) => (
                <li key={exercise.id} style={{ marginBottom: "6px" }}>
                  <button type="button" onClick={() => addExercise(exercise)}>
                    추가
                  </button>{" "}
                  {exercise.name} ({exercise.category})
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>선택된 운동/세트</h3>
            {!workoutExercises.length && <p>왼쪽에서 운동을 추가하세요.</p>}
            {workoutExercises.map((exercise) => (
              <div key={exercise.exerciseId} style={{ border: "1px solid #333", padding: "10px", marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <strong>
                    {exercise.exerciseName} (id:{exercise.exerciseId})
                  </strong>
                  <button type="button" onClick={() => removeExercise(exercise.exerciseId)}>
                    운동 제거
                  </button>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <label>운동 memo </label>
                  <input
                    value={exercise.memo}
                    onChange={(e) => updateExerciseMemo(exercise.exerciseId, e.target.value)}
                  />
                </div>
                <div style={{ marginTop: "8px" }}>
                  {exercise.sets.map((set, setIndex) => (
                    <div key={`${exercise.exerciseId}-set-${setIndex}`} style={{ marginBottom: "8px", padding: "8px", border: "1px dashed #555" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <input
                          placeholder="displayOrder"
                          value={set.displayOrder}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "displayOrder", e.target.value)}
                          style={{ width: "100px" }}
                        />
                        <input
                          placeholder="weightKg"
                          value={set.weightKg}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "weightKg", e.target.value)}
                          style={{ width: "100px" }}
                        />
                        <input
                          placeholder="reps"
                          value={set.reps}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "reps", e.target.value)}
                          style={{ width: "100px" }}
                        />
                        <input
                          placeholder="distanceM"
                          value={set.distanceM}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "distanceM", e.target.value)}
                          style={{ width: "100px" }}
                        />
                        <input
                          placeholder="durationSec"
                          value={set.durationSec}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "durationSec", e.target.value)}
                          style={{ width: "110px" }}
                        />
                        <input
                          placeholder="speedKmh"
                          value={set.speedKmh}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "speedKmh", e.target.value)}
                          style={{ width: "100px" }}
                        />
                        <input
                          placeholder="rpe"
                          value={set.rpe}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "rpe", e.target.value)}
                          style={{ width: "80px" }}
                        />
                        <input
                          placeholder="restTimeSec"
                          value={set.restTimeSec}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "restTimeSec", e.target.value)}
                          style={{ width: "120px" }}
                        />
                      </div>
                      <div style={{ marginTop: "6px" }}>
                        <input
                          placeholder="set memo"
                          value={set.memo}
                          onChange={(e) => updateSetField(exercise.exerciseId, setIndex, "memo", e.target.value)}
                          style={{ width: "70%" }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSet(exercise.exerciseId, setIndex)}
                          disabled={exercise.sets.length === 1}
                          style={{ marginLeft: "8px" }}
                        >
                          set 제거
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => addSet(exercise.exerciseId)}>
                    set 추가
                  </button>
                </div>
              </div>
            ))}
          </section>
        </Layout>
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
