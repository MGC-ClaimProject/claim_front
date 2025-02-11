import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/axiosInstance"; // ✅ 인증 요청을 위한 axios 인스턴스
import "../styles/FamilyList.css"; // ✅ 스타일 적용
import { Member } from "../stores/useAuthStore";
import AddFamilyModal from "../components/AddFamilyModal"; // ✅ 가족 추가 모달 import

const FamilyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]); // ✅ 가족 목록 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 모달 상태

  // ✅ 가족 목록 가져오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await auth.get("/members/"); // ✅ API 요청
        const filteredMembers = response.data.filter((member: Member) => member.id !== 1); // ✅ 1번 멤버 제외
        setMembers(filteredMembers);
      } catch (error) {
        console.error("❌ 가족 목록 가져오기 실패:", error);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="family-container">
      {/* ✅ 타이틀과 '가족 추가하기' 버튼 */}
      <div className="family-header">
        <h2 className="family-title">👨‍👩‍👧 나의 가족</h2>
        <button className="add-family-btn" onClick={() => setIsModalOpen(true)}>
          가족 추가하기 ➕
        </button>
      </div>

      {/* ✅ 가족 목록 */}
      <div className="family-list">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="family-card"
              onClick={() => navigate(`/main/family/${member.id}`)} // ✅ 특정 멤버 페이지로 이동
            >
              <p className="family-name">{member.name} 님</p>
              <p className="family-relation">관계: {member.relation}</p>
              <p className="family-gender">성별: {member.gender === "Male" ? "남성" : "여성"}</p>
              <p className="family-birth">🎂 {member.birth}</p>
            </div>
          ))
        ) : (
          <p className="no-family">가족 구성원이 없습니다.</p>
        )}
      </div>

      {/* ✅ 가족 추가 모달 */}
      {isModalOpen && <AddFamilyModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default FamilyListPage;
