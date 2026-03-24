import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export function TermsPage() {
  const { t } = useTranslation();

  const sections = t("terms.sections", { returnObjects: true }) as {
    heading: string;
    body: string;
  }[];

  return (
    <main className="mx-auto max-w-3xl px-10 py-10">
      <Helmet>
        <title>Terms of Service – timelapse-gif</title>
        <meta name="description" content="Terms of service for timelapse-gif, a free browser-based timelapse GIF generator." />
        <link rel="canonical" href="https://timelapse-gif.shogo452.com/terms" />
      </Helmet>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">{t("terms.title")}</h2>
      <div className="space-y-6 text-sm leading-relaxed text-[#6B7280]">
        {sections.map((s, i) => (
          <section key={i}>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">{s.heading}</h3>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
