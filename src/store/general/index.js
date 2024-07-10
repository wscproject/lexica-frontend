import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => ({ data: null }),
  getters: {
    name: (state) => state?.data?.name,
  },
  actions: {
    setData(data) {
      this.data = data;
    },
  },
});
