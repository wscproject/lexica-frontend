import { createI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import displayLang from "@/locale/displayLang.json";

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

export const i18n = createI18n({
  legacy: false,
  locale: cookies?.get("locale") || window.navigator.language.split("-")[0],
  messages: await messages,
});
