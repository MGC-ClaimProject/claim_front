import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KAKAO_LOGIN_CALLBACK_API = "http://localhost:8000/api/v1/users/login/kakao/callback/";

const KakaoLoginCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code"); // ✅ GET 요청에서 인가 코드 추출

    if (!code) {
      console.error("⚠️ 카카오 로그인 코드가 없습니다.");
      navigate("/login"); // ✅ 인가 코드가 없으면 로그인 페이지로 리디렉트
      return;
    }

    // ✅ GET 요청에서 받은 인가 코드를 POST 요청으로 다시 보냄
    console.log("카카오 로그인 요청 시작 - 인가 코드:", code);
    axios
      .post(
        KAKAO_LOGIN_CALLBACK_API,
        { code },
        {
          withCredentials: true, // ✅ 쿠키 포함 (리프레시 토큰 받기)
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log("🔹 카카오 로그인 응답:", response.data);
        const { access_token, user } = response.data;
        console.log(user);

        // ✅ 1. 액세스 토큰 저장
        localStorage.setItem("access_token", access_token);

        // ✅ 2. 로그인 성공 후 메인 페이지로 이동
        navigate("/main");
      })
      .catch((error) => {
        console.error("⚠️ 로그인 오류:", error);
        navigate("/login");
      });
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoLoginCallback;
