import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyUserInfo } from "../features/user/apis/getMyUserInfo";
import { useMyProfileQuery } from "../features/profile/hooks/useMyProfileQuery";
import { useCreateProfileMutation } from "../features/profile/hooks/useCreateProfileMutation";
import LogoutButton from "../features/user/components/LogoutButton";
import type { ExerciseCategory, UserProfileRequest, WorkoutGoal } from "../features/profile/types/profile";
import type { Gender } from "../features/user/types/member";
import { ApiError } from "../shared/apis/http";

type ProfileDraft = {
  gender: Gender | "";
  birth: string;
  workoutGoals: WorkoutGoal[];
  exerciseCategories: ExerciseCategory[];
  disease: string;
  height: string;
  weight: string;
  skeletalMuscleMass: string;
  bodyFatMass: string;
  bodyFatPercentage: string;
  bmi: string;
};

const GOALS: Array<{ value: WorkoutGoal; label: string }> = [
  { value: "WEIGHT_LOSS", label: "체중 감량" },
  { value: "MUSCLE_GAIN", label: "근력 증가" },
  { value: "BODY_BALANCE", label: "신체 균형" },
  { value: "STRENGTH", label: "강화" },
  { value: "ENDURANCE", label: "지구력" },
  { value: "REHABILITATION", label: "재활" },
  { value: "HEALTH_MAINTENANCE", label: "건강 유지" },
];

const CATEGORIES: Array<{ value: ExerciseCategory; label: string }> = [
  { value: "FITNESS", label: "피트니스" },
  { value: "CROSSFIT", label: "크로스핏" },
  { value: "YOGA", label: "요가" },
  { value: "PILATES", label: "필라테스" },
  { value: "REHAB", label: "재활" },
];

const isPositive = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
};

const MyPage = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMyProfileQuery();
  const { mutate: createProfile, isPending } = useCreateProfileMutation();

  const [formData, setFormData] = useState<ProfileDraft>({
    gender: "",
    birth: "",
    workoutGoals: [],
    exerciseCategories: [],
    disease: "",
    height: "",
    weight: "",
    skeletalMuscleMass: "",
    bodyFatMass: "",
    bodyFatPercentage: "",
    bmi: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMyUserInfo();
        console.log("me:", user);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUser();
  }, []);

  const profileRequest = useMemo<UserProfileRequest | null>(() => {
    if (!formData.gender || !formData.birth) return null;
    if (!formData.workoutGoals.length || !formData.exerciseCategories.length) return null;
    if (
      !isPositive(formData.height) ||
      !isPositive(formData.weight) ||
      !isPositive(formData.skeletalMuscleMass) ||
      !isPositive(formData.bodyFatMass) ||
      !isPositive(formData.bodyFatPercentage) ||
      !isPositive(formData.bmi)
    ) {
      return null;
    }

    return {
      gender: formData.gender,
      birth: formData.birth,
      workoutGoals: formData.workoutGoals,
      exerciseCategories: formData.exerciseCategories,
      disease: formData.disease || undefined,
      height: Number(formData.height),
      weight: Number(formData.weight),
      skeletalMuscleMass: Number(formData.skeletalMuscleMass),
      bodyFatMass: Number(formData.bodyFatMass),
      bodyFatPercentage: Number(formData.bodyFatPercentage),
      bmi: Number(formData.bmi),
    };
  }, [formData]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
        <h1>로딩 중..</h1>
        <LogoutButton style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }} />
      </div>
    );
  }

  if (isError) {
    const isApiError = error instanceof ApiError;
    const errorMessage = isApiError ? error.message : error instanceof Error ? error.message : "알 수 없는 오류";
    const is404 = isApiError && error.status === 404;

    if (is404) {
      return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h1>프로필 생성</h1>
            <LogoutButton style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }} />
          </div>
          <p>프로필을 생성하여 운동 목표와 정보를 설정해 주세요.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!profileRequest) {
              alert("필수 항목을 모두 입력해 주세요. 신체 수치는 0보다 커야 합니다.");
              return;
            }
            createProfile(profileRequest);
          }}>
            <div>
              <label htmlFor="gender">성별: </label>
              <select id="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender | "" })}>
                <option value="">선택</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
            </div>
            <div>
              <label htmlFor="birth">생년월일: </label>
              <input id="birth" type="date" value={formData.birth} onChange={(e) => setFormData({ ...formData, birth: e.target.value })} />
            </div>
            <div>
              <label>운동 목표: </label>
              <div>
                {GOALS.map((goal) => (
                  <label key={goal.value}>
                    <input type="checkbox" checked={formData.workoutGoals.includes(goal.value)} onChange={(e) => setFormData({ ...formData, workoutGoals: e.target.checked ? [...formData.workoutGoals, goal.value] : formData.workoutGoals.filter((g) => g !== goal.value) })} />
                    {goal.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label>운동 카테고리: </label>
              <div>
                {CATEGORIES.map((category) => (
                  <label key={category.value}>
                    <input type="checkbox" checked={formData.exerciseCategories.includes(category.value)} onChange={(e) => setFormData({ ...formData, exerciseCategories: e.target.checked ? [...formData.exerciseCategories, category.value] : formData.exerciseCategories.filter((c) => c !== category.value) })} />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>
            <div><label htmlFor="height">키(cm): </label><input id="height" type="number" step="0.1" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} /></div>
            <div><label htmlFor="weight">체중(kg): </label><input id="weight" type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} /></div>
            <div><label htmlFor="disease">질환/부상: </label><input id="disease" type="text" value={formData.disease} onChange={(e) => setFormData({ ...formData, disease: e.target.value })} /></div>
            <div><label htmlFor="skeletalMuscleMass">골격근량: </label><input id="skeletalMuscleMass" type="number" step="0.1" value={formData.skeletalMuscleMass} onChange={(e) => setFormData({ ...formData, skeletalMuscleMass: e.target.value })} /></div>
            <div><label htmlFor="bodyFatMass">체지방량: </label><input id="bodyFatMass" type="number" step="0.1" value={formData.bodyFatMass} onChange={(e) => setFormData({ ...formData, bodyFatMass: e.target.value })} /></div>
            <div><label htmlFor="bodyFatPercentage">체지방률: </label><input id="bodyFatPercentage" type="number" step="0.1" value={formData.bodyFatPercentage} onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })} /></div>
            <div><label htmlFor="bmi">BMI: </label><input id="bmi" type="number" step="0.1" value={formData.bmi} onChange={(e) => setFormData({ ...formData, bmi: e.target.value })} /></div>
            <button type="submit" disabled={isPending}>{isPending ? "생성 중..." : "프로필 생성"}</button>
          </form>
        </div>
      );
    }

    return (
      <div>
        <h1>오류 발생</h1>
        <p>프로필을 불러오지 못했습니다.</p>
        <div>{errorMessage}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>마이 페이지</h1>
        <LogoutButton style={{ padding: "8px 16px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }} />
      </div>
      <div>{data?.user.name}</div>
      <div>
        <h2>프로필 정보</h2>
        <p>성별: {data?.userProfile.gender}</p>
        <p>생년월일: {data?.userProfile.birth}</p>
        <p>키: {data?.userProfile.height} cm</p>
        <p>체중: {data?.userProfile.weight} kg</p>
        <p>골격근량: {data?.userProfile.skeletalMuscleMass}</p>
        <p>BMI: {data?.userProfile.bmi}</p>
        <p>체지방률: {data?.userProfile.bodyFatPercentage}%</p>
        <button onClick={() => navigate("/me/inbody")} style={{ marginTop: "15px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>
          인바디 정보 수정
        </button>
      </div>
    </div>
  );
};

export default MyPage;
