import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import MainPage from "./pages/MainPage";
import InsurancePage from "./pages/InsurancePage";
import ClaimPage from "./pages/ClaimPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdConsentPage from "./pages/AdConsentPage";
import SignupCompletePage from "./pages/SignupCompletePage";
import KakaoLogin from "./pages/KakaoLogin";
import KakaoLoginCallback from "./pages/KakaoLoginCallback";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login/kakao" element={<KakaoLogin />} />
      <Route path="/login/kakao/callback" element={<KakaoLoginCallback />} />

      <Route path="/main" element={<MainLayout />}>
        <Route index element={<MainPage />} />
        <Route path="insurance" element={<InsurancePage />} />
        <Route path="claim" element={<ClaimPage />} />
      </Route>

      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/ad-consent" element={<AdConsentPage />} />
      <Route path="/complete" element={<SignupCompletePage />} />
    </Routes>
  );
};

export default AppRoutes;
