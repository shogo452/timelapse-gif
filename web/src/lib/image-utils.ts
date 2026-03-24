/**
 * Port of gif.py:68-73 resize processing.
 * Also handles user-specified rotation (web-only feature).
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function drawImageToCanvas(
  img: HTMLImageElement,
  targetWidth: number,
  rotation: 0 | 90 | 180 | 270
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const ratio = targetWidth / img.naturalWidth;
  const drawWidth = targetWidth;
  const drawHeight = Math.round(img.naturalHeight * ratio);

  const isRotated = rotation === 90 || rotation === 270;
  const canvasWidth = isRotated ? drawHeight : drawWidth;
  const canvasHeight = isRotated ? drawWidth : drawHeight;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d")!;

  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
  ctx.restore();

  return { canvas, ctx };
}
