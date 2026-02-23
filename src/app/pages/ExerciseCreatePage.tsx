import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateExerciseMutation } from "../features/exercise/hooks/useCreateExerciseMutation";
import type { ExerciseCategory, ExerciseRequest } from "../features/exercise/types/exercise";

const Wrap = styled.main`
  padding: 24px;
`;

const Field = styled.div`
  margin-bottom: 10px;
`;

const parseCsv = (value: string): string[] =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export function ExerciseCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateExerciseMutation();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("FITNESS");
  const [description, setDescription] = useState("");
  const [detailsText, setDetailsText] = useState("{}");
  const [targetsText, setTargetsText] = useState("");
  const [effectsText, setEffectsText] = useState("");
  const [equipmentsText, setEquipmentsText] = useState("");
  const [requiredMetricsText, setRequiredMetricsText] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let details: Record<string, unknown> = {};
    try {
      details = JSON.parse(detailsText) as Record<string, unknown>;
    } catch {
      alert("details는 JSON 형식으로 입력해야 합니다.");
      return;
    }

    const request: ExerciseRequest = {
      name,
      category,
      description,
      details,
      targets: parseCsv(targetsText).map((targetType) => ({ targetType })),
      effects: parseCsv(effectsText),
      equipments: parseCsv(equipmentsText),
      requiredMetrics: parseCsv(requiredMetricsText),
    };

    const created = await mutateAsync(request);
    navigate(`/exercises/${created.id}`);
  };

  return (
    <Wrap>
      <h1>운동 생성</h1>
      <p>
        <Link to="/exercises">운동 목록</Link>
      </p>
      <form onSubmit={onSubmit}>
        <Field>
          <label htmlFor="exercise-name">이름</label>
          <input
            id="exercise-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field>
          <label htmlFor="exercise-category-create">카테고리</label>
          <select
            id="exercise-category-create"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExerciseCategory)}
          >
            <option value="FITNESS">FITNESS</option>
            <option value="CROSSFIT">CROSSFIT</option>
            <option value="YOGA">YOGA</option>
            <option value="PILATES">PILATES</option>
            <option value="REHAB">REHAB</option>
          </select>
        </Field>
        <Field>
          <label htmlFor="exercise-description">설명</label>
          <textarea
            id="exercise-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Field>
        <Field>
          <label htmlFor="exercise-details">details(JSON)</label>
          <textarea
            id="exercise-details"
            value={detailsText}
            onChange={(e) => setDetailsText(e.target.value)}
          />
        </Field>
        <Field>
          <label htmlFor="exercise-targets">targets (콤마 구분)</label>
          <input
            id="exercise-targets"
            value={targetsText}
            onChange={(e) => setTargetsText(e.target.value)}
            placeholder="CHEST, BACK"
            required
          />
        </Field>
        <Field>
          <label htmlFor="exercise-effects">effects (콤마 구분)</label>
          <input
            id="exercise-effects"
            value={effectsText}
            onChange={(e) => setEffectsText(e.target.value)}
            placeholder="STRENGTH, ENDURANCE"
            required
          />
        </Field>
        <Field>
          <label htmlFor="exercise-equipments">equipments (콤마 구분)</label>
          <input
            id="exercise-equipments"
            value={equipmentsText}
            onChange={(e) => setEquipmentsText(e.target.value)}
            placeholder="DUMBBELL, BARBELL"
            required
          />
        </Field>
        <Field>
          <label htmlFor="exercise-metrics">requiredMetrics (콤마 구분)</label>
          <input
            id="exercise-metrics"
            value={requiredMetricsText}
            onChange={(e) => setRequiredMetricsText(e.target.value)}
            placeholder="WEIGHT, REPS"
            required
          />
        </Field>
        <button type="submit" disabled={isPending}>
          {isPending ? "생성 중..." : "생성"}
        </button>
      </form>
      {isError && <p>오류: {error instanceof Error ? error.message : "알 수 없는 오류"}</p>}
    </Wrap>
  );
}
