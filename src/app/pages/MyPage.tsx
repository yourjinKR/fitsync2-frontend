import React, { useEffect, useState } from "react";
import { getMyUserInfo } from "../features/user/apis/getMyUserInfo";
import { useMyProfileQuery } from "../features/profile/hooks/useMyProfileQuery";
import { useCreateProfileMutation } from "../features/profile/hooks/useCreateProfileMutation";
import type { UserProfileRequest, WorkoutGoal, ExerciseCategory } from "../features/profile/types/profile";
import type { Gender } from "../features/user/types/member";
import { ApiError } from "../shared/apis/http";

const MyPage = () => {
  const userId = 7; // TODO: 로그인된 유저 정보에서 가져오기
  const { data, isLoading, isError, error } = useMyProfileQuery(userId);
  const { mutate: createProfile, isPending } = useCreateProfileMutation();

  const [formData, setFormData] = useState<Partial<UserProfileRequest>>({
    userId,
    gender: undefined,
    birth: "",
    workoutGoals: [],
    exerciseCategories: [],
    disease: "",
    height: undefined,
    weight: undefined,
    skeletalMuscleMass: undefined,
    bodyFatMass: undefined,
    bodyFatPercentage: undefined,
    bmi: undefined,
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

  if (isLoading) return <div>로딩...</div>;

  // 프로필이 없는 경우 (404 에러)
  if (isError) {
    const isApiError = error instanceof ApiError;
    const errorMessage = isApiError ? error.message : (error instanceof Error ? error.message : "알 수 없는 오류");
    const is404 = isApiError && error.status === 404;

    if (is404) {
      return (
        <div>
          <h1>프로필 생성</h1>
          <p>프로필을 생성하여 운동 목표와 정보를 설정해주세요.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                formData.gender &&
                formData.birth &&
                formData.workoutGoals?.length &&
                formData.exerciseCategories?.length
              ) {
                createProfile(formData as UserProfileRequest);
              } else {
                alert("필수 항목을 모두 입력해주세요.");
              }
            }}
          >
            <div>
              <label htmlFor="gender">성별: </label>
              <select
                id="gender"
                value={formData.gender || ""}
                onChange={(e) => {
                  const value = e.target.value as Gender;
                  setFormData({ ...formData, gender: value });
                }}
              >
                <option value="">선택</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
            </div>

            <div>
              <label htmlFor="birth">생년월일: </label>
              <input
                id="birth"
                type="date"
                value={formData.birth || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, birth: value });
                }}
              />
            </div>

            <div>
              <label>운동 목표: </label>
              <div>
                {[
                  { value: "WEIGHT_LOSS", label: "체중 감량" },
                  { value: "MUSCLE_GAIN", label: "근력 증가" },
                  { value: "BODY_BALANCE", label: "신체 균형" },
                  { value: "STRENGTH", label: "강화" },
                  { value: "ENDURANCE", label: "지구력" },
                  { value: "REHABILITATION", label: "재활" },
                  { value: "HEALTH_MAINTENANCE", label: "건강 유지" },
                ].map((goal) => (
                  <label key={goal.value}>
                    <input
                      type="checkbox"
                      checked={formData.workoutGoals?.includes(goal.value as WorkoutGoal) || false}
                      onChange={(e) => {
                        const newGoals = formData.workoutGoals || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            workoutGoals: [...newGoals, goal.value as WorkoutGoal],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            workoutGoals: newGoals.filter((g) => g !== goal.value),
                          });
                        }
                      }}
                    />
                    {goal.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label>운동 카테고리: </label>
              <div>
                {[
                  { value: "FITNESS", label: "피트니스" },
                  { value: "CROSSFIT", label: "크로스핏" },
                  { value: "YOGA", label: "요가" },
                  { value: "PILATES", label: "필라테스" },
                  { value: "REHAB", label: "재활" },
                ].map((category) => (
                  <label key={category.value}>
                    <input
                      type="checkbox"
                      checked={formData.exerciseCategories?.includes(category.value as ExerciseCategory) || false}
                      onChange={(e) => {
                        const newCategories = formData.exerciseCategories || [];
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            exerciseCategories: [...newCategories, category.value as ExerciseCategory],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            exerciseCategories: newCategories.filter((c) => c !== category.value),
                          });
                        }
                      }}
                    />
                    {category.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="height">키 (cm): </label>
              <input
                id="height"
                type="number"
                step="0.1"
                value={formData.height || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="weight">체중 (kg): </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div>
              <label htmlFor="disease">질병/부상: </label>
              <input
                id="disease"
                type="text"
                value={formData.disease || ""}
                onChange={(e) =>
                  setFormData({ ...formData, disease: e.target.value })
                }
              />
            </div>

            <div>
              <label htmlFor="skeletalMuscleMass">골격근량 : </label>
              <input
                id="skeletalMuscleMass"
                type="number"
                value={formData.skeletalMuscleMass || ""}
                onChange={(e) =>
                  setFormData(({...formData, skeletalMuscleMass: e.target.value ? parseFloat(e.target.value) : undefined}))
                }
              />
            </div>

            <div>
              <label htmlFor="bodyFatMass">체지방량 : </label>
              <input
                id="bodyFatMass"
                type="number"
                value={formData.bodyFatMass || ""}
                onChange={(e) =>
                  setFormData(({...formData, bodyFatMass: e.target.value ? parseFloat(e.target.value) : undefined}))
                }
              />
            </div>

            <div>
              <label htmlFor="bodyFatPercentage">채지방률 : </label>
              <input
                id="bodyFatPercentage"
                type="number"
                value={formData.bodyFatPercentage || ""}
                onChange={(e) =>
                  setFormData(({...formData, bodyFatPercentage: e.target.value ? parseFloat(e.target.value) : undefined}))
                }
              />
            </div>

            <div>
              <label htmlFor="bmi">채지방률 : </label>
              <input
                id="bmi"
                type="number"
                value={formData.bmi || ""}
                onChange={(e) =>
                  setFormData(({...formData, bmi: e.target.value ? parseFloat(e.target.value) : undefined}))
                }
              />
            </div>

            <button type="submit" disabled={isPending}>
              {isPending ? "생성 중..." : "프로필 생성"}
            </button>
          </form>
        </div>
      );
    }

    // 다른 에러
    return (
      <div>
        프로필을 불러오지 못했습니다.
        <div>{errorMessage}</div>
      </div>
    );
  }

  return (
    <div>
      <h1>마이 페이지</h1>
      <div>{data?.user.name}</div>
      <div>
        <h2>프로필 정보</h2>
        <p>성별: {data?.userProfile.gender}</p>
        <p>생년월일: {data?.userProfile.birth}</p>
        <p>키: {data?.userProfile.height} cm</p>
        <p>체중: {data?.userProfile.weight} kg</p>
        <p>골격근량: {data?.userProfile.skeletalMuscleMass} </p>
        <p>BMI: {data?.userProfile.bmi}</p>
        <p>체지방률: {data?.userProfile.bodyFatPercentage}%</p>
      </div>
    </div>
  );
};

export default MyPage;
