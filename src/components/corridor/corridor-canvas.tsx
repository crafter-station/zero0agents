"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Canvas } from "@react-three/fiber";

import type { Photo } from "@/hooks/use-photos";

import { CorridorScene } from "./corridor-scene";
import { HintOverlay } from "./hint-overlay";
import { PhotoModal } from "./photo-modal";

interface CorridorCanvasProps {
  photos: Photo[];
}

const SCROLL_SPEED = 0.5;
const DRAG_SPEED = 0.003;
const ZOOM_SPEED = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

export function CorridorCanvas({ photos }: CorridorCanvasProps) {
  const [cameraZ, setCameraZ] = useState(5);
  const [cameraRotation, setCameraRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const maxDepth = Math.max(10, photos.length * 0.75);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (selectedPhoto) return;

      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoom((prev) =>
          Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev - e.deltaY * 0.01))
        );
      } else {
        setCameraZ((prev) =>
          Math.max(-maxDepth, Math.min(5, prev - e.deltaY * SCROLL_SPEED * 0.01))
        );
      }
    },
    [selectedPhoto, maxDepth]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (selectedPhoto) return;
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [selectedPhoto]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || selectedPhoto) return;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      setCameraRotation((prev) => ({
        x: Math.max(-0.5, Math.min(0.5, prev.x + deltaY * DRAG_SPEED)),
        y: prev.y + deltaX * DRAG_SPEED,
      }));

      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging, selectedPhoto]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (selectedPhoto || e.touches.length !== 1) return;
      const touch = e.touches[0];
      setIsDragging(true);
      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    },
    [selectedPhoto]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || selectedPhoto || e.touches.length !== 1) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMousePos.current.x;
      const deltaY = touch.clientY - lastMousePos.current.y;

      setCameraRotation((prev) => ({
        x: Math.max(-0.5, Math.min(0.5, prev.x + deltaY * DRAG_SPEED)),
        y: prev.y + deltaX * DRAG_SPEED,
      }));

      lastMousePos.current = { x: touch.clientX, y: touch.clientY };
    },
    [isDragging, selectedPhoto]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  ]);

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, cameraZ],
          fov: 75,
          near: 0.1,
          far: 1000,
          zoom,
        }}
        style={{ background: "#000000" }}
        className="w-full h-full"
      >
        <CorridorScene
          photos={photos}
          onPhotoClick={setSelectedPhoto}
          cameraZ={cameraZ}
        />
        <group rotation={[cameraRotation.x, cameraRotation.y, 0]} />
      </Canvas>

      <HintOverlay />
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </>
  );
}
