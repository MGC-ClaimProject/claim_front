import { useEffect, useState } from "react";
import { auth } from "../api/axiosInstance.tsx";

// ✅ 보험 정보 타입
interface Insurance {
  id: number;
  company: string;
  policy_name: string;
  premium: number;
}

// ✅ useFetchInsurances 훅 생성
const useFetchInsurances = (memberId?: string) => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsurances();
  }, [memberId]);

  const fetchInsurances = async () => {
    if (!memberId) return; // 멤버 ID가 없으면 요청하지 않음

    try {
      const response = await auth.get(`/insurances/${memberId}/`);
      setInsurances(response.data);
    } catch (error) {
      console.error("❌ 보험 정보를 가져오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 보험료 총합 계산 (숫자로 변환 후 합산)
  const totalPremium = insurances.reduce((sum, insurance) => sum + Number(insurance.premium || 0), 0);

  return { insurances, loading, totalPremium, fetchInsurances };
};

export default useFetchInsurances;
