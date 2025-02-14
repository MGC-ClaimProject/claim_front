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
  const DAMPING_FACTOR = 0.5; // ✅ 손가락 이동 거리를 더 작게 반영

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight; // 콘텐츠 전체 높이
      const viewportHeight = window.innerHeight; // 현재 화면 높이
      const usableHeight = viewportHeight - 14 * (window.innerHeight / 100); // ✅ 14vh 고려
      setMaxOffset(contentHeight - usableHeight);
    }
  }, [contentRef.current?.scrollHeight]);

  // ✅ 페이지 변경 시 스크롤 초기화
  useEffect(() => {
    setOffset(0);
    if (contentRef.current) {
      contentRef.current.style.transform = "translateY(0px)";
    }
  }, [contentRef.current]);

  // ✅ 스와이프 감지 (위아래 + 좌우)
  const bind = useDrag(
    ({ movement: [mx, my], last, axis }) => { // `vy` 제거
      if (axis === "x" && Math.abs(mx) > Math.abs(my)) {
        if (mx < -SWIPE_THRESHOLD) onToggleMyPage(true);
        if (mx > SWIPE_THRESHOLD) onToggleMyPage(false);
      }

      if (axis === "y" && Math.abs(my) > Math.abs(mx)) {
        setOffset((prev) => {
          let newOffset = prev + my * DAMPING_FACTOR;
          newOffset = Math.max(-maxOffset, Math.min(0, newOffset));
          return newOffset;
        });

        if (last && contentRef.current) {
          requestAnimationFrame(() => {
            if (contentRef.current) {
              contentRef.current.style.transition = "transform 0.5s ease-out";
              contentRef.current.style.transform = `translateY(${offset}px)`;
            }
          });
        }
      }
    },
    { axis: "lock" }
  );


  return { bind, offset, setOffset };
};
