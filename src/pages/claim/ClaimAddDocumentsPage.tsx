import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../api/axiosInstance";
import Tiff from "tiff.js"; // ✅ Tiff.js 불러오기
import "../../styles/pages/claim/claimAddDocumentsPage.css";

const ClaimAddDocumentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { claimId } = location.state || {};

  const [existingDocuments, setExistingDocuments] = useState<{ id: number; url: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!claimId) return;
    fetchExistingDocuments();
  }, [claimId]);

  useEffect(() => {
    const renderAllTIFFs = async () => {
      await Promise.all(
        existingDocuments.map(async ({ id, url }) => {
          if (/\.tiff$|\.tif$/i.test(url)) {
            setTimeout(() => renderTIFF(url, `tiff-preview-${id}`), 500);
          }
        })
      );
    };
    renderAllTIFFs();
  }, [existingDocuments]);

  if (!claimId) {
    alert("❌ 청구 정보가 없습니다. 다시 진행해주세요.");
    navigate("/main/claim");
    return null;
  }

  const fetchExistingDocuments = async () => {
    setIsUploading(true);
    try {
      const response = await auth.get(`/claims/${claimId}/documents/`);
      if (response.status === 200) {
        setExistingDocuments(
          response.data.documents.map((doc: { id: number; document_url: string }) => ({
            id: doc.id,
            url: doc.document_url,
          }))
        );
      }
    } catch (error) {
      console.error("❌ 기존 문서 불러오기 실패:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const renderTIFF = async (url: string, canvasId: string) => {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const tiff = new Tiff({ buffer }); // ✅ `new Tiff({ buffer })` 방식 사용

      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const image = tiff.toCanvas();
        canvas.width = image.width;
        canvas.height = image.height;
        ctx?.drawImage(image, 0, 0);
      }
    } catch (error) {
      console.error("❌ TIFF 미리보기 실패:", error);
    }
  };

  // ✅ 파일 선택 시 실행되는 함수 (미리보기 생성)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const filesArray = Array.from(event.target.files);
    setSelectedFiles(filesArray);

    // ✅ 선택한 이미지 미리보기 생성
    const previewUrls = filesArray.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previewUrls);
  };

  // ✅ 선택한 문서를 서버에 업로드
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("📁 업로드할 파일을 선택해주세요.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("claim", claimId);

    selectedFiles.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const response = await auth.post(`/claims/${claimId}/documents/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("✅ 문서가 성공적으로 업로드되었습니다!");
        await fetchExistingDocuments(); // ✅ 업로드 후 기존 문서 새로고침
        setSelectedFiles([]); // ✅ 업로드 후 선택된 파일 초기화
        setPreviewUrls([]); // ✅ 업로드 후 미리보기 초기화
      } else {
        throw new Error("문서 업로드에 실패했습니다.");
      }
    } catch (error: unknown) {
      console.error(error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="document-upload-container">
      <h2>📎 추가 서류 업로드</h2>
      <p>보험 청구를 위해 필요한 서류를 업로드해주세요.</p>

      {/* ✅ 기존 문서 미리보기 */}
      {existingDocuments.length > 0 && (
        <div className="existing-docs-container">
          <h3>📂 기존 서류</h3>
          <div className="preview-container">
            {existingDocuments.map(({ id, url }) => {
              const isTIFF = /\.tiff$|\.tif$/i.test(url);
              const isImage = /\.(jpg|jpeg|png|gif)$/i.test(url);
              const isPDF = /\.pdf$/i.test(url);

              return (
                <div key={id} className="document-item">
                  {isImage ? (
                    <img src={url} alt={`document-${id}`} className="preview-image" />
                  ) : isPDF ? (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      📄 PDF 다운로드
                    </a>
                  ) : isTIFF ? (
                    <canvas id={`tiff-preview-${id}`} style={{ border: "1px solid #ccc" }} />
                  ) : (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      📄 문서 다운로드
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ 파일 선택 버튼 */}
      <label className="file-upload-label">
        <input type="file" accept="image/*, application/pdf" multiple onChange={handleFileChange} />
        📁 파일 선택
      </label>

      {/* ✅ 새로 선택한 이미지 미리보기 */}
      {previewUrls.length > 0 && (
        <div className="new-docs-container">
          <h3>📎 추가할 서류 미리보기</h3>
          <div className="preview-container">
            {previewUrls.map((url, index) => (
              <img key={index} src={url} alt={`preview-${index}`} className="preview-image" />
            ))}
          </div>
        </div>
      )}

      {/* ✅ 업로드 버튼 */}
      <button className="upload-btn" onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "업로드 중..." : "문서 제출"}
      </button>
    </div>
  );
};

export default ClaimAddDocumentsPage;
