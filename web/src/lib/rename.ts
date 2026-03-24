import type { ImageFile, RenamePlanEntry } from "@/types";

/**
 * Port of rename.py:39-76 build_rename_plan()
 */
export function buildRenamePlan(
  images: ImageFile[],
  prefix: string | null
): RenamePlanEntry[] {
  const sorted = [...images].sort(
    (a, b) =>
      a.dateString.localeCompare(b.dateString) ||
      a.originalName.localeCompare(b.originalName)
  );

  const dateCounts: Record<string, number> = {};
  const plan: RenamePlanEntry[] = [];

  for (const img of sorted) {
    const dateStr = img.dateString;
    const count = dateCounts[dateStr] ?? 0;
    dateCounts[dateStr] = count + 1;

    const base = prefix ? `${prefix}_${dateStr}` : dateStr;
    const ext =
      img.originalName.match(/\.[^.]+$/)?.[0]?.toLowerCase() ?? ".jpg";

    const newName = count > 0 ? `${base}_${count}${ext}` : `${base}${ext}`;

    plan.push({ original: img, newName });
  }

  return plan;
}
