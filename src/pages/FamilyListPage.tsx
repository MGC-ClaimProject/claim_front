import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDrag } from "@use-gesture/react"; // ✅ 스와이프 추가
import { auth } from "../api/axiosInstance";
import "../styles/familyList.css";
import { Member } from "../stores/useAuthStore";
import AddFamilyModal from "../components/AddFamilyModal";
import { RELATION_CHOICES } from "../constants/choices.ts";

const FamilyListPage: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

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

  // ✅ 스와이프 감지 (가족 목록 스크롤)
  const bind = useDrag(({ movement: [, my], last }) => {
    if (listRef.current) {
      const containerHeight = listRef.current.clientHeight; // 현재 화면 높이
      const contentHeight = listRef.current.scrollHeight; // 컨텐츠 전체 높이

      setOffset((prev) => {
        let newOffset = prev + my;

        // ✅ 위아래 이동 범위 제한
        newOffset = Math.max(-(contentHeight - containerHeight), Math.min(0, newOffset));

        return newOffset;
      });

      if (last) {
        listRef.current.style.transform = `translateY(${offset}px)`;
      }
    }
  });

  return (
    <div className="family-container">
      <div className="family-header">
        <h2 className="family-title">👨‍👩‍👧 나의 가족</h2>
        <button className="add-family-btn" onClick={() => setIsModalOpen(true)}>
          <p>➕</p>
        </button>
      </div>

      <div className="family-list" ref={listRef} {...bind()} style={{ transform: `translateY(${offset}px)`, transition: "transform 0.2s ease-out" }}>
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
