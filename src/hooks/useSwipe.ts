// src/hooks/useSwipe.ts
import { useDrag } from "@use-gesture/react";
import { useState, useEffect, RefObject } from "react";

export const useSwipe = (
  contentRef: RefObject<HTMLDivElement>,
  onToggleMyPage: (isOpen: boolean) => void
) => {
  const [offset, setOffset] = useState(0);
  const [maxOffset, setMaxOffset] = useState(0);
  const SWIPE_THRESHOLD = 50; // ✅ 스와이프 감지 최소 거리
  const DAMPING_FACTOR = 0.8; // ✅ 감속 계수 (손가락 속도 그대로 반영)

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight; // 콘텐츠 전체 높이
      const viewportHeight = window.innerHeight; // 현재 화면 높이
      const usableHeight = viewportHeight - 14 * (window.innerHeight / 100); // ✅ 14vh 고려
      setMaxOffset(contentHeight - usableHeight);
    }
  }, [contentRef.current?.scrollHeight]);

  // ✅ 페이지가 변경될 때 스크롤을 최상단으로 초기화
  useEffect(() => {
    setOffset(0);
    if (contentRef.current) {
      contentRef.current.style.transform = "translateY(0px)";
    }
  }, [contentRef.current]); // 🔹 contentRef가 변경될 때만 실행

  // ✅ 스와이프 감지 (위아래 + 좌우)
  const bind = useDrag(
    ({ movement: [mx, my], velocity: [, vy], last, axis }) => {
      if (axis === "x" && Math.abs(mx) > Math.abs(my)) {
        // ✅ 좌우 스와이프 → 마이페이지 모달 토글
        if (mx < -SWIPE_THRESHOLD) onToggleMyPage(true); // 👉 왼쪽 스와이프 → 모달 열기
        if (mx > SWIPE_THRESHOLD) onToggleMyPage(false); // 👉 오른쪽 스와이프 → 모달 닫기
      }

      if (axis === "y" && Math.abs(my) > Math.abs(mx)) {
        // ✅ 위아래 스와이프 → 콘텐츠 이동 (손가락 속도 그대로 반영)
        setOffset((prev) => {
          let newOffset = prev + my * DAMPING_FACTOR;
          newOffset = Math.max(-maxOffset, Math.min(0, newOffset)); // ✅ 이동 제한
          return newOffset;
        });

        if (last && contentRef.current) {
          requestAnimationFrame(() => {
            if (contentRef.current) {
              let finalOffset = offset + vy * 30; // ✅ 속도에 따라 감속 적용
              finalOffset = Math.max(-maxOffset, Math.min(0, finalOffset)); // ✅ 범위 제한
              setOffset(finalOffset);
              contentRef.current.style.transform = `translateY(${finalOffset}px)`;
            }
          });
        }
      }
    },
    { axis: "lock" } // ✅ 위아래/좌우 각각 동작
  );

  return { bind, offset, setOffset };
};
