"use client";

import { useRef, useState } from "react";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

import type { Photo } from "@/hooks/use-photos";

interface PolaroidProps {
  photo: Photo;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}

const POLAROID_WIDTH = 1.2;
const POLAROID_HEIGHT = 1.5;
const BORDER_SIZE = 0.08;
const BOTTOM_BORDER = 0.25;
const PHOTO_WIDTH = POLAROID_WIDTH - BORDER_SIZE * 2;
const PHOTO_HEIGHT = POLAROID_HEIGHT - BORDER_SIZE - BOTTOM_BORDER;

export function Polaroid({ photo, position, rotation, onClick }: PolaroidProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [targetZ, setTargetZ] = useState(0);

  const texture = useTexture(photo.url);

  useFrame(() => {
    if (!groupRef.current) return;

    const target = hovered ? 0.3 : 0;
    setTargetZ((prev) => prev + (target - prev) * 0.1);
    groupRef.current.position.z = position[2] + targetZ;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Polaroid frame (white background) */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[POLAROID_WIDTH, POLAROID_HEIGHT]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Photo */}
      <mesh position={[0, (BOTTOM_BORDER - BORDER_SIZE) / 2, 0]}>
        <planeGeometry args={[PHOTO_WIDTH, PHOTO_HEIGHT]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Shadow/depth effect */}
      <mesh position={[0.02, -0.02, -0.02]}>
        <planeGeometry args={[POLAROID_WIDTH, POLAROID_HEIGHT]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
