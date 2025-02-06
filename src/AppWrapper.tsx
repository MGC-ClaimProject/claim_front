import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setRedirectFunction } from "./api/axiosInstance"; // ✅ axiosInstance.ts 추가
import AppRoutes from "./routes";

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 로그인 만료 시 `/login`으로 이동하도록 설정
    setRedirectFunction(() => {
      navigate("/login");
    });
  }, [navigate]);

  return <AppRoutes />;
};

export default AppWrapper;
