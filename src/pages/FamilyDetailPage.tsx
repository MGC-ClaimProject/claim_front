import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../api/axiosInstance"; // ✅ 인증 요청을 위한 axios 인스턴스
import ProfileCard from "../components/ProfileCard"; // ✅ 공통 프로필 카드 사용
import { Member } from "../stores/useAuthStore";
import "../styles/ProfilePage.css";


const FamilyDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>(); // ✅ URL에서 멤버 ID 가져오기
  const [member, setMember] = useState<Member | null>(null);

  // ✅ 특정 멤버 정보 가져오기
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await auth.get(`/members/${memberId}/`);
        setMember(response.data);
      } catch (error) {
        console.error("❌ 멤버 정보 가져오기 실패:", error);
      }
    };

    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  return (
    <div className="profile-container">
      {member ? (
        <ProfileCard
          memberId={member.id}
          name={member.name}
          phone={member.phone}
          birth={member.birth}
          gender={member.gender}
        />
      ) : (
        <p>멤버 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default FamilyDetailPage;
