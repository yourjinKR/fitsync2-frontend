import { useNavigate } from "react-router-dom";
import { InBodyRecordForm } from "../features/profile/components/InBodyRecordForm";
import { useCreateInBodyMutation } from "../features/profile/hooks/useCreateInBodyMutation";
import { useMyProfileQuery } from "../features/profile/hooks/useMyProfileQuery";
import LogoutButton from "../features/user/components/LogoutButton";
import type { InBodyRecordRequest } from "../features/profile/types/profile";
import { ApiError } from "../shared/apis/http";

/**
 * 인바디 기록(체성분 측정) 정보를 입력하고 저장하는 페이지
 * MyPage에서 접근하며, 새로운 체성분 데이터를 추가/관리
 */
export const InBodyRecordPage = () => {
  const navigate = useNavigate();
  const { data: profileData, isLoading: profileLoading, isError: profileError } = useMyProfileQuery();
  const { mutate: createInBody, isPending } = useCreateInBodyMutation();

  const handleSubmit = (request: InBodyRecordRequest) => {
    createInBody(request, {
      onSuccess: () => {
        alert("인바디 기록이 저장되었습니다!");
        navigate("/me");
      },
      onError: (error) => {
        const message = error instanceof ApiError ? error.message : "저장 실패";
        alert(`오류: ${message}`);
      },
    });
  };

  if (profileLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px" }}>
        <h1>로딩 중...</h1>
        <LogoutButton
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        />
      </div>
    );
  }

  if (profileError) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h1>오류</h1>
          <LogoutButton
            style={{
              padding: "8px 16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          />
        </div>
        <p>프로필을 불러오지 못했습니다. 마이 페이지로 돌아가주세요.</p>
        <button onClick={() => navigate("/me")}>마이 페이지로 돌아가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1>인바디 정보 수정</h1>
        <LogoutButton
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h3>{profileData?.user.name}님의 현재 정보</h3>
        <p>체중: {profileData?.userProfile.weight} kg</p>
        <p>골격근량: {profileData?.userProfile.skeletalMuscleMass} kg</p>
        <p>체지방량: {profileData?.userProfile.bodyFatMass} kg</p>
        <p>체지방률: {profileData?.userProfile.bodyFatPercentage}%</p>
        <p>BMI: {profileData?.userProfile.bmi}</p>
      </div>

      <div style={{ 
        padding: "20px", 
        border: "1px solid #ddd", 
        borderRadius: "4px",
        backgroundColor: "#fafafa"
      }}>
        <h2 style={{ marginTop: 0 }}>새로운 측정 정보 입력</h2>
        <InBodyRecordForm
          onSubmit={handleSubmit}
          isLoading={isPending}
        />
      </div>

      <button
        onClick={() => navigate("/me")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        돌아가기
      </button>
    </div>
  );
};
