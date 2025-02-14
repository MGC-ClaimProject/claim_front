import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api/axiosInstance";
import "../styles/pages/familyList.css";
import { Member } from "../stores/useAuthStore";
import AddFamilyModal from "../components/modals/AddFamilyModal.tsx";
import { RELATION_CHOICES } from "../constants/choices.ts";

const FamilyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await auth.get("/members/");
        const members: Member[] = response.data;

        // ✅ 본인(Self)을 제외한 멤버만 필터링
        const filteredMembers = members.filter((member) => member.relation !== "Self");
        setMembers(filteredMembers);
      } catch (error) {
        console.error("❌ 가족 목록 가져오기 실패:", error);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="family-container">
      <div className="family-header">
        <h2 className="family-title">👨‍👩‍👧 나의 가족</h2>
        <button className="add-family-btn" onClick={() => setIsModalOpen(true)}>
          <p>➕</p>
        </button>
      </div>

      <div className="family-list">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member.id}
              className="family-card"
              onClick={() => navigate(`/main/family/${member.id}`)}
            >
              <p className="family-name">{member.name} 님</p>
              <p className="family-relation">
                관계: {RELATION_CHOICES[member.relation] || "기타"}
              </p>
              <p className="family-gender">성별: {member.gender === "Male" ? "남성" : "여성"}</p>
              <p className="family-birth">🎂 {member.birth}</p>
            </div>
          ))
        ) : (
          <p className="no-family">가족 구성원이 없습니다.</p>
        )}
      </div>

      {isModalOpen && <AddFamilyModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default FamilyListPage;
