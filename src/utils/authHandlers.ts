// src/utils/authHandlers.ts
import { auth } from "../api/axiosInstance.tsx";


// ✅ 로그아웃 핸들러
export const handleLogout = async (clearAuth: () => void, navigate: (path: string) => void) => {
  try {
    const response = await auth.post("/users/logout/", {}, { withCredentials: true });

    if (response.status === 200) {
      clearAuth(); // ✅ Zustand 상태 초기화
      navigate("/login"); // ✅ 로그인 페이지로 이동
    } else {
      throw new Error("로그아웃 실패");
    }
  } catch (error) {
    console.error("❌ 로그아웃 오류:", error);
    alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
  }
};
