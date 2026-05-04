import { readdir } from "node:fs/promises";
import { join } from "node:path";

import { NextResponse } from "next/server";

const PHOTOS_DIR = join(process.cwd(), "public", "photos");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

export async function GET() {
  try {
    const files = await readdir(PHOTOS_DIR);

    const photos = files
      .filter((file) => {
        const ext = file.toLowerCase().slice(file.lastIndexOf("."));
        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .map((file, index) => ({
        id: `photo-${index}`,
        filename: file,
        url: `/photos/${file}`,
        thumbnailUrl: `/photos/${file}`,
      }));

    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
