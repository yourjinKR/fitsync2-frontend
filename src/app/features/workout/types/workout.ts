export type WorkoutSetRequest = {
  memo?: string;
  displayOrder: number;
  weightKg?: number;
  reps?: number;
  distanceM?: number;
  durationSec?: number;
  speedKmh?: number;
  rpe?: number;
  restTimeSec?: number;
};

export type WorkoutExerciseRequest = {
  exerciseId: number;
  memo?: string;
  sets: WorkoutSetRequest[];
};

export type WorkoutRequest = {
  writerId: number;
  ownerId: number;
  memo?: string;
  workoutExercises: WorkoutExerciseRequest[];
};

export type WorkoutResponse = {
  id: number;
};

export type WorkoutListRequest = {
  ownerId?: number;
  page?: number;
  size?: number;
  sort?: string | string[];
};

export type WorkoutListItemResponse = {
  id: number;
  createdAt: string;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type WorkoutListResponse = PageResponse<WorkoutListItemResponse>;

export type WorkoutSetDetailResponse = {
  id: number;
  memo?: string;
  weightKg?: number;
  reps?: number;
  distanceM?: number;
  durationSec?: number;
  speedKmh?: number;
  rpe?: number;
  restTimeSec?: number;
};

export type ExerciseSummaryResponse = {
  id: number;
  name: string;
};

export type WorkoutExerciseDetailResponse = {
  id: number;
  exercise: ExerciseSummaryResponse;
  memo?: string;
  workoutSets: WorkoutSetDetailResponse[];
};

export type WorkoutDetailResponse = {
  id: number;
  ownerId: number;
  writerId: number;
  memo?: string;
  createdAt: string;
  workoutExercises: WorkoutExerciseDetailResponse[];
};
