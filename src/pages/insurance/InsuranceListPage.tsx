import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import useFetchInsurances from "../../hooks/useFetchInsurances.ts"; // ✅ Custom Hook 적용
import AddInsuranceModal from "../../components/modals/AddInsuranceModal.tsx"; // ✅ 모달 컴포넌트 추가
import "../../styles/pages/insuranceList.css";

const InsuranceListPage: React.FC = () => {
  const { memberId } = useParams<{ memberId?: string }>();
  const location = useLocation();
  const memberName = location.state?.memberName || "나";
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 모달 상태 추가

  // ✅ Custom Hook 사용
  const { insurances, loading, totalPremium, fetchInsurances } = useFetchInsurances(memberId);

  return (
    <div className="insurance-container">
      {/* ✅ 제목과 추가 버튼 컨테이너 */}
      <div className="title-container">
        <h1 className="page-title">📌 {memberName}의 가입 보험</h1>
        <button className="add-insurance-btn" onClick={() => setIsModalOpen(true)}>+</button> {/* ✅ 모달 열기 */}
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
              <li key={insurance.id}>
                <strong>{insurance.policy_name || "보험 이름 없음"}</strong> - {insurance.company}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ 보험 추가 모달 */}
      {isModalOpen && (
        <AddInsuranceModal
          memberId={memberId ? parseInt(memberId, 10) : undefined}
          onClose={() => setIsModalOpen(false)}
          onInsuranceAdded={fetchInsurances} // ✅ 추가 후 리스트 새로고침
        />
      )}
    </div>
  );
};

export default InsuranceListPage;
