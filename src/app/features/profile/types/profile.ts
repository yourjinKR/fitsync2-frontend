import type { Gender, LocalDateString } from "../../user/types/member";

export type UserProfileRequest = {
  userId: number;
  gender: Gender;
  birth: LocalDateString;
  workoutGoals: WorkoutGoal[];
  exerciseCategories: ExerciseCategory[];
  disease?: string;
  height?: number;
  weight?: number;
  skeletalMuscleMass?: number;
  bodyFatMass?: number;
  bodyFatPercentage?: number;
  bmi?: number;
};

export type UserWithProfileResponse = {
  userId : number,
  user : UserHeaderInfoResponse,
  profileId : number,
  userProfile : UserProfileDetailResponse
};

export type UserHeaderInfoResponse = {
  name : string,
  hidden : boolean
};

export type UserProfileDetailResponse = {
  gender : Gender,
  birth : LocalDateString,
  workoutGoals : Set<WorkoutGoal>,
  exerciseCategories : Set<ExerciseCategory>,
  disease : string,
  height : number,
  weight : number,
  skeletalMuscleMass : number,
  bodyFatMass : number,
  bodyFatPercentage : number,
  bmi : number
};

export type WorkoutGoal = 
  | "WEIGHT_LOSS"
  | "MUSCLE_GAIN"
  | "BODY_BALANCE"
  | "STRENGTH"
  | "ENDURANCE"
  | "REHABILITATION"
  | "HEALTH_MAINTENANCE";

export type ExerciseCategory = 
  | "FITNESS"
  | "CROSSFIT"
  | "YOGA"
  | "PILATES"
  | "REHAB";
