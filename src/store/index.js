import { createStore, createLogger } from "vuex";
import profile from "./profile";

export default createStore({
  modules: {
    profile,
  },
  plugins: [createLogger()],
});
