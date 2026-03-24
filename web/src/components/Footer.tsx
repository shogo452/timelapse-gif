import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#F9FAFB]">
      <div className="mx-auto max-w-md px-6 py-6">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#6B7280]">
          <Link to="/faq" className="hover:text-[#1A1A1A] transition-colors">
            {t("footer.faq")}
          </Link>
          <Link to="/privacy" className="hover:text-[#1A1A1A] transition-colors">
            {t("footer.privacy")}
          </Link>
          <Link to="/terms" className="hover:text-[#1A1A1A] transition-colors">
            {t("footer.terms")}
          </Link>
          <Link to="/contact" className="hover:text-[#1A1A1A] transition-colors">
            {t("footer.contact")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
