export type ExerciseCategory =
  | "FITNESS"
  | "CROSSFIT"
  | "YOGA"
  | "PILATES"
  | "REHAB";

export type EffectType = string;
export type Equipment = string;
export type MetricType = string;

export type ExerciseTargetRequest = {
  targetType: string;
  difficulty?: number;
};

export type ExerciseRequest = {
  name: string;
  category: ExerciseCategory;
  description: string;
  details: Record<string, unknown>;
  targets: ExerciseTargetRequest[];
  effects: EffectType[];
  equipments: Equipment[];
  requiredMetrics: MetricType[];
};

export type ExerciseResponse = {
  id: number;
};

export type ExerciseListRequest = {
  category?: ExerciseCategory;
  hidden?: boolean;
  page?: number;
  size?: number;
  sort?: string[];
};

export type ExerciseListItemResponse = {
  id: number;
  name: string;
  category: ExerciseCategory;
  hidden: boolean;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
};

export type ExerciseListResponse = PageResponse<ExerciseListItemResponse>;

export type ExerciseDetailResponse = {
  id: number;
  name: string;
  category: ExerciseCategory;
  description: string;
  details: Record<string, unknown>;
  targets: Array<Record<string, unknown>>;
  effects: EffectType[];
  equipments: Equipment[];
  requiredMetrics: MetricType[];
  hidden: boolean;
};

