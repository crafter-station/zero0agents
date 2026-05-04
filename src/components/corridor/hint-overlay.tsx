"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export function HintOverlay() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-40",
        "bg-black/70 text-white px-6 py-3 rounded-full",
        "text-sm font-medium",
        "transition-opacity duration-500 motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <p>Scroll to explore · Click on a photo to view</p>
    </div>
  );
}
