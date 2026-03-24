import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export function PrivacyPage() {
  const { t } = useTranslation();

  const sections = t("privacy.sections", { returnObjects: true }) as {
    heading: string;
    body: string;
  }[];

  return (
    <main className="mx-auto max-w-3xl px-10 py-10">
      <Helmet>
        <title>Privacy Policy – timelapse-gif</title>
        <meta name="description" content="Privacy policy for timelapse-gif. All image processing happens in your browser – no data is sent to any server." />
        <link rel="canonical" href="https://timelapse-gif.shogo452.com/privacy" />
      </Helmet>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">{t("privacy.title")}</h2>
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
