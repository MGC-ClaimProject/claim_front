import React from "react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../stores/useSignupStore";
import "../styles/signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useSignupStore();

  const relationOptions = ["본인", "부모", "조부모", "자녀", "친척", "기타"];
  const genderOptions = ["남성", "여성", "기타"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ [e.target.name]: e.target.value });
  };

  const handleAgreeAndContinue = () => {
    if (!formData.relation || !formData.name || !formData.phone || !formData.birthDate || !formData.gender) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // ✅ 입력한 회원가입 정보 로컬 스토리지에 저장 (광고 동의 페이지에서도 필요)
    localStorage.setItem("signupData", JSON.stringify(formData));

    navigate("/signup/ad-consent"); // ✅ 광고성 정보 동의 페이지로 이동
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

      <button className="agree-button" onClick={handleAgreeAndContinue}>
        모두 동의하고 계속하기
      </button>
    </div>
  );
};

export default Signup;
