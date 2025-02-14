import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { animated, useSpring } from "@react-spring/web";
import { useAuthStore } from "../../stores/useAuthStore.tsx";
import { handleLogout } from "../../utils/authHandlers.ts"; // ✅ 로그아웃 핸들러 가져오기

interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyPageModal: React.FC<MyPageModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const user = useAuthStore((state) => state.user);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user?.user_name || storedUser?.user_name || "고객";

  const slideIn = useSpring({
    transform: isOpen ? "translateX(0%)" : "translateX(110%)",
    opacity: isOpen ? 1 : 0.8,
  });

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname]);

  return (
    <>
      <div className={`overlay ${isOpen ? "open" : ""}`} onClick={onClose}></div>
      <animated.div className="mypage-panel" style={slideIn}>
        <button className="close-button" onClick={onClose}>✖</button>
        <div className="mypage-title">{userName} 님</div>
        <ul className="mypage-menu">
          <li onClick={() => navigate("/main/profile")}>내 정보</li>
          <li onClick={() => navigate("/main/claims")}>청구 내역</li>
          <li onClick={() => navigate("/main/family")}>나의 가족</li>
          <li onClick={() => handleLogout(clearAuth, navigate)}>로그아웃</li> {/* ✅ 핸들러 사용 */}
        </ul>
      </animated.div>
    </>
  );
};

export default MyPageModal;
