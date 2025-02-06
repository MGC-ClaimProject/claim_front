import React from "react";
import kakaoIcon from "../assets/kakao_icon.png";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_REDIRECT_URI = import.meta.env.VITE_REDIRECT_BASE_URL + "/users/login/kakao/callback/";

const KakaoLogin: React.FC = () => {
  const handleLogin = () => {
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      "",
      "kakaoLoginPopup",
      `width=${width}, height=${height}, top=${top}, left=${left}`
    );

    if (!popup) {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도하세요.");
      return;
    }

    setTimeout(() => {
      popup.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
    }, 500);
  };

  return (
    <button className="kakao-button" onClick={handleLogin}>
      <img src={kakaoIcon} width="20" height="20" alt="카카오 로그인" /> 카카오로 계속하기
    </button>
  );
};

export default KakaoLogin;
