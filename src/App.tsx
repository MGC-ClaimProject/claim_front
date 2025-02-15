import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppWrapper from "./AppWrapper"; // ✅ 라우트 설정 포함
import "./styles/global.css";
import "./styles/modals/mypage.css";
import "./styles/pages/main.css";

const App: React.FC = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
