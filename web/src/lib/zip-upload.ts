import JSZip from "jszip";
import { IMAGE_EXTENSIONS } from "./constants";

/**
 * Extract image files from a ZIP archive.
 * Subfolder images are flattened (path separators removed, filename only).
 */
export async function extractImagesFromZip(zipFile: File): Promise<File[]> {
  const zip = await JSZip.loadAsync(await zipFile.arrayBuffer());
  const files: File[] = [];

  const entries = Object.entries(zip.files).filter(([, entry]) => {
    if (entry.dir) return false;
    const name = entry.name.split("/").pop() ?? "";
    const ext = name.substring(name.lastIndexOf(".")).toLowerCase();
    return IMAGE_EXTENSIONS.has(ext);
  });

  for (const [, entry] of entries) {
    const blob = await entry.async("blob");
    const name = entry.name.split("/").pop() ?? entry.name;
    files.push(new File([blob], name, { type: blob.type || "image/jpeg" }));
  }

  return files;
}
