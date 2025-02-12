import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/axiosInstance";
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
      // ✅ 광고 동의 여부 확인
      const is_ad_agreed = consents.some((c) => c.agreed);

      // ✅ 멤버 ID 확인 (저장된 데이터에서 가져오기)
      const memberId = storedFormData.memberId;

      if (!memberId) {
        alert("회원 정보를 찾을 수 없습니다. 다시 시도해주세요.");
        return;
      }

      // ✅ `PATCH` 요청으로 `is_ad_agreed` 정보만 업데이트
      console.log(`📌 서버에 PATCH 요청: /members/${memberId}/`);
      const response = await auth.patch(
        `${API_URL}${memberId}/`,
        { is_ad_agreed },
        { withCredentials: true }
      );

      // ✅ 200 응답 시 회원가입 완료 페이지로 이동
      if (response.status === 200) {
        navigate("/complete");
      } else {
        throw new Error("회원가입 수정 실패");
      }
    } catch (error) {
      console.error("⚠️ 회원가입 수정 실패:", error);
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
