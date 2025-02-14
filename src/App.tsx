import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppWrapper from "./AppWrapper"; // ✅ 새로 만든 AppWrapper 컴포넌트
import "./styles/global.css";
import "./styles/modals/mypage.css";
import "./styles/pages/main.css";

const App: React.FC = () => {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
};

export default App;
