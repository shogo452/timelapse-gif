export interface ImageFile {
  file: File;
  originalName: string;
  date: Date;
  dateString: string; // "YYYY-MM-DD"
  exifSource: "exif" | "file_modified";
  objectUrl: string;
  rotation: 0 | 90 | 180 | 270;
}

export interface RenamePlanEntry {
  original: ImageFile;
  newName: string;
}

export type OverlayFormat = "date" | "time" | "hour";

export interface GifSettings {
  width: number;
  duration: number;
  dateOverlay: boolean;
  overlayFormat: OverlayFormat;
  fontSize: number;
  loop: number;
  startDate: string | null;
  endDate: string | null;
}

export type PersistedGifSettings = Omit<GifSettings, "startDate" | "endDate">;

export interface GifResult {
  url: string;
  blob: Blob;
  frameCount: number;
  fileSize: number;
}
