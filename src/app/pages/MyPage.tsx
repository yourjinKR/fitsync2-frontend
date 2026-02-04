import React, { useEffect } from "react";
import { getMyUserInfo } from "../features/user/apis/getMyUserInfo";
import { getUserMyProfile } from "../features/profile/apis/getMyProfile";

const MyPage = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMyUserInfo();
        console.log("me:", user);
        const profile = await getUserMyProfile(user.id);
        console.log("profile : ", profile);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUser();
  }, []);

  return <div>마이 페이지</div>;
};

export default MyPage;