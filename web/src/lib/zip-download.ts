import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { RenamePlanEntry } from "@/types";
import { loadImage, drawImageToCanvas } from "./image-utils";

/**
 * Download renamed images as a ZIP file.
 * Rotated images are re-rendered via Canvas before packaging.
 */
export async function downloadRenamedZip(
  plan: RenamePlanEntry[],
  onProgress?: (percent: number) => void
): Promise<void> {
  const zip = new JSZip();

  for (let i = 0; i < plan.length; i++) {
    const { original, newName } = plan[i];

    if (original.rotation === 0) {
      zip.file(newName, original.file);
    } else {
      // Re-render rotated image
      const img = await loadImage(original.objectUrl);
      const { canvas } = drawImageToCanvas(
        img,
        img.naturalWidth,
        original.rotation
      );
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b!),
          original.file.type || "image/jpeg",
          0.92
        );
      });
      zip.file(newName, blob);
    }

    onProgress?.(Math.round(((i + 1) / plan.length) * 100));
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "renamed-images.zip");
}
