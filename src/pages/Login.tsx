import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import Logo from "../components/Logo";
import KakaoLogin from "../pages/KakaoLogin";

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "http://localhost:5173") return; // ✅ 보안: 출처 확인

      const { status } = event.data;
      if (status === "success") {
        navigate("/main"); // ✅ 200 응답 → 메인 페이지로 이동
      } else if (status === "new_user") {
        navigate("/signup"); // ✅ 201 응답 → 회원가입 페이지로 이동
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <div className="login-container">
      <h1 className="login-title">보험 간편 청구</h1>
      <div className="logo-wrapper">
        <Logo />
      </div>
      <KakaoLogin />
    </div>
  );
};

export default Login;
