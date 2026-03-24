import { Link, Outlet } from "react-router-dom";
import { Images } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Footer } from "@/components/Footer";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto max-w-5xl px-10 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <Images className="h-7 w-7 text-[#22C55E]" />
            <h1 className="text-[22px] font-bold font-[Bricolage_Grotesque] text-[#1A1A1A]">
              timelapse-gif
            </h1>
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
