"use client";

import { useEffect, useState } from "react";

export interface Photo {
  id: string;
  filename: string;
  url: string;
  thumbnailUrl: string;
}

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch("/api/photos");
        const data = await response.json();
        setPhotos(data.photos);
      } catch {
        setError("Failed to load photos");
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return { photos, loading, error };
}
