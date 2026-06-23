import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import displayLang from "@/locale/displayLang.json";

const { cookies } = useCookies();

const supportedLangs = displayLang.lang.map((language) => language.value);

const importLangs = async (lang) => {
  const locale = await import(`@/locale/${lang}.json`);
  return locale.default ?? locale;
};

const mapLangs = displayLang.lang.map(async (item) => {
  const messages = await importLangs(item.value);

  return {
    ...item,
    lang: messages,
  };
});

const messages = Promise.all(mapLangs).then((results) =>
  results.reduce((obj, item) => {
    obj[item.value] = item.lang;
    return obj;
  }, {})
);

const getBrowserLanguage = () => {
  const browserLang = window.navigator.language.toLowerCase();

  if (supportedLangs.includes(browserLang)) {
    return browserLang;
  }

  if (
    browserLang === "zh" ||
    browserLang === "zh-cn" ||
    browserLang === "zh-sg" ||
    browserLang.startsWith("zh-hans")
  ) {
    return "zh-hans";
  }

  if (
    browserLang === "zh-tw" ||
    browserLang === "zh-hk" ||
    browserLang === "zh-mo" ||
    browserLang.startsWith("zh-hant")
  ) {
    return "zh-hant";
  }

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
  messages: await messages,
});
