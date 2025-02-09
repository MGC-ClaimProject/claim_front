import React from "react";
import { useNavigate } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";
import { useAuthStore } from "../stores/useAuthStore.tsx"; // ✅ Zustand import

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_LOGOUT = "http://localhost:8000/api/v1/users/logout/";

const MyPageModal: React.FC<MyPageModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth); // ✅ Zustand 상태 가져오기

  // ✅ 모달 애니메이션 (오른쪽에서 나오는 효과)
  const slideIn = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(100%)",
    opacity: isOpen ? 1 : 0,
  });

  // ✅ 로그아웃 핸들러 (Zustand 적용)
  const handleLogout = async () => {
    try {
      await fetch(API_LOGOUT, {
        method: "POST",
        credentials: "include",
      });

      clearAuth(); // ✅ Zustand로 상태 초기화
      navigate("/"); // ✅ 메인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return (
    <>
      {/* ✅ 배경 어둡게 처리 (모달이 열릴 때) */}
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>

      {/* ✅ 애니메이션이 적용된 마이페이지 패널 */}
      <animated.div className="mypage-panel" style={slideIn}>
        <button className="close-button" onClick={onClose}>✖</button>
        <div className="mypage-title">고객 이름</div>
        <ul className="mypage-menu">
          <li onClick={() => navigate("/profile")}>내 정보</li>
          <li onClick={() => navigate("/claims")}>청구 내역</li>
          <li onClick={() => navigate("/family")}>나의 가족</li>
          <li onClick={handleLogout}>로그아웃</li> {/* ✅ Zustand 적용된 로그아웃 */}
        </ul>
      </animated.div>
    </>
  );
};

export default MyPageModal;
