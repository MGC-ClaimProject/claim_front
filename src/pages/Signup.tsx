import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    relation: "",
    name: "",
    phone: "",
    birthDate: "",
    gender: "",
  });

  const relationOptions = ["본인", "부모", "조부모", "자녀", "친척", "기타"];
  const genderOptions = ["남성", "여성", "기타"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 모든 필드가 입력되었는지 검증 후 광고성 정보 동의 페이지로 이동
  const handleAgreeAndContinue = () => {
    const { relation, name, phone, birthDate, gender } = formData;

    if (!relation || !name || !phone || !birthDate || !gender) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    navigate("/signup/ad-consent", { state: formData }); // 선택 동의 페이지로 데이터 전달
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">회원 가입</h1>

        <select name="relation" value={formData.relation} onChange={handleChange} className="input-field">
          <option value="">관계 선택</option>
          {relationOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름" className="input-field" />

        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="전화번호" className="input-field" />

        <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} placeholder="생년월일 (YYYY-MM-DD)" className="input-field" />

        <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
          <option value="">성별 선택</option>
          {genderOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* ✅ 회원가입 박스 아래에 동의 박스를 배치 */}
      <div className="agreement-box">
        <p className="agreement-title">서비스 이용을 위해 동의가 필요해요</p>
        <label className="agreement-item">
          <input type="checkbox" /> [필수] 개인정보 수집·이용 동의
        </label>
        <label className="agreement-item">
          <input type="checkbox" /> [필수] 민감정보 수집·이용 동의
        </label>
        <label className="agreement-item">
          <input type="checkbox" /> [필수] 고유식별 정보 처리 동의
        </label>
        <button className="agree-button" onClick={handleAgreeAndContinue}>
          모두 동의하고 계속하기
        </button>
      </div>
    </div>
  );
};

export default Signup;
