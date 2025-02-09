import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import InsurancePage from "./pages/InsurancePage";
import ClaimPage from "./pages/ClaimPage";
import AuthRoutes from "./AuthRoutes"; // ✅ 로그인 관련 라우트 분리


const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ✅ 로그인 관련 라우트 분리 */}
      <Route path="/*" element={<AuthRoutes />} />

      {/* ✅ 메인 앱 라우트 */}
      <Route path="/main" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="insurance" element={<InsurancePage />} />
        <Route path="claim" element={<ClaimPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
