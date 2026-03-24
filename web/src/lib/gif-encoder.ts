import { encode } from "modern-gif";
import type { ImageFile, GifSettings, GifResult } from "@/types";
import { loadImage, drawImageToCanvas } from "./image-utils";
import { drawDateOverlay } from "./overlay";
import { formatOverlayText } from "./date-utils";

/**
 * Port of gif.py:47-93 generate_gif()
 */
export async function generateGif(
  images: ImageFile[],
  settings: GifSettings,
  onProgress: (percent: number) => void
): Promise<GifResult> {
  // Date range filter (gif.py:30-43)
  let filtered = images;
  if (settings.startDate || settings.endDate) {
    filtered = images.filter((img) => {
      const d = img.dateString;
      if (settings.startDate && d < settings.startDate) return false;
      if (settings.endDate && d > settings.endDate) return false;
      return true;
    });
  }

  if (filtered.length === 0) {
    throw new Error("No images to encode");
  }

  // Process frames (gif.py:65-81)
  const frames: { data: ImageData; delay: number }[] = [];
  for (let i = 0; i < filtered.length; i++) {
    const img = filtered[i];
    const htmlImg = await loadImage(img.objectUrl);
    const { canvas, ctx } = drawImageToCanvas(
      htmlImg,
      settings.width,
      img.rotation
    );

    if (settings.dateOverlay) {
      const text = formatOverlayText(
        img.date,
        img.dateString,
        img.originalName,
        settings.overlayFormat
      );
      drawDateOverlay(ctx, canvas.height, text, settings.fontSize);
    }

    frames.push({
      data: ctx.getImageData(0, 0, canvas.width, canvas.height),
      delay: settings.duration,
    });

    // Yield to UI
    await new Promise((r) => setTimeout(r, 0));
    onProgress(((i + 1) / filtered.length) * 50);
  }

  // Encode GIF (gif.py:83-90)
  const output = await encode({
    width: frames[0].data.width,
    height: frames[0].data.height,
    looped: true,
    loopCount: 0,
    frames: frames.map((f) => ({
      data: f.data.data,
      delay: f.delay,
    })),
  });

  onProgress(100);

  const blob = new Blob([output], { type: "image/gif" });
  return {
    url: URL.createObjectURL(blob),
    blob,
    frameCount: frames.length,
    fileSize: blob.size,
  };
}
