import React from "react";
import { useNavigate } from "react-router-dom";

interface ClaimButtonProps {
  memberId: number;
  memberName: string;
}

const MemberClaimsButton: React.FC<ClaimButtonProps> = ({
  memberId,
  memberName,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/main/${memberId}/claims`); // ✅ 해당 멤버의 청구 내역 페이지로 이동
  };

  return (
    <button className="claim-button" onClick={handleClick}>
      📄 {memberName}님의 청구내역 보기
    </button>
  );
};

export default MemberClaimsButton;
