import { useTranslation } from "react-i18next";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import type { GifResult, GifSettings } from "@/types";

interface GifPreviewProps {
  result: GifResult;
  settings: GifSettings;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GifPreview({ result, settings }: GifPreviewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <img
        src={result.url}
        alt="Generated timelapse GIF"
        className="max-w-full border rounded-md"
      />
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{t("generate.frames", { count: result.frameCount })}</span>
        <span>
          {t("generate.fileSize", { size: formatFileSize(result.fileSize) })}
        </span>
        <span>{t("generate.perFrame", { ms: settings.duration })}</span>
      </div>
      <Button
        onClick={() => saveAs(result.blob, "timelapse.gif")}
      >
        {t("generate.download")}
      </Button>
    </div>
  );
}
