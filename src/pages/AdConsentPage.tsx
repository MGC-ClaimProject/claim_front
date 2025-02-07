import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ad_consent.css";

const API_URL = "http://localhost:8000/api/v1/members/"; // ✅ 백엔드 API URL

const AdConsentPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ 이전 단계에서 저장한 회원가입 정보 불러오기
  const storedFormData = JSON.parse(localStorage.getItem("signupData") || "{}");

  const [consents, setConsents] = useState([
    { id: 1, title: "광고성 문자 안내 1", agreed: false },
    { id: 2, title: "광고성 문자 안내 2", agreed: false },
    { id: 3, title: "광고성 문자 안내 3", agreed: false },
  ]);

  const handleConsentChange = (id: number, agreed: boolean) => {
    setConsents(consents.map((item) => (item.id === id ? { ...item, agreed } : item)));
  };

  const handleSubmit = async () => {
    try {
      // ✅ 광고 동의 여부 추가
      const is_ad_agreed = consents.some((c) => c.agreed);

      // ✅ 최종 회원가입 데이터 생성
      const finalData = { ...storedFormData, is_ad_agreed };

      console.log("📌 서버로 보낼 데이터:", finalData);

      // ✅ 서버에 `POST` 요청
      await axios.post(API_URL, finalData, { withCredentials: true });

      // ✅ 성공 시 회원가입 완료 페이지로 이동
      navigate("/complete");
    } catch (error) {
      console.error("⚠️ 회원가입 요청 실패:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
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

      <button className="next-button" onClick={handleSubmit}>
        회원가입 완료
      </button>
    </div>
  );
};

export default AdConsentPage;
