import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import ProfileCard from "../../components/cards/ProfileCard.tsx";
import InsuranceButton from "../../components/buttons/InsuranceButton.tsx"; // ✅ 보험 리스트로 이동하는 버튼 추가
import "../../styles/pages/familyDetail.css";

interface MemberDetail {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

const FamilyDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        const response = await auth.get(`/members/${memberId}`);
        setMember(response.data);
      } catch (error) {
        console.error("❌ 멤버 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId]);

  if (loading) {
    return <p>🔄 로딩 중...</p>;
  }

  if (!member) {
    return <p>❌ 멤버 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="family-detail-container">
      <h2>👤 {member.name}님의 상세 정보</h2>
      <ProfileCard member={member} />

      {/* ✅ 가족 멤버의 보험 리스트 보러가기 버튼 */}
      <div className="family-insurance-btn">
        <InsuranceButton memberId={member.id} memberName={member.name} />
      </div>
    </div>
  );
};

export default FamilyDetailPage;
