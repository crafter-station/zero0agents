"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import { usePhotos } from "@/hooks/use-photos";

const CorridorCanvas = dynamic(
  () => import("./corridor-canvas").then((mod) => mod.CorridorCanvas),
  { ssr: false }
);

export function Corridor() {
  const { photos, loading, error } = usePhotos();

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center flex-col gap-4">
        <div className="text-white text-lg">No photos found</div>
        <p className="text-gray-400 text-sm">
          Add images to <code className="bg-gray-800 px-2 py-1 rounded">public/photos/</code>
        </p>
      </div>
    );
  }

  return (
    <div className={cn("w-full h-screen overflow-hidden")}>
      <CorridorCanvas photos={photos} />
    </div>
  );
}
