import React, { useState, useEffect } from "react";
import { auth } from "../../api/axiosInstance.tsx";
import { Member, ProfileCardProps, useAuthStore } from "../../stores/useAuthStore.tsx";
import "../../styles/cards/profileCard.css";
import { RELATION_CHOICES, GENDER_CHOICES } from "../../constants/choices.ts";

const ProfileCard: React.FC<ProfileCardProps> = ({ member, setFormData, onSave, hideRelation = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<Member>(member);
  const fetchMember = useAuthStore((state) => state.fetchMember); // ✅ Zustand에서 fetchMember 가져오기

  // ✅ `member` 변경될 때마다 `tempData` 업데이트
  useEffect(() => {
    setTempData(member);
  }, [member]);

  // ✅ 전화번호 포맷 적용
  function formatPhoneNumber(value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }

  // ✅ 입력 변경 감지
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhoneNumber(value) : value,
    }));
  };

  // ✅ 수정된 데이터 저장
  const handleSave = async () => {
    try {
      const requestData = { ...tempData, phone: tempData.phone.replace(/-/g, "") };
      console.log("📤 저장 요청 데이터:", requestData);

      // ✅ 서버 업데이트 요청
      const response = await auth.patch(`/members/${member.id}/`, requestData);
      const updatedMember = response.data;

      // ✅ Zustand 및 `setFormData`를 통해 상태 업데이트
      if (setFormData) {
        setFormData(updatedMember);
      }

      await fetchMember(updatedMember.id); // ✅ 최신 데이터 반영

      // ✅ UI 업데이트
      setTempData(updatedMember);
      alert("정보가 성공적으로 저장되었습니다.");
      setIsEditing(false);
      onSave?.(); // ✅ 추가적인 데이터 갱신 요청
    } catch (error) {
      console.error("❌ 정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  // ✅ 수정 취소
  const handleCancel = () => {
    setTempData(member);
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h2 className="profile-title">{tempData.name || "고객"}님의 정보</h2>
        {isEditing && <button className="cancel-btn" onClick={handleCancel}>❌</button>}
      </div>

      {!isEditing ? (
        <>
          <div className="profile-info"><label>📝 이름</label><span>{tempData.name || "-"}</span></div>
          <div className="profile-info"><label>📞 연락처</label><span>{formatPhoneNumber(tempData.phone) || "-"}</span></div>
          <div className="profile-info"><label>🎂 생년월일</label><span>{tempData.birth || "-"}</span></div>
          <div className="profile-info"><label>🚻 성별</label>
            <span>{GENDER_CHOICES[tempData.gender] || "-"}</span>
          </div>
          {!hideRelation && tempData.relation !== "Self" && (
            <div className="profile-info">
              <label>🔗 관계</label>
              <span>{RELATION_CHOICES[tempData.relation] || "기타"}</span>
            </div>
          )}
          <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
            ✏️ 수정하기
          </button>
        </>
      ) : (
        <>
          <div className="profile-info">
            <label>📝 이름</label>
            <input type="text" name="name" value={tempData.name} onChange={handleChange} />
          </div>

          <div className="profile-info">
            <label>📞 연락처</label>
            <input type="text" name="phone" value={tempData.phone} onChange={handleChange} maxLength={13} />
          </div>

          <div className="profile-info">
            <label>🎂 생년월일</label>
            <input type="date" name="birth" value={tempData.birth} onChange={handleChange} />
          </div>

          <div className="profile-info">
            <label>🚻 성별</label>
            <select name="gender" value={tempData.gender} onChange={handleChange}>
              {Object.entries(GENDER_CHOICES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {!hideRelation && tempData.relation !== "Self" && (
            <div className="profile-info">
              <label>🔗 관계</label>
              <select name="relation" value={tempData.relation} onChange={handleChange}>
                {Object.entries(RELATION_CHOICES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button className="profile-edit-btn" onClick={handleSave}>✅ 저장하기</button>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
