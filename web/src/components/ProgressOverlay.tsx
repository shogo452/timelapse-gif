import { useTranslation } from "react-i18next";
import { Progress } from "@/components/ui/progress";

interface ProgressOverlayProps {
  progress: number;
  isVisible: boolean;
}

export function ProgressOverlay({ progress, isVisible }: ProgressOverlayProps) {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border rounded-lg p-6 w-80 space-y-4">
        <p className="text-sm font-medium text-center">
          {progress < 50
            ? t("progress.processing")
            : t("progress.encoding")}
        </p>
        <Progress value={progress} />
        <p className="text-xs text-center text-muted-foreground">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}
