import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/signup_complete.css";

const SignupCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {}; // ✅ 이전 단계에서 전달된 데이터

  const handleNext = () => {
    navigate("/main"); // ✅ 메인 페이지로 이동
  };

  return (
    <div className="complete-container">
      <h1 className="complete-title">가입 완료</h1>

      <div className="message-box">
        <p>{formData.name}님</p>
        <p>가입을 축하드립니다!</p>
      </div>

      <div className="info-box">
        <p>청구 서비스 이용을 위해</p>
        <p>한번의 내 보험내역 조회가 필요합니다.</p>
        <p>모든 정보는 보험 청구시에만 사용됩니다.</p>
      </div>

      <button className="insurance-button">내 보험 조회 바로 가기</button>
      <button className="start-button" onClick={handleNext}>시작하기</button>
    </div>
  );
};

export default SignupCompletePage;
