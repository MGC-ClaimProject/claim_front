import React, { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import ProfileCard from "../components/ProfileCard"; // ✅ 공통 컴포넌트 추가
import "../styles/ProfilePage.css";

const ProfilePage: React.FC = () => {
  const { member, fetchMember } = useAuthStore();
  const memberId = 1; // ✅ 항상 1번 멤버를 요청

  useEffect(() => {
    fetchMember(memberId);
  }, []);

  return (
    <div className="profile-container">
      {/* ✅ 공통 컴포넌트 사용 */}
      {member && (
        <ProfileCard
          memberId={memberId} // ✅ 멤버 ID 전달
          name={member.name}
          phone={member.phone}
          birth={member.birth}
          gender={member.gender}
          onSave={() => fetchMember(memberId)} // ✅ 저장 후 최신 데이터 불러오기
        />
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
