import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCreateExerciseMutation } from "../features/exercise/hooks/useCreateExerciseMutation";
import { useBodyDetailPartListQuery } from "../features/exercise/hooks/useBodyDetailPartListQuery";
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
  type TargetRole,
} from "../features/exercise/types/exercise";

const Wrap = styled.main`
  padding: 24px;
`;

const Field = styled.div`
  margin-bottom: 10px;
`;

type TargetFormItem = {
  bodyDetailPartId: string;
  targetRole: TargetRole;
};

type FormErrors = {
  details?: string;
  targets?: string;
  requiredGroup?: string;
};

const DEFAULT_TARGETS: TargetFormItem[] = [{ bodyDetailPartId: "", targetRole: "MAIN" }];

const toggle = <T extends string>(arr: T[], value: T) =>
  arr.includes(value) ? arr.filter((item) => item !== value) : [...arr, value];

export function ExerciseCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateExerciseMutation();
  const {
    data: bodyDetailParts,
    isLoading: isBodyDetailPartsLoading,
    isError: isBodyDetailPartsError,
    error: bodyDetailPartsError,
  } = useBodyDetailPartListQuery();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("FITNESS");
  const [description, setDescription] = useState("");
  const [detailsText, setDetailsText] = useState("{}");
  const [targets, setTargets] = useState<TargetFormItem[]>(DEFAULT_TARGETS);
  const [effects, setEffects] = useState<EffectType[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [requiredMetrics, setRequiredMetrics] = useState<MetricType[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const isSubmitDisabled = useMemo(() => {
    return isPending || !name.trim() || !description.trim();
  }, [description, isPending, name]);

  const addTarget = () => {
    const defaultBodyDetailPartId = bodyDetailParts?.[0]?.id?.toString() ?? "";
    setTargets((prev) => [...prev, { bodyDetailPartId: defaultBodyDetailPartId, targetRole: "SUB" }]);
  };

  const removeTarget = (index: number) => {
    setTargets((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateTarget = (index: number, patch: Partial<TargetFormItem>) => {
    setTargets((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    let details: Record<string, unknown> = {};
    let requestTargets: ExerciseTargetRequest[] = [];
    const nextErrors: FormErrors = {};

    try {
      details = JSON.parse(detailsText) as Record<string, unknown>;
    } catch {
      nextErrors.details = "details는 JSON 형식이어야 합니다.";
    }

    requestTargets = targets
      .map((item) => {
        const resolvedId = item.bodyDetailPartId || bodyDetailParts?.[0]?.id?.toString() || "";
        return {
          bodyDetailPartId: Number(resolvedId),
          targetRole: item.targetRole,
        };
      })
      .map((item) => ({
        bodyDetailPartId: item.bodyDetailPartId,
        targetRole: item.targetRole,
      }))
      .filter((item) => Number.isInteger(item.bodyDetailPartId) && item.bodyDetailPartId > 0);

    if (requestTargets.length === 0) {
      nextErrors.targets = "targets는 최소 1개 이상이며 bodyDetailPartId는 1 이상의 정수여야 합니다.";
    }

    if (effects.length === 0 || equipments.length === 0 || requiredMetrics.length === 0) {
      nextErrors.requiredGroup = "effects/equipments/requiredMetrics는 각각 최소 1개 이상 선택해야 합니다.";
    }

    if (isBodyDetailPartsLoading || isBodyDetailPartsError || !bodyDetailParts?.length) {
      nextErrors.targets = "운동 세부 부위 목록을 불러온 뒤 다시 시도해주세요.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      return;
    }

    const request: ExerciseRequest = {
      name,
      category,
      description,
      details,
      targets: requestTargets,
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
        {formErrors.details && <p style={{ color: "#ffb4b4" }}>{formErrors.details}</p>}
        {formErrors.targets && <p style={{ color: "#ffb4b4" }}>{formErrors.targets}</p>}
        {formErrors.requiredGroup && <p style={{ color: "#ffb4b4" }}>{formErrors.requiredGroup}</p>}
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
            rows={4}
          />
        </Field>
        <Field>
          <label>targets</label>
          <p style={{ margin: "4px 0" }}>bodyDetailPartId + targetRole(MAIN/SUB)를 입력하세요.</p>
          {isBodyDetailPartsLoading && <p>운동 세부 부위 목록을 불러오는 중...</p>}
          {isBodyDetailPartsError && (
            <p>운동 세부 부위 조회 실패: {bodyDetailPartsError instanceof Error ? bodyDetailPartsError.message : "알 수 없는 오류"}</p>
          )}
          {targets.map((target, index) => (
            <div key={`target-${index}`} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
              <select
                value={target.bodyDetailPartId}
                onChange={(e) => updateTarget(index, { bodyDetailPartId: e.target.value })}
                required
                disabled={isBodyDetailPartsLoading || !bodyDetailParts?.length}
              >
                <option value="">{bodyDetailParts?.length ? "선택" : "선택 불가"}</option>
                {bodyDetailParts?.map((part) => (
                  <option key={part.id} value={part.id}>
                    {part.partName} / {part.detailPartName} (id:{part.id})
                  </option>
                ))}
              </select>
              <select
                value={target.targetRole}
                onChange={(e) => updateTarget(index, { targetRole: e.target.value as TargetRole })}
              >
                <option value="MAIN">MAIN</option>
                <option value="SUB">SUB</option>
              </select>
              <button type="button" onClick={() => removeTarget(index)} disabled={targets.length === 1}>
                삭제
              </button>
            </div>
          ))}
          <button type="button" onClick={addTarget}>
            타겟 추가
          </button>
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
        <button type="submit" disabled={isSubmitDisabled}>
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
