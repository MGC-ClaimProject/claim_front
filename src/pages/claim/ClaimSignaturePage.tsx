import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SignaturePad from "../../components/SignaturePad"; // ✅ 모듈화된 서명 컴포넌트 사용
import "../../styles/pages/claim/claimSignaturePage.css";

// ✅ Claim 데이터 타입 정의
interface ClaimData {
  applicant?: { name: string };
  insured?: { name: string; relation: string };
  symptoms?: string;
  incidentType?: string;
  treatmentType?: string;
  hospitalDays?: string | null;
  incidentDate?: string;
  applicantSignature?: string | null;
  insuredSignature?: string | null;
}

const ClaimSignaturePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 초기 상태: 로컬 스토리지 또는 이전 단계 데이터 가져오기
  const storedClaimData = localStorage.getItem("claimData");
  const claimData: ClaimData | null =
    location.state || (storedClaimData ? JSON.parse(storedClaimData) : null);

  if (!claimData) {
    alert("이전 단계 정보를 찾을 수 없습니다. 다시 진행해주세요.");
    navigate("/main/claim");
  }

  const [applicantSignature, setApplicantSignature] = useState<string | null>(claimData?.applicantSignature || null);
  const [insuredSignature, setInsuredSignature] = useState<string | null>(claimData?.insuredSignature || null);
  const [isButtonActive, setIsButtonActive] = useState(false); // ✅ 버튼 활성화 상태 관리

  // ✅ 서명이 모두 입력되었는지 체크하여 버튼 활성화
  useEffect(() => {
    setIsButtonActive(!!(applicantSignature && insuredSignature));
  }, [applicantSignature, insuredSignature]);

  // ✅ 다음 단계 이동 (서명 데이터 포함하여 계좌 입력 페이지로 이동)
  const handleNext = () => {
    if (!applicantSignature || !insuredSignature) {
      alert("신청자와 피보험자의 서명을 모두 입력해주세요.");
      return;
    }

    // ✅ 기존 데이터에 서명 추가
    const updatedClaimData = {
      ...claimData,
      applicantSignature,
      insuredSignature,
    };

    console.log("🔍 ClaimSignaturePage에서 저장되는 데이터:", updatedClaimData);

    localStorage.setItem("claimData", JSON.stringify(updatedClaimData));

    // ✅ 계좌번호 입력 페이지로 이동 (모든 정보 전달)
    navigate("/main/claim/account", { state: updatedClaimData });
  };

  return (
    <div className="signature-container">
      <div className="title-box">✍️ 서명 입력</div>

      {/* ✅ 신청자 정보 + 서명 */}
      {claimData && (
        <div className="info-section">
          <SignaturePad
            title="🖊️ 신청자 서명"
            name={claimData.applicant?.name || "-"}
            onSave={setApplicantSignature}
          />
        </div>
      )}

      {/* ✅ 피보험자 정보 + 서명 */}
      {claimData && (
        <div className="info-section">
          <SignaturePad
            title="🖊️ 피보험자 서명"
            name={`${claimData.insured?.name || "-"}`}
            onSave={setInsuredSignature}
          />
        </div>
      )}

      {/* ✅ 다음 버튼 */}
      <button
        className={`next-btn ${isButtonActive ? "active" : ""}`}
        onClick={handleNext}
        disabled={!isButtonActive}
      >
        다음 단계로 이동
      </button>
    </div>
  );
};

export default ClaimSignaturePage;
