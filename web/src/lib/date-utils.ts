import type { OverlayFormat } from "@/types";

/**
 * Port of overlay.py:41-49 date_from_filename()
 * Extract YYYY-MM-DD from filename.
 */
export function dateFromFilename(filename: string): string | null {
  const stem = filename.replace(/\.[^.]+$/, "");
  const match = stem.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

/**
 * Format a date for the overlay based on the chosen format.
 * - "date" → "2024-01-15"
 * - "time" → "2024-01-15 14:30"
 * - "hour" → "14:30"
 */
export function formatOverlayText(
  date: Date,
  dateString: string,
  filename: string,
  format: OverlayFormat
): string {
  const datePart = dateFromFilename(filename) ?? dateString;
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  switch (format) {
    case "date":
      return datePart;
    case "time":
      return `${datePart} ${hh}:${mm}`;
    case "hour":
      return `${hh}:${mm}`;
  }
}
