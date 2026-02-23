import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateExerciseMutation } from "../features/exercise/hooks/useCreateExerciseMutation";
import { ApiError } from "../shared/apis/http";
import {
  EFFECT_TYPES,
  EQUIPMENT_TYPES,
  METRIC_TYPES,
  type EffectType,
  type Equipment,
  type ExerciseCategory,
  type ExerciseRequest,
  type ExerciseTargetRequest,
  type MetricType,
} from "../features/exercise/types/exercise";

const Wrap = styled.main`
  padding: 24px;
`;

const Field = styled.div`
  margin-bottom: 10px;
`;

const DEFAULT_TARGETS = JSON.stringify(
  [
    {
      bodyDetailPartId: 1,
      targetRole: "MAIN",
    },
  ],
  null,
  2,
);

const toggle = <T extends string>(arr: T[], value: T) =>
  arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];

export function ExerciseCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateExerciseMutation();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("FITNESS");
  const [description, setDescription] = useState("");
  const [detailsText, setDetailsText] = useState("{}");
  const [targetsText, setTargetsText] = useState(DEFAULT_TARGETS);
  const [effects, setEffects] = useState<EffectType[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [requiredMetrics, setRequiredMetrics] = useState<MetricType[]>([]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let details: Record<string, unknown> = {};
    let targets: ExerciseTargetRequest[] = [];

    try {
      details = JSON.parse(detailsText) as Record<string, unknown>;
    } catch {
      alert("details는 JSON 형식으로 입력해야 합니다.");
      return;
    }
    try {
      targets = JSON.parse(targetsText) as ExerciseTargetRequest[];
    } catch {
      alert("targets는 JSON 배열 형식으로 입력해야 합니다.");
      return;
    }

    if (targets.length === 0 || effects.length === 0 || equipments.length === 0 || requiredMetrics.length === 0) {
      alert("targets/effects/equipments/requiredMetrics는 최소 1개 이상 필요합니다.");
      return;
    }

    const request: ExerciseRequest = {
      name,
      category,
      description,
      details,
      targets,
      effects,
      equipments,
      requiredMetrics,
    };

    try {
      const created = await mutateAsync(request);
      navigate(`/exercises/${created.id}`);
    } catch {
      // 에러 표시는 mutation state(isError/error)로 처리
    }
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
          <label htmlFor="exercise-targets">targets(JSON)</label>
          <p style={{ margin: "4px 0" }}>
            예시: [{`{"bodyDetailPartId":1,"targetRole":"MAIN"}`}], `targetRole`은 `MAIN|SUB`
          </p>
          <textarea
            id="exercise-targets"
            value={targetsText}
            onChange={(e) => setTargetsText(e.target.value)}
            rows={8}
            required
          />
        </Field>
        <Field>
          <label>effects</label>
          <div>
            {EFFECT_TYPES.map((value) => (
              <label key={value} style={{ display: "inline-flex", marginRight: "10px", gap: "4px" }}>
                <input
                  type="checkbox"
                  checked={effects.includes(value)}
                  onChange={() => setEffects((prev) => toggle(prev, value))}
                />
                {value}
              </label>
            ))}
          </div>
        </Field>
        <Field>
          <label>equipments</label>
          <div>
            {EQUIPMENT_TYPES.map((value) => (
              <label key={value} style={{ display: "inline-flex", marginRight: "10px", gap: "4px" }}>
                <input
                  type="checkbox"
                  checked={equipments.includes(value)}
                  onChange={() => setEquipments((prev) => toggle(prev, value))}
                />
                {value}
              </label>
            ))}
          </div>
        </Field>
        <Field>
          <label>requiredMetrics</label>
          <div>
            {METRIC_TYPES.map((value) => (
              <label key={value} style={{ display: "inline-flex", marginRight: "10px", gap: "4px" }}>
                <input
                  type="checkbox"
                  checked={requiredMetrics.includes(value)}
                  onChange={() => setRequiredMetrics((prev) => toggle(prev, value))}
                />
                {value}
              </label>
            ))}
          </div>
        </Field>
        <button type="submit" disabled={isPending}>
          {isPending ? "생성 중..." : "생성"}
        </button>
      </form>
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
