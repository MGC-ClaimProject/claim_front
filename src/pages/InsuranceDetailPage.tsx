import React, { useEffect, useState } from "react";
import { auth } from "../api/axiosInstance";
import "../styles/pages/insuranceList.css";

// ✅ 보험 타입 정의
interface Insurance {
  id: number;
  company: string;
  policy_name: string;
  premium: number | null; // ✅ premium이 null일 수도 있음
}

interface InsuranceListProps {
  memberId?: number; // ✅ 특정 멤버의 보험을 조회할 수 있도록 옵션 추가
}

const InsuranceList: React.FC<InsuranceListProps> = ({ memberId }) => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        const url = memberId ? `/insurances/?member=${memberId}` : "/insurances/";
        const response = await auth.get(url);
        setInsurances(response.data);
      } catch (error) {
        console.error("❌ 보험 정보를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, [memberId]);

  // ✅ 보험료 총합 계산 (premium이 null 또는 undefined일 경우 0으로 처리)
  const totalPremium = insurances.reduce(
    (sum, insurance) => sum + (insurance.premium ?? 0),
    0
  );

  return (
    <div className="insurance-container">
      {/* ✅ 계약 현황 박스 */}
      <div className="contract-status-box">
        <h2>📜 계약 현황</h2>
        <p>총 보유 계약 수: {insurances.length}건</p>
      </div>

      {/* ✅ 월 보험료 박스 */}
      <div className="monthly-premium-box">
        <h2>💰 월 보험료</h2>
        <p>{totalPremium.toLocaleString()} 원</p> {/* ✅ 금액을 천 단위로 포맷 */}
      </div>

      {/* ✅ 보유 계약 리스트 박스 */}
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
    </div>
  );
};

export default InsuranceList;
