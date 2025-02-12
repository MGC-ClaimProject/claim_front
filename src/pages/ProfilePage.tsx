import React, { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import ProfileCard from "../components/ProfileCard"; // ✅ 공통 컴포넌트 추가
import "../styles/profilePage.css";

const ProfilePage: React.FC = () => {
  const { member, fetchSelfMember, fetchMember } = useAuthStore();

  useEffect(() => {
    fetchSelfMember(); // ✅ 본인(Self) 멤버 정보 자동 로드
  }, []);

  return (
    <div className="profile-container">
      {member ? (
        <ProfileCard
          member={member} // ✅ member 객체 전체를 전달
          onSave={() => fetchMember(member.id)} // ✅ 저장 후 최신 데이터 불러오기
        />
      ) : (
        <p>🔄 멤버 정보를 불러오는 중...</p>
      )}

      {/* ✅ 이동 버튼 */}
      <div className="profile-links">
        <button className="insurance-btn" onClick={() => window.location.href = "/main/insurance"}>
          📋 보험 리스트 보러가기
        </button>
        <button className="claims-btn" onClick={() => window.location.href = "/main/claims"}>
          📝 청구 내역 보러가기
        </button>
        <button className="family-btn" onClick={() => window.location.href = "/main/family"}>
          👨‍👩‍👧 가족 리스트 보러가기
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
