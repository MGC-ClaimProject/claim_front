import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupStore } from "../stores/useSignupStore";
import { Member, useAuthStore } from "../stores/useAuthStore";
import ProfileCard from "../components/ProfileCard";
import { auth } from "../api/axiosInstance";
import "../styles/signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useSignupStore();
  const { user } = useAuthStore();

  // ✅ 필수 동의 체크박스 상태
  const [agreements, setAgreements] = useState({
    personalInfo: false,
    sensitiveInfo: false,
    profilingInfo: false,
  });

  useEffect(() => {
    const fetchFirstMember = async () => {
      try {
        const response = await auth.get("/members/");
        const members = response.data;

        if (members.length === 0) {
          console.warn("⚠️ 멤버 데이터가 없습니다.");
          return;
        }

        // ✅ 가장 작은 ID를 가진 멤버 찾기
        const firstMember = members.reduce((prev: Member, curr: Member) =>
          prev.id < curr.id ? prev : curr
        );

        console.log(`✅ 첫 번째 멤버 ID: ${firstMember.id}`);

        // ✅ 가져온 멤버 정보를 formData에 설정하여 수정 가능하게 함
        setFormData({
          name: firstMember.name,
          phone: firstMember.phone,
          birth: firstMember.birth,
          gender: firstMember.gender,
          relation: "Self",
          memberId: firstMember.id,
        });
      } catch (error) {
        console.error("❌ 첫 번째 멤버 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchFirstMember();
  }, []);

  const handleAgreeAndContinue = () => {
    // ✅ 필수 동의 체크박스를 모두 체크
    setAgreements({
      personalInfo: true,
      sensitiveInfo: true,
      profilingInfo: true,
    });

    // ✅ 모든 정보가 입력되었는지 확인
    if (!formData.name || !formData.phone || !formData.birth || !formData.gender) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    // ✅ 회원가입 데이터 구성
    const signupData = {
      ...formData,
      user: user?.id || null,
      relation: "Self",
    };

    // ✅ 회원가입 데이터를 로컬 스토리지에 저장
    localStorage.setItem("signupData", JSON.stringify(signupData));

    // ✅ 선택 동의 화면으로 이동
    navigate("/signup/ad-consent");
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">회원 가입</h1>

      {/* ✅ ProfileCard 사용하여 입력 폼 구현 */}
      <ProfileCard
        member={{
          id: formData.memberId || 1,
          name: formData.name,
          phone: formData.phone,
          birth: formData.birth,
          gender: formData.gender,
          relation: "Self",
        }}
        setFormData={(updatedData: Partial<Member>) =>
          setFormData({ ...formData, ...updatedData })
        }
        hideRelation={true}
      />

      {/* ✅ 필수 동의 체크박스 섹션 */}
      <div className="agreement-box">
        <h3 className="agreement-title">서비스 이용을 위해 동의가 필요해요</h3>

        <label className="agreement-item">
          <input
            type="checkbox"
            checked={agreements.personalInfo}
            onChange={() => setAgreements({ ...agreements, personalInfo: !agreements.personalInfo })}
          />
          <span>[필수] 개인정보 수집·이용 동의</span>
        </label>

        <label className="agreement-item">
          <input
            type="checkbox"
            checked={agreements.sensitiveInfo}
            onChange={() => setAgreements({ ...agreements, sensitiveInfo: !agreements.sensitiveInfo })}
          />
          <span>[필수] 민감정보 수집·이용 동의</span>
        </label>

        <label className="agreement-item">
          <input
            type="checkbox"
            checked={agreements.profilingInfo}
            onChange={() => setAgreements({ ...agreements, profilingInfo: !agreements.profilingInfo })}
          />
          <span>[필수] 고유식별 정보 처리 동의</span>
        </label>
      </div>

      {/* ✅ 회원가입 버튼 */}
      <button className="agree-button" onClick={handleAgreeAndContinue}>
        모두 동의하고 계속하기
      </button>
    </div>
  );
};

export default Signup;
