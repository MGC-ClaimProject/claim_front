import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MyPageModal from "../components/MyPageModal";
import { useDrag } from "@use-gesture/react"; // ✅ 스와이프 감지

const MainLayout: React.FC = () => {
  const [isMyPageOpen, setIsMyPageOpen] = useState(false);

  // ✅ 스와이프 감지 로직 (모달 열고 닫기)
  const bind = useDrag(({ movement: [mx], last }) => {
    if (last) {
      if (mx < -50) setIsMyPageOpen(true);  // 왼쪽 스와이프 → 모달 열기
      if (mx > 50) setIsMyPageOpen(false);  // 오른쪽 스와이프 → 모달 닫기
    }
  });

  return (
    <div className="main-layout" {...bind()}>
      {/* ✅ 공통 헤더 */}
      <Header onUserClick={() => setIsMyPageOpen(true)} />

      {/* ✅ 배경 오버레이 (모달 열릴 때 활성화) */}
      <div className={`overlay ${isMyPageOpen ? "open" : ""}`} onClick={() => setIsMyPageOpen(false)}></div>

      {/* ✅ 마이페이지 모달 */}
      <MyPageModal isOpen={isMyPageOpen} onClose={() => setIsMyPageOpen(false)} />

      {/* ✅ 변경되는 콘텐츠 영역 */}
      <div className="content">
        <Outlet />  {/* ✅ 여기서 `MainPage`, `InsurancePage`, `ClaimPage`가 바뀜 */}
      </div>
    </div>
  );
};

export default MainLayout;
