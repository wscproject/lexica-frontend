import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import displayLang from "@/locale/displayLang.json";

const { cookies } = useCookies();

const supportedLangs = displayLang.lang.map((language) => language.value);

// Dynamically import localisation messages.
const importLang = async (lang) => {
  const locale = await import(`@/locale/${lang}.json`);

  return locale.default ?? locale;
};

// Import localisation messages for every language in displayLang.json.
const messages = Object.fromEntries(
  await Promise.all(
    displayLang.lang.map(async ({ value }) => [
      value,
      await importLang(value),
    ])
  )
);

const getBrowserLanguage = () => {
  const browserLang = window.navigator.language.toLowerCase();

  // Use the complete browser locale when it already matches a supported locale.
  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }

  // Determine the most likely Chinese script.
  if (browserLang === "zh" || browserLang.startsWith("zh-")) {
    try {
      const locale = new Intl.Locale(browserLang).maximize();

      return locale.script === "Hant" ? "zh-hant" : "zh-hans";
    } catch {
      return "zh-hans";
    }
  }

  // Match region-specific locales, such as de-DE or pt-BR,
  // to their supported base language.
  const baseLang = browserLang.split("-")[0];

  return supportedLangs.includes(baseLang) ? baseLang : "en";
};

const cookieLocale = cookies?.get("locale");

const initialLocale = supportedLangs.includes(cookieLocale)
  ? cookieLocale
  : getBrowserLanguage();

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: initialLocale,
  fallbackLocale: "en",
  messages,
});
