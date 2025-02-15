import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 페이지 이동을 위해 추가
import { auth } from "../../api/axiosInstance";
import "../../styles/pages/claim/claimCreatePage.css"; // ✅ 스타일 적용

// ✅ 멤버 정보 타입 정의
interface Member {
  id: number;
  name: string;
  phone: string;
  birth: string;
  relation: string;
}

const ClaimCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Member | null>(null);
  const [selectedInsured, setSelectedInsured] = useState<Member | null>(null);

  // ✅ 가족 멤버 데이터 가져오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await auth.get("/members/");
        setMembers(response.data);
      } catch (error) {
        console.error("❌ 가족 멤버 정보 가져오기 실패:", error);
      }
    };

    fetchMembers();
  }, []);

  // ✅ 신청자 선택 핸들러
  const handleApplicantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = Number(event.target.value);
    const member = members.find((m) => m.id === memberId) || null;
    setSelectedApplicant(member);
  };

  // ✅ 피보험자 선택 핸들러
  const handleInsuredChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const memberId = Number(event.target.value);
    const member = members.find((m) => m.id === memberId) || null;
    setSelectedInsured(member);
  };

  // ✅ 동의 체크박스 변경 핸들러
  const handleAgreeChange = () => {
    setAgree(!agree);
  };

  // ✅ 다음 페이지 이동 핸들러
  const handleNext = () => {
    if (!agree) {
      alert("필수 동의 항목에 체크해야 진행할 수 있습니다.");
      return;
    }
    if (!selectedApplicant || !selectedInsured) {
      alert("신청자와 피보험자를 선택해주세요.");
      return;
    }

    // ✅ 저장할 데이터 객체
    const claimData = {
      applicant: selectedApplicant,
      insured: selectedInsured,
    };

    // ✅ 로컬 스토리지에 데이터 저장 (새로고침해도 유지되도록)
    localStorage.setItem("claimData", JSON.stringify(claimData));

    console.log("✅ ClaimCreatePage에서 저장되는 데이터:", claimData);

    // ✅ 선택한 정보와 함께 다음 페이지로 이동
    navigate("/main/select-insurance", { state: claimData });
  };

  return (
    <div className="claim-container">
      <div className="claim-title"><p>📌 보험 청구서 작성</p></div>

      {/* ✅ 신청자 정보 입력 박스 */}
      <div className="claim-box">
        <div className="claim-label">
          <span>👤 신청자</span>
          <select onChange={handleApplicantChange} defaultValue="">
            <option value="" disabled>신청자 선택</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.relation})
              </option>
            ))}
          </select>
        </div>
        <div className="claim-info">
          <div>
            <label>이름</label>
            <span>{selectedApplicant?.name || "-"}</span>
          </div>
          <div>
            <label>전화번호</label>
            <span>{selectedApplicant?.phone || "-"}</span>
          </div>
        </div>
      </div>

      {/* ✅ 피보험자 정보 입력 박스 */}
      <div className="claim-box">
        <div className="claim-label">
          <span>🛡️ 피보험자</span>
          <select onChange={handleInsuredChange} defaultValue="">
            <option value="" disabled>피보험자 선택</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.relation})
              </option>
            ))}
          </select>
        </div>
        <div className="claim-info">
          <div>
            <label>이름</label>
            <span>{selectedInsured?.name || "-"}</span>
          </div>
          <div>
            <label>관계</label>
            <span>{selectedInsured?.relation || "-"}</span>
          </div>
        </div>
      </div>

      {/* ✅ 필수 동의 정보 입력 박스 */}
      <div className="claim-box">
        <h2>📜 필수 동의 항목</h2>
        <label>
          <input type="checkbox" checked={agree} onChange={handleAgreeChange} />
          개인정보 수집 및 이용에 동의합니다. (필수)
        </label>
      </div>

      {/* ✅ 다음으로 버튼 */}
      <button className={`next-button ${agree ? "active" : ""}`} onClick={handleNext} disabled={!agree}>
        모두 동의하고 다음으로
      </button>
    </div>
  );
};

export default ClaimCreatePage;
