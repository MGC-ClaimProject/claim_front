import React from "react";
import { Routes, Route } from "react-router-dom";
import GlobalLayout from "./layouts/GlobalLayout";
import MainPage from "./pages/MainPage";
import InsurancePage from "./pages/insurance/InsuranceListPage";
import ProfilePage from "./pages/ProfilePage"; // ✅ 내 정보 페이지
import ClaimCreatePage from "./pages/claim/ClaimCreatePage"; // ✅ 보험 청구 페이지
import ClaimSelectInsurancePage from "./pages/claim/ClaimSelectInsurancePage"; // ✅ 보험 선택 페이지
import ClaimSymptomsPage from "./pages/claim/ClaimSymptomsPage"
import ClaimSignaturePage from "./pages/claim/ClaimSignaturePage"
import ClaimBankSelectionPage from "./pages/claim/ClaimBankSelectionPage"
import ClaimConfirmationPage from "./pages/claim/ClaimConfirmationPage"
import ClaimAddDocumentsPage from "./pages/claim/ClaimAddDocumentsPage"


import FamilyListPage from "./pages/family/FamilyListPage"; // ✅ 가족 목록 페이지
import FamilyDetailPage from "./pages/family/FamilyDetailPage"; // ✅ 개별 가족 정보 페이지

import AuthRoutes from "./AuthRoutes"; // ✅ 로그인 관련 라우트


const AppRoutes: React.FC = () => (
  <Routes>
    {/* ✅ 인증 관련 라우트 */}
    <Route path="/*" element={<AuthRoutes />} />

    {/* ✅ 메인 앱 라우트 (GlobalLayout 포함) */}
    <Route path="/main" element={<GlobalLayout />}>
      <Route index element={<MainPage />} />
      <Route path="insurance" element={<InsurancePage />} />
      <Route path=":memberId/insurance" element={<InsurancePage />} />
      <Route path="claim" element={<ClaimCreatePage />} /> {/* 보험 청구 */}
      <Route path="select-insurance" element={<ClaimSelectInsurancePage />} /> {/* 보험 선택 */}
      <Route path="claim/symptoms" element={<ClaimSymptomsPage />} /> {/* 보험 선택 */}
      <Route path="claim/signature" element={<ClaimSignaturePage />} /> {/* 보험 선택 */}
      <Route path="claim/account" element={<ClaimBankSelectionPage />} /> {/* 보험 선택 */}
      <Route path="claim/confirmation" element={<ClaimConfirmationPage />} /> {/* 보험 선택 */}
      <Route path="claim/add-documents" element={<ClaimAddDocumentsPage />} /> {/* 보험 선택 */}

      {/* ✅ 추가된 페이지 */}
      <Route path="profile" element={<ProfilePage />} /> {/* 내 정보 */}
      <Route path="family" element={<FamilyListPage />} /> {/* 가족 목록 */}
      <Route path="family/:memberId" element={<FamilyDetailPage />} /> {/* 개별 가족 정보 */}
    </Route>
  </Routes>
);

export default AppRoutes;
