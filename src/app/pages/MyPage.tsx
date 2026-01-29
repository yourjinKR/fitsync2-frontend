import React, { useEffect } from "react";
import { api } from "../shared/api/http";

const MyPage = () => {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user/me");
        console.log("me:", res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUser();
  }, []);

  return <div>마이 페이지</div>;
};

export default MyPage;