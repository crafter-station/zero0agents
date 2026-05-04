"use client";

import { useEffect, useRef } from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

import type { Photo } from "@/hooks/use-photos";

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export function PhotoModal({ photo, onClose }: PhotoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (photo) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      ref={modalRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/60 backdrop-blur-md",
        "animate-in fade-in duration-300"
      )}
      onClick={onClose}
    >
      {/* Polaroid frame */}
      <div
        className={cn(
          "relative bg-white p-3 pb-12 shadow-2xl",
          "animate-in zoom-in-95 duration-300",
          "max-w-[90vw] max-h-[90vh]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className={cn(
            "absolute -top-3 -right-3 z-10",
            "w-8 h-8 rounded-full bg-white shadow-lg",
            "flex items-center justify-center",
            "text-gray-600 hover:text-gray-900",
            "transition-colors duration-200"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>Close</title>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Photo */}
        <div className="relative w-[70vmin] h-[70vmin] max-w-[600px] max-h-[600px]">
          <Image
            src={photo.url}
            alt={photo.filename}
            fill
            className="object-cover"
            sizes="(max-width: 600px) 70vmin, 600px"
            priority
          />
        </div>
      </div>
    </div>
  );
}
