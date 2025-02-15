import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setRedirectFunction } from "./api/axiosInstance"; // ✅ axiosInstance.tsx에서 가져옴
import AppRoutes from "./AppRoutes"; // ✅ 전체 라우트 관리

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 로그인 만료 시 로그인 페이지로 이동
    setRedirectFunction(() => navigate("/login"));
  }, [navigate]);

  return <AppRoutes />;
};

export default AppWrapper;
