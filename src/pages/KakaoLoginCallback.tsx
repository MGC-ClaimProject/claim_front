import React, { useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const KAKAO_LOGIN_CALLBACK_API = "http://localhost:8000/api/v1/users/login/kakao/callback/";

const KakaoLoginCallback: React.FC = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (!code) {
      console.error("⚠️ 카카오 로그인 코드가 없습니다.");
      return;
    }

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

        // ✅ 1. 액세스 토큰을 localStorage에 저장
        localStorage.setItem("access_token", access_token);

        // ✅ 2. 유저 정보를 Zustand 상태에 저장
        setAuth(access_token, user);

        // ✅ 3. 부모 창에 로그인 성공 메시지 전달
        window.opener.postMessage(
          { status: response.status === 200 ? "success" : "new_user" },
          "http://localhost:5173"
        );

        window.close();
      })
      .catch((error) => {
        console.error("⚠️ 로그인 오류:", error);
        window.opener.postMessage({ status: "error", data: error.message }, "http://localhost:5173");
        window.close();
      });
  }, [setAuth]);

  return <div>로그인 중...</div>;
};

export default KakaoLoginCallback;
