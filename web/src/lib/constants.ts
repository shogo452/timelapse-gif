import type { GifSettings } from "@/types";

export const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".tiff",
  ".tif",
  ".webp",
  ".gif",
]);

export const DEFAULT_GIF_SETTINGS: GifSettings = {
  width: 640,
  duration: 500,
  dateOverlay: true,
  overlayFormat: "date",
  fontSize: 24,
  loop: 0,
  startDate: null,
  endDate: null,
};
