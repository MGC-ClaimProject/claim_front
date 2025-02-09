import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.tsx";
import Signup from "./pages/Signup";
import AdConsentPage from "./pages/AdConsentPage";
import SignupCompletePage from "./pages/SignupCompletePage";


const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/ad-consent" element={<AdConsentPage />} />
      <Route path="/complete" element={<SignupCompletePage />} />
    </Routes>
  );
};

export default AuthRoutes;
