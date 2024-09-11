import { defineStore } from "pinia";
import { isDark } from "@/helper/isDark";

export const useGeneralStore = defineStore("general", {
  state: () => ({
    data: null,
    isThemeDark: isDark(),
  }),
  getters: {
    name: (state) => state?.data?.name,
    language: (state) => state?.data?.language,
    displayLang: (state) => state?.data?.displayLanguage,
    displayTheme: (state) => state?.data?.displayTheme,
    isDark: (state) => state?.isThemeDark,
  },
  actions: {
    setData(data) {
      this.data = data;
    },
    setTheme() {
      this.isThemeDark = isDark();
    },
  },
});
