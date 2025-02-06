import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button className="action-button" onClick={() => navigate("/main/insurance")}>내 보험</button>
      <button className="action-button" onClick={() => navigate("/main/claim")}>보험 청구</button>
    </div>
  );
};

export default MainPage;
