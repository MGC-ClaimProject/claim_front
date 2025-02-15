import React from "react";
import { useLocation } from "react-router-dom";

const ClaimDetailsPage: React.FC = () => {
  const location = useLocation();
  const { applicant, insured, selectedInsurance } = location.state || {};

  return (
    <div>
      <h1>📌 청구 상세 정보 입력</h1>

      {/* ✅ 신청자 정보 */}
      {applicant && (
        <div>
          <h2>👤 신청자 정보</h2>
          <p>이름: {applicant.name}</p>
          <p>전화번호: {applicant.phone}</p>
        </div>
      )}

      {/* ✅ 피보험자 정보 */}
      {insured && (
        <div>
          <h2>🛡️ 피보험자 정보</h2>
          <p>이름: {insured.name}</p>
          <p>관계: {insured.relation}</p>
        </div>
      )}

      {/* ✅ 선택된 보험 정보 */}
      {selectedInsurance && (
        <div>
          <h2>📄 선택된 보험</h2>
          <p>보험명: {selectedInsurance.policy_name}</p>
          <p>보험사: {selectedInsurance.company}</p>
          <p>월 보험료: {selectedInsurance.premium.toLocaleString()}원</p>
        </div>
      )}
    </div>
  );
};

export default ClaimDetailsPage;
