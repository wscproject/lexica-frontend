import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({ data: null }),
  getters: {
    name: (state) => state?.data?.name,
    language: (state) => state?.data?.language,
    displayLang: (state) => state?.data?.displayLanguage,
  },
  actions: {
    setData(data) {
      this.data = data;
    },
  },
});
