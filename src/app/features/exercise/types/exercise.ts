export type ExerciseCategory =
  | "FITNESS"
  | "CROSSFIT"
  | "YOGA"
  | "PILATES"
  | "REHAB";

export type TargetRole = "MAIN" | "SUB";

export type EffectType =
  | "STRENGTH"
  | "ENDURANCE"
  | "CARDIO"
  | "FLEXIBILITY"
  | "MOBILITY";

export type Equipment =
  | "NO_EQUIPMENT"
  | "DUMBBELLS"
  | "BARBELL"
  | "BENCH"
  | "CABLE"
  | "BOSU_TRAINER"
  | "TRX"
  | "BOX"
  | "STABILITY_BALL"
  | "MEDICINE_BALL"
  | "CONES"
  | "WEIGHT_MACHINES"
  | "PULL_UP_BAR"
  | "LADDER"
  | "HURDLES"
  | "KETTLE_BELLS"
  | "ROPE";

export type MetricType =
  | "WEIGHT"
  | "REPS"
  | "DISTANCE"
  | "TIME"
  | "SPEED"
  | "RPE"
  | "REST_TIME";

export const EFFECT_TYPES: EffectType[] = [
  "STRENGTH",
  "ENDURANCE",
  "CARDIO",
  "FLEXIBILITY",
  "MOBILITY",
];

export const EQUIPMENT_TYPES: Equipment[] = [
  "NO_EQUIPMENT",
  "DUMBBELLS",
  "BARBELL",
  "BENCH",
  "CABLE",
  "BOSU_TRAINER",
  "TRX",
  "BOX",
  "STABILITY_BALL",
  "MEDICINE_BALL",
  "CONES",
  "WEIGHT_MACHINES",
  "PULL_UP_BAR",
  "LADDER",
  "HURDLES",
  "KETTLE_BELLS",
  "ROPE",
];

export const METRIC_TYPES: MetricType[] = [
  "WEIGHT",
  "REPS",
  "DISTANCE",
  "TIME",
  "SPEED",
  "RPE",
  "REST_TIME",
];

export type ExerciseTargetRequest = {
  bodyDetailPartId: number;
  targetRole: TargetRole;
};

export type BodyDetailPartListResponse = {
  id: number;
  detailPartName: string;
  partName: string;
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
