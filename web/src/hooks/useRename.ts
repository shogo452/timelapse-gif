import { useMemo, useState, useCallback } from "react";
import type { ImageFile } from "@/types";
import { buildRenamePlan } from "@/lib/rename";
import { downloadRenamedZip } from "@/lib/zip-download";

export function useRename(images: ImageFile[]) {
  const [prefix, setPrefix] = useState("");
  const [isZipping, setIsZipping] = useState(false);

  const renamePlan = useMemo(
    () => buildRenamePlan(images, prefix || null),
    [images, prefix]
  );

  const downloadZip = useCallback(async () => {
    if (renamePlan.length === 0) return;
    setIsZipping(true);
    try {
      await downloadRenamedZip(renamePlan);
    } finally {
      setIsZipping(false);
    }
  }, [renamePlan]);

  return { renamePlan, prefix, setPrefix, downloadZip, isZipping };
}
