import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ad_consent.css";

const AdConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {}; // ✅ 이전 페이지에서 전달된 데이터

  const [consents, setConsents] = useState([
    { id: 1, title: "광고성 문자 안내 1", agreed: false },
    { id: 2, title: "광고성 문자 안내 2", agreed: false },
    { id: 3, title: "광고성 문자 안내 3", agreed: false },
  ]);

  // ✅ 동의 상태 업데이트
  const handleConsentChange = (id: number, agreed: boolean) => {
    setConsents(consents.map(item => (item.id === id ? { ...item, agreed } : item)));
  };

  // ✅ 가입 완료 페이지로 이동
  const handleNext = () => {
    const updatedFormData = { ...formData, adConsents: consents };
    navigate("/complete", { state: updatedFormData });
  };

  return (
    <div className="ad-consent-container">
      <h1 className="ad-consent-title">정보 동의</h1>

      {consents.map((item) => (
        <div key={item.id} className="consent-box">
          <p>{item.title}</p>
          <div className="button-group">
            <button
              className={`consent-button ${item.agreed ? "active" : ""}`}
              onClick={() => handleConsentChange(item.id, true)}
            >
              동의
            </button>
            <button
              className={`consent-button ${!item.agreed ? "active" : ""}`}
              onClick={() => handleConsentChange(item.id, false)}
            >
              비동의
            </button>
          </div>
        </div>
      ))}

      <button className="next-button" onClick={handleNext}>저장 후 계속하기</button>
    </div>
  );
};

export default AdConsentPage;
