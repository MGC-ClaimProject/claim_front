import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BANK_CHOICES } from "../../constants/choices";
import "../../styles/pages/claim/claimBankSelectionPage.css"; // ✅ 스타일 적용

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
  bank?: string | null;
  account?: string | null;
  isSameAsPayoutAccount?: boolean;
}

const ClaimBankSelectionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 기존 데이터 가져오기 (로컬 스토리지 또는 이전 페이지 데이터)
  const storedClaimData = localStorage.getItem("claimData");
  const claimData: ClaimData | null =
    location.state || (storedClaimData ? JSON.parse(storedClaimData) : null);

  if (!claimData) {
    alert("이전 단계 정보를 찾을 수 없습니다. 다시 진행해주세요.");
    navigate("/main/claim");
  }

  const [selectedBank, setSelectedBank] = useState<string>(claimData?.bank || "");
  const [accountNumber, setAccountNumber] = useState<string>(claimData?.account || "");
  const [isSameAccount, setIsSameAccount] = useState<boolean>(claimData?.isSameAsPayoutAccount || false);

  const isFormValid = isSameAccount || (selectedBank && accountNumber.trim()); // ✅ 체크박스 또는 입력값 확인

  // ✅ 저장 후 확인 페이지로 이동
  const handleSubmit = () => {
    if (!isFormValid) {
      alert("은행을 선택하거나 출금 계좌와 동일 여부를 체크해주세요.");
      return;
    }

    // ✅ 기존 데이터에 계좌 정보 추가
    const updatedClaimData: ClaimData = {
      ...claimData,
      bank: isSameAccount ? "출금계좌와 동일" : selectedBank,
      account: isSameAccount ? "출금계좌와 동일" : accountNumber,
      isSameAsPayoutAccount: isSameAccount,
    };

    console.log("🔍 ClaimBankSelectionPage에서 저장되는 데이터:", updatedClaimData);

    // ✅ 로컬 스토리지에 저장 (새로고침 대비)
    localStorage.setItem("claimData", JSON.stringify(updatedClaimData));

    // ✅ 확인 페이지로 이동 (모든 정보 전달)
    navigate("/main/claim/confirmation", { state: updatedClaimData });
  };

  return (
    <div className="bank-selection-container">
      <h2>🏦 지급받을 계좌 입력</h2>

      {/* ✅ 출금 계좌 동일 체크박스 */}
      <div className="checkbox-group">
        <input
          type="checkbox"
          id="sameAccount"
          checked={isSameAccount}
          onChange={() => {
            setIsSameAccount((prev) => !prev);
            if (!isSameAccount) {
              setSelectedBank(""); // ✅ 체크하면 은행 선택 초기화
              setAccountNumber(""); // ✅ 체크하면 계좌번호 초기화
            }
          }}
        />
        <label htmlFor="sameAccount">출금 계좌번호와 동일</label>
      </div>

      {/* ✅ 계좌 정보 입력 필드 */}
      <div className={`account-box ${isSameAccount ? "disabled" : ""}`}>
        {/* ✅ 은행 선택 */}
        <div className="input-group">
          <label>은행 선택</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            disabled={isSameAccount} // ✅ 체크 시 비활성화
          >
            <option value="">은행을 선택하세요</option>
            {Object.entries(BANK_CHOICES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ 계좌번호 입력 */}
        <div className="input-group">
          <label>계좌번호</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="계좌번호를 입력하세요"
            disabled={isSameAccount} // ✅ 체크 시 비활성화
          />
        </div>
      </div>

      {/* ✅ 저장 버튼 */}
      <button className={`submit-btn ${isFormValid ? "active" : "disabled"}`} onClick={handleSubmit} disabled={!isFormValid}>
        저장하기
      </button>
    </div>
  );
};

export default ClaimBankSelectionPage;
