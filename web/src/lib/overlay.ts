/**
 * Port of overlay.py:10-38 draw_date_overlay()
 * Draws date text on bottom-left with semi-transparent background.
 */
export function drawDateOverlay(
  ctx: CanvasRenderingContext2D,
  canvasHeight: number,
  text: string,
  fontSize: number = 24
): void {
  const margin = 10;
  const padding = 4;

  ctx.font = `${fontSize}px Roboto, sans-serif`;
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;

  const x = margin;
  const y = canvasHeight - fontSize - margin * 2;

  // Semi-transparent black background (0,0,0,160/255 ≈ 0.63)
  ctx.fillStyle = "rgba(0, 0, 0, 0.63)";
  ctx.fillRect(
    x - padding,
    y - padding,
    textWidth + padding * 2,
    textHeight + padding * 2
  );

  // White text
  ctx.fillStyle = "white";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
}
