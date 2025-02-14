import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  // ✅ 로컬 스토리지에서 `user` 정보 가져오기
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userMemberId = storedUser?.member_id;

  const handleInsuranceClick = () => {
    if (userMemberId) {
      navigate(`/main/${userMemberId}/insurance`, { state: { memberName: "나" } }); // ✅ 내 보험 리스트
    } else {
      alert("사용자 정보가 없습니다. 다시 로그인 해주세요.");
      navigate("/login");
    }
  };

  return (
    <div className="button-container">
      <button className="action-button" onClick={handleInsuranceClick}>내 보험</button>
      <button className="action-button" onClick={() => navigate("/main/claim")}>보험 청구</button>
    </div>
  );
};

export default MainPage;
