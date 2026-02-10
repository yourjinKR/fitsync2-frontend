import { type FormEvent, useState } from "react";
import type { InBodyRecordRequest } from "../types/profile";

export interface InBodyRecordFormProps {
  /**
   * 인바디 기록 생성 완료 콜백
   * @param request 제출된 인바디 기록 요청 정보
   */
  onSubmit: (request: InBodyRecordRequest) => void;

  /**
   * 제출 진행 중 여부 (로딩 상태)
   */
  isLoading?: boolean;

  /**
   * 폼에 초기 userId가 필요한 경우
   */
  userId?: number;
}

/**
 * 인바디 기록(체성분 측정 데이터) 입력 폼 컴포넌트
 * 체중, 골격근량, 체지방량, 체지방률, BMI를 입력받음
 *
 * UI는 순수 컴포넌트로 설계되어 서버 의존성이 없으며,
 * 부모 컴포넌트에서 mutation 실행을 담당
 */
export const InBodyRecordForm = ({onSubmit, isLoading = false, userId,}: InBodyRecordFormProps) => {
  const [formData, setFormData] = useState<InBodyRecordRequest>({
    userId: userId ?? 0,
    weight: 0,
    skeletalMuscleMass: 0,
    bodyFatMass: 0,
    bodyFatPercentage: 0,
    bmi: 0,
  });

  /**
   * 숫자 입력 필드 변경 핸들러
   */
  const handleNumberChange = (
    field: keyof InBodyRecordRequest,
    value: string
  ) => {
    const numValue = value === "" ? 0 : parseFloat(value);

    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  /**
   * 폼 제출 핸들러
   * 입력값 검증 후 onSubmit 콜백 실행
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 기본 검증: userId와 필수 필드 확인
    if (!formData.userId) {
      alert("사용자 정보가 필요합니다.");
      return;
    }

    if (formData.weight <= 0) {
      alert("체중을 입력해주세요.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="weight">체중 (kg) *</label>
        <input
          id="weight"
          type="number"
          step="0.1"
          min="0"
          value={formData.weight || ""}
          onChange={(e) => handleNumberChange("weight", e.target.value)}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label htmlFor="skeletalMuscleMass">골격근량 (kg)</label>
        <input
          id="skeletalMuscleMass"
          type="number"
          step="0.1"
          min="0"
          value={formData.skeletalMuscleMass || ""}
          onChange={(e) =>
            handleNumberChange("skeletalMuscleMass", e.target.value)
          }
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="bodyFatMass">체지방량 (kg)</label>
        <input
          id="bodyFatMass"
          type="number"
          step="0.1"
          min="0"
          value={formData.bodyFatMass || ""}
          onChange={(e) => handleNumberChange("bodyFatMass", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="bodyFatPercentage">체지방률 (%)</label>
        <input
          id="bodyFatPercentage"
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.bodyFatPercentage || ""}
          onChange={(e) =>
            handleNumberChange("bodyFatPercentage", e.target.value)
          }
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="bmi">BMI</label>
        <input
          id="bmi"
          type="number"
          step="0.1"
          min="0"
          value={formData.bmi || ""}
          onChange={(e) => handleNumberChange("bmi", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "저장 중..." : "인바디 기록 저장"}
      </button>
    </form>
  );
};
