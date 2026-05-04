"use client";

import { Suspense, useMemo, useRef } from "react";

import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";

import type { Photo } from "@/hooks/use-photos";

import { Polaroid } from "./polaroid";

interface CorridorSceneProps {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
  cameraZ: number;
}

interface PhotoPosition {
  photo: Photo;
  position: [number, number, number];
  rotation: [number, number, number];
  wall: "left" | "right" | "top" | "bottom";
}

const CORRIDOR_WIDTH = 8;
const CORRIDOR_HEIGHT = 6;
const PHOTOS_PER_ROW = 3;
const DEPTH_SPACING = 3;
const RANDOM_OFFSET = 0.15;
const RANDOM_ROTATION = 0.08;

function generatePositions(photos: Photo[]): PhotoPosition[] {
  const positions: PhotoPosition[] = [];
  const walls: Array<"left" | "right" | "top" | "bottom"> = ["left", "right", "top", "bottom"];

  photos.forEach((photo, index) => {
    const wallIndex = index % 4;
    const wall = walls[wallIndex];
    const depthIndex = Math.floor(index / 4);
    const z = -depthIndex * DEPTH_SPACING - 5;

    const rowPosition = (index % PHOTOS_PER_ROW) - (PHOTOS_PER_ROW - 1) / 2;
    const xOffset = (Math.random() - 0.5) * RANDOM_OFFSET;
    const yOffset = (Math.random() - 0.5) * RANDOM_OFFSET;
    const zRotation = (Math.random() - 0.5) * RANDOM_ROTATION;

    let position: [number, number, number];
    let rotation: [number, number, number];

    switch (wall) {
      case "left":
        position = [
          -CORRIDOR_WIDTH / 2 + 0.1,
          rowPosition * 1.8 + yOffset,
          z + xOffset,
        ];
        rotation = [0, Math.PI / 2, zRotation];
        break;
      case "right":
        position = [
          CORRIDOR_WIDTH / 2 - 0.1,
          rowPosition * 1.8 + yOffset,
          z + xOffset,
        ];
        rotation = [0, -Math.PI / 2, zRotation];
        break;
      case "top":
        position = [
          rowPosition * 1.8 + xOffset,
          CORRIDOR_HEIGHT / 2 - 0.1,
          z + yOffset,
        ];
        rotation = [Math.PI / 2, 0, zRotation];
        break;
      case "bottom":
        position = [
          rowPosition * 1.8 + xOffset,
          -CORRIDOR_HEIGHT / 2 + 0.1,
          z + yOffset,
        ];
        rotation = [-Math.PI / 2, 0, zRotation];
        break;
    }

    positions.push({ photo, position, rotation, wall });
  });

  return positions;
}

export function CorridorScene({ photos, onPhotoClick, cameraZ }: CorridorSceneProps) {
  const groupRef = useRef<Group>(null);
  const { camera } = useThree();

  const photoPositions = useMemo(() => generatePositions(photos), [photos]);

  useFrame(() => {
    camera.position.z = cameraZ;
  });

  return (
    <group ref={groupRef}>
      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.3} />

      {/* Point light that follows camera for proximity lighting */}
      <pointLight
        position={[0, 0, cameraZ + 2]}
        intensity={50}
        distance={15}
        decay={2}
        color="#ffffff"
      />

      {/* Corridor walls (black void) */}
      <mesh position={[-CORRIDOR_WIDTH / 2, 0, -50]}>
        <planeGeometry args={[0.1, CORRIDOR_HEIGHT, 100]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[CORRIDOR_WIDTH / 2, 0, -50]}>
        <planeGeometry args={[0.1, CORRIDOR_HEIGHT, 100]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, CORRIDOR_HEIGHT / 2, -50]}>
        <planeGeometry args={[CORRIDOR_WIDTH, 0.1, 100]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, -CORRIDOR_HEIGHT / 2, -50]}>
        <planeGeometry args={[CORRIDOR_WIDTH, 0.1, 100]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Polaroids */}
      <Suspense fallback={null}>
        {photoPositions.map(({ photo, position, rotation }) => (
          <Polaroid
            key={photo.id}
            photo={photo}
            position={position}
            rotation={rotation}
            onClick={() => onPhotoClick(photo)}
          />
        ))}
      </Suspense>
    </group>
  );
}
