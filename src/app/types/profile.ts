import type { Gender, LocalDateString } from "./member";

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
