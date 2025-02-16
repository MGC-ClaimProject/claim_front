import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import "../../styles/pages/claim/claimDetailPage.css";

interface ClaimDetail {
  id: number;
  member_name: string;
  insured_name: string;
  incident_type: string;
  incident_date: string;
  status: string;
  description: string;
}

const ClaimDetailPage: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const [claim, setClaim] = useState<ClaimDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaimDetail = async () => {
      try {
        const response = await auth.get(`/claims/member/${claimId}/`);
        setClaim(response.data);
      } catch (error) {
        console.error("❌ 청구 상세 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaimDetail();
  }, [claimId]);

  if (loading) {
    return <p>🔄 로딩 중...</p>;
  }

  if (!claim) {
    return <p>❌ 청구 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="claim-detail-container">
      <h1>📌 청구 상세 정보</h1>
      <div className="claim-info">
        <p><strong>👤 신청자:</strong> {claim.member_name}</p>
        <p><strong>🛡️ 피보험자:</strong> {claim.insured_name}</p>
        <p><strong>🚑 사고 유형:</strong> {claim.incident_type}</p>
        <p><strong>📅 사고 날짜:</strong> {claim.incident_date}</p>
        <p><strong>📄 상태:</strong> {claim.status}</p>
        <p><strong>📝 설명:</strong> {claim.description || "설명 없음"}</p>
      </div>
    </div>
  );
};

export default ClaimDetailPage;
