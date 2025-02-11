import React, { useState } from "react";
import { auth } from "../api/axiosInstance";
import "../styles/AddFamilyModal.css"; // ✅ 모달 스타일 적용

interface AddFamilyModalProps {
  onClose: () => void; // ✅ 모달 닫기 함수
}

const AddFamilyModal: React.FC<AddFamilyModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    birth: "",
    gender: "Male",
    relation: "",
  });

  // ✅ 입력 값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 가족 추가 API 요청
  const handleAddFamily = async () => {
    try {
      await auth.post("/members/", formData);
      alert("가족이 추가되었습니다!");
      onClose(); // ✅ 모달 닫기
      window.location.reload(); // ✅ 페이지 새로고침 (가족 리스트 갱신)
    } catch (error) {
      console.error("❌ 가족 추가 실패:", error);
      alert("가족 추가에 실패했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>👨‍👩‍👧 가족 추가</h3>
        <input type="text" name="name" placeholder="이름" onChange={handleChange} required />
        <input type="date" name="birth" onChange={handleChange} required />
        <select name="gender" onChange={handleChange}>
          <option value="Male">남성</option>
          <option value="Female">여성</option>
        </select>
        <input type="text" name="relation" placeholder="관계 (예: 아버지, 어머니)" onChange={handleChange} required />
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>취소</button>
          <button className="confirm-btn" onClick={handleAddFamily}>추가하기</button>
        </div>
      </div>
    </div>
  );
};

export default AddFamilyModal;
