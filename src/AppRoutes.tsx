import React from "react";
import { Routes, Route } from "react-router-dom";
import GlobalLayout from "./layouts/GlobalLayout.tsx";
import MainPage from "./pages/MainPage";
import InsurancePage from "./pages/InsurancePage";
import ClaimPage from "./pages/ClaimPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ 추가: 내 정보 페이지
// import ClaimsPage from "./pages/ClaimsPage"; // ✅ 추가: 청구 내역 페이지
import FamilyListPage from "./pages/FamilyListPage.tsx"; // ✅ 추가: 나의 가족 페이지
import FamilyDetailPage from "./pages/FamilyDetailPage.tsx"; // ✅ 가족 개별 정보 페이지 추가
import AuthRoutes from "./AuthRoutes"; // ✅ 로그인 관련 라우트 분리

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ✅ 로그인 관련 라우트 분리 */}
      <Route path="/*" element={<AuthRoutes />} />

      {/* ✅ 메인 앱 라우트 */}
      <Route path="/main" element={<GlobalLayout />}>
        <Route index element={<MainPage />} />
        <Route path="insurance" element={<InsurancePage />} />
        <Route path="claim" element={<ClaimPage />} />

        {/* ✅ 추가된 경로들 */}
        <Route path="profile" element={<ProfilePage />} />  {/* ✅ 내 정보 */}
        {/*<Route path="claims" element={<ClaimsPage />} />  /!* ✅ 청구 내역 *!/*/}
        <Route path="family" element={<FamilyListPage />} />  {/* ✅ 나의 가족 */}
        <Route path="family/:memberId" element={<FamilyDetailPage />} />  {/* ✅ 가족 개별 정보 페이지 */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
