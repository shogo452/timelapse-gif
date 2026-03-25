import { useTranslation } from "react-i18next";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Film, Download, Layers, HardDrive, Timer } from "lucide-react";
import { saveAs } from "file-saver";
import type { ImageFile, OverlayFormat } from "@/types";
import { useGifGeneration } from "@/hooks/useGifGeneration";
import { FramePreview } from "./FramePreview";
import { ProgressOverlay } from "./ProgressOverlay";

interface GeneratePanelProps {
  images: ImageFile[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function GeneratePanel({ images }: GeneratePanelProps) {
  const { t } = useTranslation();
  const {
    settings,
    updateSettings,
    generateGif,
    gifResult,
    progress,
    isGenerating,
  } = useGifGeneration(images);

  if (images.length === 0) {
    return (
      <div className="bg-[#F6F7F8] rounded-b-xl p-6">
        <p className="text-sm text-[#6B7280] py-4">
          {t("generate.noImages")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F7F8] rounded-b-xl p-6">
      <div className="flex gap-8">
        {/* Settings Column */}
        <div className="flex-1 space-y-5">
          <h3 className="text-base font-bold font-[Bricolage_Grotesque] text-[#1A1A1A]">
            {t("generate.settings", { defaultValue: "Settings" })}
          </h3>

          {/* Width */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#6B7280]">
                {t("generate.width")}
              </label>
              <span className="text-[13px] font-semibold text-[#1A1A1A]">
                {settings.width}px
              </span>
            </div>
            <Slider
              value={[settings.width]}
              min={320}
              max={1920}
              step={10}
              onValueChange={([v]) => updateSettings({ width: v })}
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#6B7280]">
                {t("generate.duration")}
              </label>
              <span className="text-[13px] font-semibold text-[#1A1A1A]">
                {settings.duration}ms
              </span>
            </div>
            <Slider
              value={[settings.duration]}
              min={100}
              max={2000}
              step={50}
              onValueChange={([v]) => updateSettings({ duration: v })}
            />
          </div>

          {/* Date Overlay */}
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-[#6B7280]">
              {t("generate.dateOverlay")}
            </label>
            <Switch
              checked={settings.dateOverlay}
              onCheckedChange={(v) => updateSettings({ dateOverlay: v })}
            />
          </div>

          {/* Overlay Format */}
          {settings.dateOverlay && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#6B7280]">
                {t("generate.overlayFormat")}
              </label>
              <div className="flex gap-2">
                {(["date", "time", "hour"] as OverlayFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => updateSettings({ overlayFormat: fmt })}
                    className={`flex-1 h-8 text-xs font-semibold rounded-lg border transition-colors ${
                      settings.overlayFormat === fmt
                        ? "bg-[#22C55E] text-white border-[#22C55E]"
                        : "bg-white text-[#6B7280] border-[#D1D5DB] hover:border-[#9CA3AF]"
                    }`}
                  >
                    {t(`generate.format.${fmt}`)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Font Size */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#6B7280]">
                {t("generate.fontSize")}
              </label>
              <span className="text-[13px] font-semibold text-[#1A1A1A]">
                {settings.fontSize}
              </span>
            </div>
            <Slider
              value={[settings.fontSize]}
              min={12}
              max={48}
              step={1}
              onValueChange={([v]) => updateSettings({ fontSize: v })}
            />
          </div>

          {/* Date Range */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[13px] font-medium text-[#6B7280]">
                {t("generate.startDate")}
              </label>
              <Input
                type="date"
                value={settings.startDate ?? ""}
                onChange={(e) =>
                  updateSettings({ startDate: e.target.value || null })
                }
                className="h-9 text-[13px] bg-white border-[#D1D5DB] rounded-lg"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[13px] font-medium text-[#6B7280]">
                {t("generate.endDate")}
              </label>
              <Input
                type="date"
                value={settings.endDate ?? ""}
                onChange={(e) =>
                  updateSettings({ endDate: e.target.value || null })
                }
                className="h-9 text-[13px] bg-white border-[#D1D5DB] rounded-lg"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateGif}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 w-full h-11 bg-[#22C55E] text-white text-[15px] font-semibold rounded-xl hover:bg-[#16A34A] transition-colors disabled:opacity-50"
          >
            <Film className="h-[18px] w-[18px]" />
            {isGenerating ? t("generate.generating") : t("generate.generate")}
          </button>
        </div>

        {/* Preview Column */}
        <div className="flex-1 space-y-4">
          <h3 className="text-base font-bold font-[Bricolage_Grotesque] text-[#1A1A1A]">
            {t("generate.preview")}
          </h3>

          {/* Frame Preview / GIF Animation */}
          {gifResult ? (
            <img
              src={gifResult.url}
              alt="Generated timelapse GIF"
              className="w-full rounded-xl bg-[#E5E7EB]"
            />
          ) : (
            <FramePreview images={images} settings={settings} />
          )}

          {/* GIF Result */}
          {gifResult && (
            <>
              {/* Info Badges */}
              <div className="flex items-center justify-center gap-3">
                <span className="flex items-center gap-1 text-xs font-semibold text-[#22C55E] bg-[#F0FDF4] px-2.5 py-1 rounded-[10px]">
                  <Layers className="h-3 w-3" />
                  {t("generate.frames", { count: gifResult.frameCount })}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#6366F1] bg-[#F0F5FF] px-2.5 py-1 rounded-[10px]">
                  <HardDrive className="h-3 w-3" />
                  {formatFileSize(gifResult.fileSize)}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-[#D97706] bg-[#FFFBEB] px-2.5 py-1 rounded-[10px]">
                  <Timer className="h-3 w-3" />
                  {settings.duration}ms/frame
                </span>
              </div>

              {/* Download Button */}
              <button
                onClick={() => saveAs(gifResult.blob, "timelapse.gif")}
                className="flex items-center justify-center gap-1.5 w-full h-10 bg-white text-[#1A1A1A] text-sm font-semibold rounded-[10px] border border-[#D1D5DB] hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                {t("generate.download")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Modal */}
      <ProgressOverlay progress={progress} isVisible={isGenerating} />
    </div>
  );
}
