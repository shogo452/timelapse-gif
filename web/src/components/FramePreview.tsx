import { useEffect, useRef } from "react";
import type { ImageFile, GifSettings } from "@/types";
import { loadImage, drawImageToCanvas } from "@/lib/image-utils";
import { drawDateOverlay } from "@/lib/overlay";
import { formatOverlayText } from "@/lib/date-utils";

interface FramePreviewProps {
  images: ImageFile[];
  settings: GifSettings;
}

export function FramePreview({ images, settings }: FramePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setTimeout(async () => {
      const target = canvasRef.current;
      if (!target) return;

      const img = images[0];
      try {
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

        target.width = canvas.width;
        target.height = canvas.height;
        const targetCtx = target.getContext("2d")!;
        targetCtx.drawImage(canvas, 0, 0);
      } catch {
        // Image may have been revoked
      }
    }, 200); // debounce 200ms

    return () => clearTimeout(timer);
  }, [images, settings]);

  if (images.length === 0) return null;

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-xl bg-[#E5E7EB]"
    />
  );
}
