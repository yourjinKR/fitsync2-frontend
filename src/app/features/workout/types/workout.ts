export type WorkoutSetRequest = {
  order: number;
  weight?: number;
  reps?: number;
  durationSeconds?: number;
  distanceMeter?: number;
};

export type WorkoutExerciseRequest = {
  exerciseId: number;
  order: number;
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
  sort?: string[];
};

export type WorkoutListItemResponse = {
  id: number;
  ownerId: number;
  writerId: number;
  workoutDateTime?: string;
  memo?: string;
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

export type WorkoutListResponse = PageResponse<WorkoutListItemResponse>;

export type WorkoutSetDetailResponse = {
  order: number;
  weight?: number;
  reps?: number;
  durationSeconds?: number;
  distanceMeter?: number;
};

export type WorkoutExerciseDetailResponse = {
  exerciseId: number;
  exerciseName?: string;
  order: number;
  memo?: string;
  sets: WorkoutSetDetailResponse[];
};

export type WorkoutDetailResponse = {
  id: number;
  ownerId: number;
  writerId: number;
  memo?: string;
  workoutDateTime?: string;
  workoutExercises: WorkoutExerciseDetailResponse[];
};

