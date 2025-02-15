import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BANK_CHOICES } from "../../constants/choices";
import "../../styles/pages/claim/claimConfirmationPage.css";
import { auth } from "../../api/axiosInstance";
import { AxiosError } from "axios";

interface ClaimData {
  applicant?: { id: number; name: string };
  insured?: { id: number; name: string; relation: string };
  symptoms?: string;
  incidentType?: string;
  treatmentType?: string;
  hospitalDays?: string | null;
  incidentDate?: string;
  applicantSignature?: string | null;
  insuredSignature?: string | null;
  bank?: string | null;
  account?: string | null;
  isSameAsPayoutAccount?: boolean;
  selectedInsurances?: { id: number; company: string; policy_name: string }[];
}

const ClaimConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [existingClaim, setExistingClaim] = useState<ClaimData | null>(null);

  useEffect(() => {
    const storedClaimData = localStorage.getItem("claimData");
    const dataFromState = location.state || (storedClaimData ? JSON.parse(storedClaimData) : null);

    if (dataFromState) {
      console.log("🔍 ClaimConfirmationPage 데이터:", dataFromState);
      setClaimData(dataFromState);
    } else {
      alert("이전 단계 정보를 찾을 수 없습니다.");
      navigate("/main/claim");
    }
  }, [location.state, navigate]);

  const getKoreanBankName = (bankKey: string | null | undefined) => {
    return bankKey && BANK_CHOICES[bankKey] ? BANK_CHOICES[bankKey] : "-";
  };

  const handleSubmit = async (bypassDuplicateCheck = false) => {
    if (!claimData || !claimData.insured || !claimData.insured.id) {
      alert("❌ 피보험자 정보가 없습니다. 다시 진행해주세요.");
      return;
    }

    setIsLoading(true);

    const requestData = {
      member: claimData.insured.id,
      applicant: claimData.applicant?.id || null,
      insured: claimData.insured?.id || null,
      symptoms: claimData.symptoms,
      incident_type: claimData.incidentType,
      treatment_type: claimData.treatmentType,
      hospital_days: claimData.hospitalDays ?? 0,
      incident_date: claimData.incidentDate,
      applicant_signature: claimData.applicantSignature,
      insured_signature: claimData.insuredSignature,
      bank: claimData.isSameAsPayoutAccount ? null : claimData.bank,
      account: claimData.isSameAsPayoutAccount ? null : claimData.account,
      is_same_as_payout_account: claimData.isSameAsPayoutAccount,
      claim_insurers: claimData.selectedInsurances?.map((insurance) => ({
        company: insurance.company,
        policy_name: insurance.policy_name,
      })) || [],
      bypass_duplicate_check: bypassDuplicateCheck,
    };

    console.log("📤 보낼 데이터:", requestData);

    try {
      const response = await auth.post(`/claims/${claimData.insured.id}/`, requestData);

      if (response.status === 201) {
        console.log("✅ 청구 생성 성공:", response.data);
        navigate("/main/claim/add-documents", { state: { claimId: response.data.id } });
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("❌ 서버 응답 에러:", error.response?.data);
        alert(`보험 청구 생성 중 오류가 발생했습니다. (${error.response?.status})`);

        if (error.response?.status === 409) {
          setExistingClaim(error.response.data.existing_claim);
          setShowModal(true);
        }
      } else {
        console.error("❌ 알 수 없는 오류:", error);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClaim = () => {
    localStorage.removeItem("claimData");
    setClaimData(null);
    navigate("/main");
  };

  return (
    <div className="confirmation-container">
      <h2>📜 보험 청구 정보 확인</h2>

      {claimData && (
        <>
          <div className="info-box">
            <p><strong>👤 신청자:</strong> {claimData.applicant?.name || "-"}</p>
            <p><strong>🛡️ 피보험자:</strong> {claimData.insured?.name || "-"} / {claimData.insured?.relation || "-"}</p>
          </div>

          <div className="info-box">
            <p><strong>🚑</strong> {claimData.incidentType || "-"}</p>
            <p><strong>💊</strong> {claimData.treatmentType || "-"}</p>
            {claimData.treatmentType === "입원" && <p><strong>🏥 입원 일수:</strong> {claimData.hospitalDays || "0"}일</p>}
            <p><strong>📅</strong> {claimData.incidentDate || "-"}</p>
          </div>

          <div className="info-box">
            {claimData.isSameAsPayoutAccount ? (
              <p><strong>🔄 출금 계좌와 동일:</strong> ✅ 예</p>
            ) : (
              <>
                <p><strong>🏦 은행:</strong> {getKoreanBankName(claimData.bank)}</p>
                <p><strong>💳 계좌번호:</strong> {claimData.account || "-"}</p>
              </>
            )}
          </div>

          <button className="submit-btn" onClick={() => handleSubmit()} disabled={isLoading}>
            {isLoading ? "저장 중..." : "저장 후 다음으로"}
          </button>
        </>
      )}

      {showModal && existingClaim && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⚠️ 중복된 청구 내역이 존재합니다.</h3>
            <p><strong>사고 유형:</strong> {existingClaim.incidentType}</p>
            <p><strong>사고 발생일:</strong> {existingClaim.incidentDate}</p>
            <p><strong>증상:</strong> {existingClaim.symptoms}</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancelClaim}>취소하기</button>
              <button
                className="continue-btn"
                onClick={() => {
                  setShowModal(false);
                  handleSubmit(true);
                }}
              >
                청구 계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimConfirmationPage;
