import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import displayLang from "@/locale/displayLang.json";
import { pl } from "vuetify/locale";

const { cookies } = useCookies();

//Function for dynamically import localization datas

const importLangs = async (lang) => {
  const locale = await import(`@/locale/${lang}.json`);

  return locale;
};

//Combine both display language array and imported localization datas
const mapLangs = displayLang.lang.map(async (item) => {
  const json = await importLangs(item.value);

  return {
    ...item,
    lang: json,
  };
});

//Transform combined data into an accepted data object
const messages = Promise.all(mapLangs).then(function (results) {
  return results.reduce(
    (obj, item) => ((obj[item.value] = item.lang), obj),
    {}
  );
});

const getBrowserLanguage = () => {
  const browserLang = window?.navigator?.language?.split("-")?.[0];
  const supportedLangs = ["en", "es", "eu", "ga", "id", "ja", "lb", "min", "mk", "ms", "nl", "pa", "pl", "ps", "pt", "tr", "zh-hans", "zh-hant"];
  return supportedLangs.includes(browserLang) ? browserLang : "en";
};

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: cookies?.get("locale") || getBrowserLanguage(),
  fallbackLocale: "en",
  messages: await messages,
});
