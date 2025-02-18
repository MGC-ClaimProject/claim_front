import { create } from "zustand";
import { auth } from "../api/axiosInstance";

export interface Document {
  id: number;
  document_url: string;
  created_at: string;
  page_count?: number;
}

export interface ClaimData {
  claimId?: number;
  member?: Member;
  insured?: Member;
  applicant?: Member;
  symptoms?: string;
  incidentType?: string;
  treatmentType?: string;
  hospitalDays?: number | null;
  incidentDate?: string;
  applicantSignature?: string | null;
  insuredSignature?: string | null;
  bank?: string | null;
  account?: string | null;
  isSameAsPayoutAccount?: boolean;
  claimStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  claimInsurers?: { company: string; policy_name: string }[];
  documents?: Document[];
  selectedInsurances?: { company: string; policy_name: string }[]; // ✅ 추가
}



export interface User {
  id: number;
  email: string;
  user_name: string;
  phone: string;
  birth: string;
  member_id: number;
}

export interface Member {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

export interface Insurance {
  id: number;
  company: string;
  policy_name: string;
  premium: number;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  member: Member | null;
  members: Member[];
  claimData: ClaimData | null;
  selectedMemberId: number | null; // ✅ 추가
  setSelectedMemberId: (id: number | null) => void; // ✅ 추가
  setAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  fetchUser: () => Promise<void>;
  fetchMembers: () => Promise<void>;
  fetchMember: (id: number) => Promise<void>;
  setClaimData: (data: ClaimData | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  user: JSON.parse(localStorage.getItem("user") || "null"),
  member: JSON.parse(localStorage.getItem("member") || "null"),
  members: [],
  claimData: JSON.parse(localStorage.getItem("claimData") || "null"),
  selectedMemberId: null, // ✅ 기본값 설정

  setAuth: (accessToken, user) => {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
    set({ accessToken, user });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("member");
    localStorage.removeItem("claimData");
    set({ accessToken: null, user: null, member: null, claimData: null, members: [], selectedMemberId: null });
  },

  fetchUser: async () => {
    try {
      const response = await auth.get("/user/me/");
      localStorage.setItem("user", JSON.stringify(response.data));
      set({ user: response.data });
    } catch (error) {
      console.error("❌ 사용자 정보 가져오기 실패:", error);
    }
  },

  fetchMembers: async () => {
    try {
      console.log("📡 가족 멤버 가져오는 중...");
      const response = await auth.get("/members/");
      set({ members: response.data });
    } catch (error) {
      console.error("❌ 가족 멤버 가져오기 실패:", error);
    }
  },

  fetchMember: async (id: number) => {
    try {
      const response = await auth.get(`/members/${id}/`);
      set({ member: response.data });
    } catch (error) {
      console.error(`❌ 멤버 ${id} 정보 가져오기 실패:`, error);
    }
  },

  setSelectedMemberId: (id) => set({ selectedMemberId: id }), // ✅ 멤버 선택 함수 추가

  setClaimData: (data: ClaimData | null) => {
    if (data === null) {
      localStorage.removeItem("claimData");
    } else {
      localStorage.setItem("claimData", JSON.stringify(data));
    }
    set({ claimData: data });
  },
}));

