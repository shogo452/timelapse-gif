import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ja from "./ja.json";

const LOCALE_KEY = "timelapse-gif:locale";

const savedLocale = (() => {
  try {
    return localStorage.getItem(LOCALE_KEY);
  } catch {
    return null;
  }
})();

const defaultLng =
  savedLocale || (navigator.language.startsWith("ja") ? "ja" : "en");

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, ja: { translation: ja } },
  lng: defaultLng,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  try {
    localStorage.setItem(LOCALE_KEY, lng);
  } catch {
    // ignore
  }
  document.documentElement.lang = lng;
  document.title = i18n.t("app.pageTitle");
});

export default i18n;
