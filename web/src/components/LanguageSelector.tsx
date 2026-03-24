import { useTranslation } from "react-i18next";

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <div className="flex gap-1">
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={`text-[13px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
          i18n.language === "en"
            ? "bg-[#1A1A1A] text-white"
            : "text-[#9CA3AF] hover:text-[#6B7280]"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage("ja")}
        className={`text-[13px] font-semibold px-3.5 py-1.5 rounded-lg transition-colors ${
          i18n.language === "ja"
            ? "bg-[#1A1A1A] text-white"
            : "text-[#9CA3AF] hover:text-[#6B7280]"
        }`}
      >
        JA
      </button>
    </div>
  );
}
