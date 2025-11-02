"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  isMobile: boolean;
  onClick: () => void;
}

export default function ShareButton({ isMobile, onClick }: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed right-7 z-[1000] 
                 w-14 h-14 rounded-full 
                 bg-gradient-to-br from-brand-primary to-brand-secondary
                 shadow-lg hover:shadow-xl
                 flex items-center justify-center
                 transition-all duration-300 ease-in-out
                 hover:scale-105 active:scale-95
                 group
                 ${isMobile ? "bottom-16" : "bottom-3"}`}
      aria-label="작성한 자소서 공유하기"
    >
      <Share2 className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
    </button>
  );
}
