import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import "../../styles/pages/insuranceDetail.css";

interface Insurance {
  id: number;
  policy_name: string;
  company: string;
  premium: number;
  start_date: string;
}

const InsuranceDetailPage: React.FC = () => {
  const { insuranceId } = useParams<{ insuranceId: string }>();
  const [insurance, setInsurance] = useState<Insurance | null>(null); // ✅ 타입 지정
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsuranceDetail = async () => {
      try {
        const response = await auth.get(`/insurances/member/${insuranceId}/`);
        setInsurance(response.data);
      } catch (error) {
        console.error("❌ 보험 상세 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsuranceDetail();
  }, [insuranceId]);

  if (loading) {
    return <p>🔄 로딩 중...</p>;
  }

  if (!insurance) {
    return <p>❌ 보험 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="insurance-detail-container">
      <h1>📌 보험 상세 정보</h1>
      <div className="insurance-info">
        <p><strong>보험명:</strong> {insurance.policy_name}</p>
        <p><strong>보험사:</strong> {insurance.company}</p>
        <p><strong>월 보험료:</strong> {insurance.premium.toLocaleString()} 원</p>
        <p><strong>가입일:</strong> {insurance.start_date}</p>
      </div>
    </div>
  );
};

export default InsuranceDetailPage;
