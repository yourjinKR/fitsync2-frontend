import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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

const Page = styled.div`
  max-width: 760px;
  margin: 24px auto;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-1);
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingsButton = styled.button`
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  cursor: pointer;
  font-weight: 600;
`;

const StyledLogoutButton = styled(LogoutButton)`
  padding: 8px 16px;
  background: var(--color-error);
  color: #fff;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 700;
  box-shadow: var(--shadow-1);
`;

const HelperText = styled.p`
  color: var(--color-text-secondary);
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 700;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-text-secondary);
`;

const PrimaryButton = styled.button`
  margin-top: 8px;
  padding: 10px 14px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: var(--color-brand);
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  box-shadow: var(--shadow-1);

  &:hover:not(:disabled) {
    background: var(--color-brand-strong);
  }
`;

const InBodyButton = styled(PrimaryButton)`
  margin-top: 15px;
`;

const InfoCard = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  padding: 16px;
`;

const ErrorBox = styled.div`
  color: var(--color-error);
  border: 1px solid color-mix(in oklab, var(--color-error) 30%, var(--color-border));
  background: color-mix(in oklab, var(--color-error) 10%, var(--color-surface));
  border-radius: var(--radius-sm);
  padding: 10px 12px;
`;

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
      <Page>
        <TopBar>
          <h1>로딩 중..</h1>
          <TopActions>
            <SettingsButton type="button" onClick={() => navigate("/me/settings")}>
              설정
            </SettingsButton>
            <StyledLogoutButton />
          </TopActions>
        </TopBar>
      </Page>
    );
  }

  if (isError) {
    const isApiError = error instanceof ApiError;
    const errorMessage = isApiError ? error.message : error instanceof Error ? error.message : "알 수 없는 오류";
    const is404 = isApiError && error.status === 404;

    if (is404) {
      return (
        <Page>
          <TopBar>
            <h1>프로필 생성</h1>
            <TopActions>
              <SettingsButton type="button" onClick={() => navigate("/me/settings")}>
                설정
              </SettingsButton>
              <StyledLogoutButton />
            </TopActions>
          </TopBar>
          <HelperText>프로필을 생성하여 운동 목표와 정보를 설정해 주세요.</HelperText>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              if (!profileRequest) {
                alert("필수 항목을 모두 입력해 주세요. 신체 수치는 0보다 커야 합니다.");
                return;
              }
              createProfile(profileRequest);
            }}
          >
            <Row>
              <Label htmlFor="gender">성별</Label>
              <Select id="gender" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender | "" })}>
                <option value="">선택</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </Select>
            </Row>
            <Row>
              <Label htmlFor="birth">생년월일</Label>
              <Input id="birth" type="date" value={formData.birth} onChange={(e) => setFormData({ ...formData, birth: e.target.value })} />
            </Row>
            <Row>
              <Label>운동 목표</Label>
              <CheckboxGroup>
                {GOALS.map((goal) => (
                  <CheckboxLabel key={goal.value}>
                    <input type="checkbox" checked={formData.workoutGoals.includes(goal.value)} onChange={(e) => setFormData({ ...formData, workoutGoals: e.target.checked ? [...formData.workoutGoals, goal.value] : formData.workoutGoals.filter((g) => g !== goal.value) })} />
                    {goal.label}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </Row>
            <Row>
              <Label>운동 카테고리</Label>
              <CheckboxGroup>
                {CATEGORIES.map((category) => (
                  <CheckboxLabel key={category.value}>
                    <input type="checkbox" checked={formData.exerciseCategories.includes(category.value)} onChange={(e) => setFormData({ ...formData, exerciseCategories: e.target.checked ? [...formData.exerciseCategories, category.value] : formData.exerciseCategories.filter((c) => c !== category.value) })} />
                    {category.label}
                  </CheckboxLabel>
                ))}
              </CheckboxGroup>
            </Row>
            <Row><Label htmlFor="height">키(cm)</Label><Input id="height" type="number" step="0.1" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} /></Row>
            <Row><Label htmlFor="weight">체중(kg)</Label><Input id="weight" type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} /></Row>
            <Row><Label htmlFor="disease">질환/부상</Label><Input id="disease" type="text" value={formData.disease} onChange={(e) => setFormData({ ...formData, disease: e.target.value })} /></Row>
            <Row><Label htmlFor="skeletalMuscleMass">골격근량</Label><Input id="skeletalMuscleMass" type="number" step="0.1" value={formData.skeletalMuscleMass} onChange={(e) => setFormData({ ...formData, skeletalMuscleMass: e.target.value })} /></Row>
            <Row><Label htmlFor="bodyFatMass">체지방량</Label><Input id="bodyFatMass" type="number" step="0.1" value={formData.bodyFatMass} onChange={(e) => setFormData({ ...formData, bodyFatMass: e.target.value })} /></Row>
            <Row><Label htmlFor="bodyFatPercentage">체지방률</Label><Input id="bodyFatPercentage" type="number" step="0.1" value={formData.bodyFatPercentage} onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })} /></Row>
            <Row><Label htmlFor="bmi">BMI</Label><Input id="bmi" type="number" step="0.1" value={formData.bmi} onChange={(e) => setFormData({ ...formData, bmi: e.target.value })} /></Row>
            <PrimaryButton type="submit" disabled={isPending}>{isPending ? "생성 중..." : "프로필 생성"}</PrimaryButton>
          </Form>
        </Page>
      );
    }

    return (
      <Page>
        <h1>오류 발생</h1>
        <p>프로필을 불러오지 못했습니다.</p>
        <ErrorBox>{errorMessage}</ErrorBox>
      </Page>
    );
  }

  return (
    <Page>
      <TopBar>
        <h1>마이 페이지</h1>
        <TopActions>
          <SettingsButton type="button" onClick={() => navigate("/me/settings")}>
            설정
          </SettingsButton>
          <StyledLogoutButton />
        </TopActions>
      </TopBar>
      <HelperText>{data?.user.name}</HelperText>
      <InfoCard>
        <h2>프로필 정보</h2>
        <p>성별: {data?.userProfile.gender}</p>
        <p>생년월일: {data?.userProfile.birth}</p>
        <p>키: {data?.userProfile.height} cm</p>
        <p>체중: {data?.userProfile.weight} kg</p>
        <p>골격근량: {data?.userProfile.skeletalMuscleMass}</p>
        <p>BMI: {data?.userProfile.bmi}</p>
        <p>체지방률: {data?.userProfile.bodyFatPercentage}%</p>
        <InBodyButton onClick={() => navigate("/me/inbody")}>
          인바디 정보 수정
        </InBodyButton>
      </InfoCard>
    </Page>
  );
};

export default MyPage;
