import { useTranslation } from "react-i18next";
import { Upload, SlidersHorizontal, Download } from "lucide-react";

const steps = [
  { icon: Upload, labelKey: "steps.step1", descKey: "steps.step1Desc" },
  { icon: SlidersHorizontal, labelKey: "steps.step2", descKey: "steps.step2Desc" },
  { icon: Download, labelKey: "steps.step3", descKey: "steps.step3Desc" },
] as const;

export function StepGuide() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0">
      {steps.map((step, i) => (
        <div
          key={i}
          className="flex min-w-[140px] flex-1 flex-col items-center text-center gap-2 rounded-xl bg-[#F6F7F8] px-3 py-4 sm:min-w-0 sm:px-4 sm:py-5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]/10 text-[#22C55E]">
            <step.icon className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-[#1A1A1A] whitespace-nowrap">
            <span className="text-[#22C55E] mr-1">{i + 1}.</span>
            {t(step.labelKey)}
          </p>
          <p className="hidden sm:block text-xs text-[#6B7280] leading-relaxed">
            {t(step.descKey)}
          </p>
        </div>
      ))}
    </div>
  );
}
