import { create } from "zustand";
import { auth } from "../api/axiosInstance"; // ✅ 인증 요청을 위해 auth 사용

export interface User {
  id: number;
  email: string;
  user_name: string;
  phone: string;
  birth: string;
}

export interface Member {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

export interface ProfileCardProps {
  member: Member; // ✅ `member` 객체를 props로 받음
  setFormData?: (updatedData: Partial<Member>) => void; // ✅ 상태 업데이트 함수 추가
  onSave?: () => void; // ✅ 저장 후 새로고침을 위한 콜백
  hideRelation?: boolean;
}


interface AuthState {
  accessToken: string | null;
  user: User | null;
  member: Member | null;
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
  fetchMember: (memberId: number) => Promise<void>;
  fetchSelfMember: () => Promise<void>; // ✅ `Self` 멤버 자동 로드
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  member: JSON.parse(localStorage.getItem("member") || "null"),

  setAuth: (accessToken, user) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, user });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("member");
    set({ accessToken: null, user: null, member: null });
  },

 fetchUser: async () => {
    try {
      const response = await auth.get("/user/me/"); // ✅ 현재 로그인한 사용자 정보 가져오기
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      set({ user: userData });
    } catch (error) {
      console.error("❌ 사용자 정보 가져오기 실패:", error);
    }
  },





  fetchMember: async (memberId: number) => {
    try {
      const response = await auth.get(`/members/${memberId}/`);
      const memberData = response.data;
      localStorage.setItem("member", JSON.stringify(memberData));
      set({ member: memberData });
    } catch (error) {
      console.error("❌ 멤버 정보 가져오기 실패:", error);
    }
  },

  fetchSelfMember: async () => {
    try {
      const response = await auth.get("/members/");
      const members: Member[] = response.data;

      // ✅ "Self" 관계를 가진 첫 번째 멤버 찾기
      const selfMember = members.find((member) => member.relation === "Self");

      if (!selfMember) {
        console.warn("⚠️ 본인(Self) 관계를 가진 멤버가 없습니다.");
        return;
      }

      console.log(`✅ 본인(Self) 멤버 ID: ${selfMember.id}`);
      localStorage.setItem("member", JSON.stringify(selfMember));
      set({ member: selfMember });
    } catch (error) {
      console.error("❌ 본인(Self) 멤버 가져오기 실패:", error);
    }
  },
}));



