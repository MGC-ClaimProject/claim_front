import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { client } from "../../api/axiosInstance.tsx"; // ✅ axios 인스턴스
import "../../styles/login.css";
import Logo from "../../components/Logo.tsx";
import kakaoIcon from "../../assets/kakao_icon.png";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_BACKEND_BASE_URL + "/users/login/kakao/callback/";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // ✅ 로그인 성공 후 인가 코드 확인 및 백엔드에 전송
  useEffect(() => {
    const kakaoCode = searchParams.get("code"); // ✅ URL에서 `code` 추출

    if (kakaoCode) {
      console.log("✅ 인가 코드 수신:", kakaoCode);
      handleAuth(kakaoCode);
    }
  }, [searchParams]);

  const handleAuth = async (code: string) => {
    try {
      setLoading(true);

      // ✅ 백엔드에 `code` 전송하여 액세스 토큰 요청
      const response = await client.post(KAKAO_REDIRECT_URI, { code });

      if (response.data.access_token) {
        console.log("✅ 백엔드 로그인 성공", response.data);
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/main");
      }
    } catch (error) {
      console.error("❌ 카카오 로그인 요청 실패:", error.response?.data || error.message);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // ✅ 카카오 로그인 페이지로 이동
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
