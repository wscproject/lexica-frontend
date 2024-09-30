import { isDark } from "@/helper/isDark";

const state = {
  data: null,
  isThemeDark: isDark(),
  loading: false,
};

const getters = {
  name: (state) => {
    return state?.data?.name;
  },
  language: (state) => state?.data?.language,
  displayLang: (state) => state?.data?.displayLanguage,
  displayTheme: (state) => state?.data?.displayTheme,
  allData: (state) => state?.data,
  isDark: (state) => state?.isThemeDark,
  isLoading: (state) => state?.loading,
};

const actions = {
  addData({ commit }, data) {
    commit("setData", data);
  },
  setLoadingState({ commit }) {
    commit("setLoading");
  },
  setFalse({ commit }) {
    commit("setToFalse");
  },
  changeTheme({ commit }) {
    commit("setTheme");
  },
};

const mutations = {
  setData(state, data) {
    state.data = data;
  },
  setLoading(state) {
    state.loading = !state.loading;
  },
  setToFalse(state) {
    state.loading = false;
  },
  setTheme(state) {
    state.isThemeDark = isDark();
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
