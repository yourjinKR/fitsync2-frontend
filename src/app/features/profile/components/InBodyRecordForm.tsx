import { type FormEvent, useState } from "react";
import type { InBodyRecordRequest } from "../types/profile";

export interface InBodyRecordFormProps {
  onSubmit: (request: InBodyRecordRequest) => void;
  isLoading?: boolean;
}

export const InBodyRecordForm = ({ onSubmit, isLoading = false }: InBodyRecordFormProps) => {
  const [formData, setFormData] = useState<InBodyRecordRequest>({
    weight: 0,
    skeletalMuscleMass: 0,
    bodyFatMass: 0,
    bodyFatPercentage: 0,
    bmi: 0,
  });

  const handleNumberChange = (field: keyof InBodyRecordRequest, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({
      ...prev,
      [field]: Number.isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const hasInvalidValue =
      formData.weight <= 0 ||
      formData.skeletalMuscleMass <= 0 ||
      formData.bodyFatMass <= 0 ||
      formData.bodyFatPercentage <= 0 ||
      formData.bmi <= 0;

    if (hasInvalidValue) {
      alert("모든 수치는 0보다 큰 값으로 입력해 주세요.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="weight">체중 (kg) *</label>
        <input id="weight" type="number" step="0.1" min="0" value={formData.weight || ""} onChange={(e) => handleNumberChange("weight", e.target.value)} disabled={isLoading} required />
      </div>
      <div>
        <label htmlFor="skeletalMuscleMass">골격근량 (kg) *</label>
        <input id="skeletalMuscleMass" type="number" step="0.1" min="0" value={formData.skeletalMuscleMass || ""} onChange={(e) => handleNumberChange("skeletalMuscleMass", e.target.value)} disabled={isLoading} required />
      </div>
      <div>
        <label htmlFor="bodyFatMass">체지방량 (kg) *</label>
        <input id="bodyFatMass" type="number" step="0.1" min="0" value={formData.bodyFatMass || ""} onChange={(e) => handleNumberChange("bodyFatMass", e.target.value)} disabled={isLoading} required />
      </div>
      <div>
        <label htmlFor="bodyFatPercentage">체지방률 (%) *</label>
        <input id="bodyFatPercentage" type="number" step="0.1" min="0" max="100" value={formData.bodyFatPercentage || ""} onChange={(e) => handleNumberChange("bodyFatPercentage", e.target.value)} disabled={isLoading} required />
      </div>
      <div>
        <label htmlFor="bmi">BMI *</label>
        <input id="bmi" type="number" step="0.1" min="0" value={formData.bmi || ""} onChange={(e) => handleNumberChange("bmi", e.target.value)} disabled={isLoading} required />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "저장 중..." : "인바디 기록 저장"}
      </button>
    </form>
  );
};
