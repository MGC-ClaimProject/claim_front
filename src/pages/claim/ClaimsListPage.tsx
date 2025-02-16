import React, { useState, useEffect } from "react";
import { auth } from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom"; // ✅ useParams 추가
import { groupClaimsByMember } from "../../utils/groupClaimsByMember";
import "../../styles/pages/claim/claimsListPage.css";

interface Member {
  id: number;
  name: string;
}

interface Claim {
  id: number;
  member: Member;
  insured_name: string;
  incident_type: string;
  incident_date: string;
  status: string;
}

type SortKey = "id" | "member_name" | "incident_type" | "incident_date" | "status";

const ClaimsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { memberId } = useParams<{ memberId: string }>(); // ✅ URL에서 memberId 가져오기
  const currentYear = new Date().getFullYear().toString();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMember, setActiveMember] = useState<number | "ALL">("ALL"); // ✅ 기본값 ALL -> memberId 있을 경우 자동 설정
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    fetchClaims(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    // ✅ memberId가 있으면 해당 멤버를 기본 선택
    if (memberId) {
      setActiveMember(Number(memberId));
    }
  }, [memberId, claims]);

  const fetchClaims = async (year: string) => {
    setIsLoading(true);
    try {
      const response = await auth.get(`/claims/?year=${year}`);
      if (response.status === 200) {
        setClaims(response.data);
      }
    } catch (error) {
      console.error("❌ 청구 리스트 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedClaims = groupClaimsByMember(claims);

  const filteredClaims =
    activeMember === "ALL"
      ? claims
      : claims.filter((claim) => claim.member.id === activeMember);

  const formatDate = (dateString: string) => {
    const [, month, day] = dateString.split("-");
    return `${month}-${day}`;
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortConfig.key) {
      case "incident_date":
        aValue = parseInt(a.incident_date.replace(/-/g, ""), 10);
        bValue = parseInt(b.incident_date.replace(/-/g, ""), 10);
        break;
      case "member_name":
        aValue = a.member.name;
        bValue = b.member.name;
        break;
      default:
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
    }

    return sortConfig.direction === "asc" ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
  });

  return (
    <div className="claim-page-container">
      <div className="claim-list-container">
        <div className="header-container">
          <h2>📜 모든 청구내역</h2>
          <select
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value={currentYear}>{currentYear}</option>
            <option value="ALL">전체</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = (parseInt(currentYear) - i - 1).toString();
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        {isLoading ? (
          <p>⏳ 불러오는 중...</p>
        ) : (
          <div className="member-section">
            <div className="name-index">
              <span
                className={`name-item ${activeMember === "ALL" ? "active" : ""}`}
                onClick={() => setActiveMember("ALL")}
              >
                ALL
              </span>
              {Object.entries(groupedClaims).map(([memberId, { member_name }]) => (
                <span
                  key={memberId}
                  className={`name-item ${activeMember === Number(memberId) ? "active" : ""}`}
                  onClick={() => setActiveMember(Number(memberId))}
                >
                  {member_name}
                </span>
              ))}
            </div>

            <table className="claim-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("id")}>📌</th>
                  <th onClick={() => handleSort("member_name")}>👤</th>
                  <th onClick={() => handleSort("incident_type")}>🚑</th>
                  <th onClick={() => handleSort("incident_date")}>📅</th>
                  <th onClick={() => handleSort("status")}>📄</th>
                </tr>
              </thead>
              <tbody>
                {sortedClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    onClick={() => navigate(`/main/claims/${claim.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{claim.id}</td>
                    <td>{claim.member.name}</td>
                    <td>{claim.incident_type}</td>
                    <td>{formatDate(claim.incident_date)}</td>
                    <td>{claim.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsListPage;
