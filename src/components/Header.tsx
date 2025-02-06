import React from "react";
import { FaUser } from "react-icons/fa";

interface HeaderProps {
  onUserClick: () => void; // 마이페이지 패널 토글 함수
}

const Header: React.FC<HeaderProps> = ({ onUserClick }) => {
  return (
    <div className="header">
      <FaUser className="user-icon" onClick={onUserClick} />
    </div>
  );
};

export default Header;
