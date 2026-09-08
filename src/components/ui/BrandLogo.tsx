"use client";
import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BrandLogoProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallbackBg?: string;
}

const LOGO_CANDIDATES = [
  "/logo.png",
  "/logo.jpg",
  "/logo.jpeg",
  "/logo.webp",
  "/logo.svg",
];

export default function BrandLogo({
  className = "",
  size = "md",
  fallbackBg = "bg-[#007D07]",
}: BrandLogoProps) {
  const [candidateIndex, setCandidateIndex] = useState(0);

  const sizeClasses = {
    xs: "w-7 h-7 rounded-lg",
    sm: "w-8 h-8 rounded-xl",
    md: "w-10 h-10 rounded-2xl",
    lg: "w-12 h-12 rounded-2xl",
    xl: "w-16 h-16 rounded-3xl",
  };

  const iconSizes = {
    xs: "w-3.5 h-3.5",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const handleImgError = () => {
    setCandidateIndex((prev) => prev + 1);
  };

  if (candidateIndex < LOGO_CANDIDATES.length) {
    return (
      <div
        className={`relative overflow-hidden flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${className}`}
      >
        <img
          src={LOGO_CANDIDATES[candidateIndex]}
          alt="Kind English Course Logo"
          className="w-full h-full object-contain drop-shadow-xs"
          onError={handleImgError}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center text-white flex-shrink-0 ${fallbackBg} ${sizeClasses[size]} ${className}`}
    >
      <BookOpen className={iconSizes[size]} />
    </div>
  );
}
