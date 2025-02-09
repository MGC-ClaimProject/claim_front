import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const BACKEND_CALLBACK_URI = import.meta.env.VITE_BACKEND_BASE_URL + "/users/login/kakao/callback/";

const KakaoAuth: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 현재 URL에서 `code` 추출
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      console.log("✅ 카카오 인가 코드 수신:", code);
      requestAccessToken(code);
    } else {
      console.error("❌ 인가 코드가 없습니다.");
      navigate("/");
    }
  }, []);

  const requestAccessToken = async (code: string) => {
    try {
      // ✅ 카카오 API에 액세스 토큰 요청 (`POST`)
      const response = await axios.post("https://kauth.kakao.com/oauth/token", null, {
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        params: {
          grant_type: "authorization_code",
          client_id: KAKAO_CLIENT_ID,
          redirect_uri: BACKEND_CALLBACK_URI, // ✅ 백엔드 콜백 URL 사용
          code: code,
        },
      });

      const accessToken = response.data.access_token;
      console.log("✅ 카카오 액세스 토큰 수신:", accessToken);

      // ✅ 백엔드에 액세스 토큰 전송하여 로그인 처리
      const backendResponse = await axios.post(BACKEND_CALLBACK_URI, { access_token: accessToken });

      if (backendResponse.data.access_token) {
        console.log("✅ 백엔드 로그인 성공", backendResponse.data);
        localStorage.setItem("access_token", backendResponse.data.access_token);
        localStorage.setItem("user", JSON.stringify(backendResponse.data.user));
        navigate("/main");
      }
    } catch (error) {
      console.error("❌ 카카오 로그인 요청 실패:", error.response?.data || error.message);
      navigate("/");
    }
  };

  return <div>로그인 처리 중...</div>;
};

export default KakaoAuth;
