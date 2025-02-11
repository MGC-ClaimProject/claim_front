import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { auth } from "../api/axiosInstance"; // ✅ 인증 요청을 위한 axios 인스턴스
import "../styles/ProfileCard.css"; // ✅ 스타일 적용

interface ProfileCardProps {
  memberId: number; // ✅ 멤버 ID
  name: string;
  phone: string;
  birth: string;
  gender: string;
  onSave?: () => void; // ✅ 저장 후 실행할 콜백 함수
}

const ProfileCard: React.FC<ProfileCardProps> = ({ memberId, name, phone, birth, gender, onSave }) => {
  // const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name, phone, birth, gender });

  // ✅ 성별 변환 (영어 → 한글)
  const genderKorean = formData.gender === "Male" ? "남성" : formData.gender === "Female" ? "여성" : "-";

  // ✅ 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isAdAgreed" ? value === "true" : value, // ✅ Boolean 변환 처리
    }));
  };

  // ✅ 저장 버튼 클릭 시 API 요청 (PATCH)
  const handleSave = async () => {
    try {
      await auth.patch(`/members/${memberId}/`, formData); // ✅ PATCH 요청
      alert("정보가 성공적으로 저장되었습니다.");
      setIsEditing(false);
      onSave?.(); // ✅ 저장 후 콜백 실행 (데이터 갱신)
    } catch (error) {
      console.error("❌ 정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  // ✅ 수정 모드 취소
  const handleCancel = () => {
    setFormData({ name, phone, birth, gender });
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="profile-title">{formData.name || "고객"}님의 정보</h2>
        {isEditing && (
          <button className="cancel-btn" onClick={handleCancel}>
            ❌
          </button>
        )}
      </div>

      {/* ✅ 이름 */}
      <div className="profile-info">
        <label>📝 이름</label>
        {isEditing ? (
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        ) : (
          <span>{formData.name || "-"}</span>
        )}
      </div>

      {/* ✅ 연락처 */}
      <div className="profile-info">
        <label>📞 연락처</label>
        {isEditing ? (
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        ) : (
          <span>{formData.phone || "-"}</span>
        )}
      </div>

      {/* ✅ 생년월일 */}
      <div className="profile-info">
        <label>🎂 생년월일</label>
        {isEditing ? (
          <input type="date" name="birth" value={formData.birth} onChange={handleChange} />
        ) : (
          <span>{formData.birth || "-"}</span>
        )}
      </div>

      {/* ✅ 성별 */}
      <div className="profile-info">
        <label>🚻 성별</label>
        {isEditing ? (
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">남성</option>
            <option value="Female">여성</option>
          </select>
        ) : (
          <span>{genderKorean}</span>
        )}
      </div>

      {/* ✅ 저장 버튼 */}
      {isEditing ? (
        <button className="profile-edit-btn" onClick={handleSave}>
          ✅ 저장하기
        </button>
      ) : (
        <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
          ✏️ 내 정보 수정하기
        </button>
      )}
    </div>
  );
};

export default ProfileCard;
