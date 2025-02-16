import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import useFetchInsurances from "../../hooks/useFetchInsurances.ts"; // ✅ Custom Hook 적용
import AddInsuranceModal from "../../components/modals/AddInsuranceModal.tsx"; // ✅ 모달 컴포넌트 추가
import "../../styles/pages/insuranceList.css";

const InsuranceListPage: React.FC = () => {
  const { memberId } = useParams<{ memberId?: string }>();
  const location = useLocation();
  const navigate = useNavigate(); // ✅ 네비게이션 추가
  const memberName = location.state?.memberName || "나";
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Custom Hook 사용
  const { insurances, loading, totalPremium, fetchInsurances } = useFetchInsurances(memberId);

  // ✅ 상세페이지 이동 함수
  const handleRowClick = (insuranceId: number) => {
    navigate(`/main/insurance/${insuranceId}`);
  };

  return (
    <div className="insurance-container">
      <div className="title-container">
        <h1 className="page-title">📌 {memberName}의 가입 보험</h1>
        <button className="add-insurance-btn" onClick={() => setIsModalOpen(true)}>+</button>
      </div>

      <div className="contract-status-box">
        <h2>📜 계약 현황</h2>
        <p>총 보유 계약 수: {insurances.length}건</p>
      </div>

      <div className="monthly-premium-box">
        <h2>💰 월 보험료</h2>
        <p>{totalPremium.toLocaleString()} 원</p>
      </div>

      <div className="contract-list-box">
        <h2>📋 보유 계약 리스트</h2>
        {loading ? (
          <p>⏳ 데이터를 불러오는 중...</p>
        ) : insurances.length === 0 ? (
          <p>🔍 검색 내역이 없습니다.</p>
        ) : (
          <ul>
            {insurances.map((insurance) => (
              <li
                key={insurance.id}
                className="insurance-item"
                onClick={() => handleRowClick(insurance.id)} // ✅ 클릭 시 상세 페이지로 이동
              >
                <strong>{insurance.policy_name || "보험 이름 없음"}</strong> - {insurance.company}
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <AddInsuranceModal
          memberId={memberId ? parseInt(memberId, 10) : undefined}
          onClose={() => setIsModalOpen(false)}
          onInsuranceAdded={fetchInsurances}
        />
      )}
    </div>
  );
};

export default InsuranceListPage;
