import React, { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import ProfileCard from "../components/cards/ProfileCard.tsx";
import InsuranceButton from "../components/buttons/InsuranceButton.tsx";
import ClaimsListButton from "../components/buttons/ClaimsListButton.tsx";
import FamilyButton from "../components/buttons/FamilyButton.tsx";
import "../styles/pages/profilePage.css";

const ProfilePage: React.FC = () => {
  const { member, fetchSelfMember, fetchMember } = useAuthStore();

  useEffect(() => {
    fetchSelfMember();
  }, []);

  return (
    <div className="profile-container">
      {member ? (
        <ProfileCard member={member} onSave={() => fetchMember(member.id)} />
      ) : (
        <p>🔄 멤버 정보를 불러오는 중...</p>
      )}

      {/* ✅ 이동 버튼 모음 */}
      <div className="profile-links">
        <InsuranceButton /> {/* 내 보험 리스트로 이동 (memberId 없음) */}
        <ClaimsListButton />
        <FamilyButton />
      </div>
    </div>
  );
};

export default ProfilePage;
