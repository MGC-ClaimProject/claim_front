import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { client } from "../../api/axiosInstance.tsx"; // ✅ 로그인 전 요청용
import { useAuthStore } from "../../stores/useAuthStore.tsx";
import "../../styles/login.css";
import Logo from "../../components/Logo.tsx";
import kakaoIcon from "../../assets/kakao_icon.png";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_BACKEND_BASE_URL + "/users/login/kakao/callback/";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const kakaoCode = searchParams.get("code");

    if (kakaoCode) {
      console.log("✅ 인가 코드 수신:", kakaoCode);
      handleAuth(kakaoCode);
    }
  }, [searchParams]);

  const handleAuth = async (code: string) => {
    try {
      setLoading(true);

      // ✅ 로그인 전 요청 → `client` 사용
      const response = await client.post(KAKAO_REDIRECT_URI, { code });

      if (response.data.access_token) {
        console.log("✅ 백엔드 로그인 성공", response.data);
        setAuth(response.data.access_token, response.data.user);
        navigate("/main");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("❌ 카카오 로그인 요청 실패:", error.message);
      } else {
        console.error("❌ 알 수 없는 오류 발생");
      }
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
  };

  return (
    <div className="login-container">
      <h1 className="login-title">보험 간편 청구</h1>
      <div className="logo-wrapper">
        <Logo />
      </div>
      <button className="kakao-button" onClick={handleLogin} disabled={loading}>
        {loading ? "로딩 중..." : (
          <>
            <img src={kakaoIcon} width="20" height="20" alt="카카오 로그인" /> 카카오로 계속하기
          </>
        )}
      </button>
    </div>
  );
};

export default LoginPage;
