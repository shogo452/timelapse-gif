import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

export function FaqPage() {
  const { t } = useTranslation();

  const items = t("faq.items", { returnObjects: true }) as {
    q: string;
    a: string;
  }[];

  return (
    <main className="mx-auto max-w-3xl px-10 py-10">
      <Helmet>
        <title>FAQ – timelapse-gif</title>
        <meta name="description" content="Frequently asked questions about timelapse-gif: supported formats, privacy, GIF customization, and more." />
        <link rel="canonical" href="https://timelapse-gif.shogo452.com/faq" />
      </Helmet>
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8">{t("faq.title")}</h2>
      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i}>
            <h3 className="font-semibold text-[#1A1A1A] mb-1">{item.q}</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
