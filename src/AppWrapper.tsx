import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setRedirectFunction } from "./api/axiosInstance"; // ✅ axiosInstance.tsx 추가
import AppRoutes from "./AppRoutes.tsx";

const AppWrapper: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 로그인 만료 시 `login`으로 이동하도록 설정
    setRedirectFunction(() => {
      navigate("/");
    });
  }, [navigate]);

  return <AppRoutes />;
};

export default AppWrapper;
