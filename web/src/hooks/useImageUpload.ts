import { useCallback, useState } from "react";
import type { ImageFile } from "@/types";
import { IMAGE_EXTENSIONS } from "@/lib/constants";
import { getImageDate } from "@/lib/exif";
import { extractImagesFromZip } from "@/lib/zip-upload";

function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isImageFile(file: File): boolean {
  const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

async function processFiles(files: File[]): Promise<ImageFile[]> {
  const imageFiles = files.filter(isImageFile);
  const results: ImageFile[] = [];

  for (const file of imageFiles) {
    const { date, source } = await getImageDate(file);
    results.push({
      file,
      originalName: file.name,
      date,
      dateString: formatDateString(date),
      exifSource: source,
      objectUrl: URL.createObjectURL(file),
      rotation: 0,
    });
  }

  // Sort by date then name
  results.sort(
    (a, b) =>
      a.dateString.localeCompare(b.dateString) ||
      a.originalName.localeCompare(b.originalName)
  );

  return results;
}

export function useImageUpload(
  setImages: React.Dispatch<React.SetStateAction<ImageFile[]>>
) {
  const [isLoading, setIsLoading] = useState(false);

  const addFiles = useCallback(
    async (files: File[]) => {
      setIsLoading(true);
      try {
        const processed = await processFiles(files);
        setImages((prev) => {
          const combined = [...prev, ...processed];
          combined.sort(
            (a, b) =>
              a.dateString.localeCompare(b.dateString) ||
              a.originalName.localeCompare(b.originalName)
          );
          return combined;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setImages]
  );

  const addZip = useCallback(
    async (zipFile: File) => {
      setIsLoading(true);
      try {
        const extracted = await extractImagesFromZip(zipFile);
        const processed = await processFiles(extracted);
        setImages((prev) => {
          const combined = [...prev, ...processed];
          combined.sort(
            (a, b) =>
              a.dateString.localeCompare(b.dateString) ||
              a.originalName.localeCompare(b.originalName)
          );
          return combined;
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setImages]
  );

  const removeImage = useCallback(
    (objectUrl: string) => {
      setImages((prev) => {
        const img = prev.find((i) => i.objectUrl === objectUrl);
        if (img) URL.revokeObjectURL(img.objectUrl);
        return prev.filter((i) => i.objectUrl !== objectUrl);
      });
    },
    [setImages]
  );

  const rotateImage = useCallback(
    (objectUrl: string) => {
      setImages((prev) =>
        prev.map((img) =>
          img.objectUrl === objectUrl
            ? { ...img, rotation: ((img.rotation + 90) % 360) as 0 | 90 | 180 | 270 }
            : img
        )
      );
    },
    [setImages]
  );

  const reorderImages = useCallback(
    (newImages: ImageFile[]) => {
      setImages(newImages);
    },
    [setImages]
  );

  return { addFiles, addZip, removeImage, rotateImage, reorderImages, isLoading };
}
