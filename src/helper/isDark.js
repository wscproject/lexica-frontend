import { computed, watch } from "vue";

export const isDark = () => {
  if (localStorage.getItem("theme") !== "auto") {
    if (localStorage.getItem("theme") === "dark") {
      return true;
    } else if (localStorage.getItem("theme") === "light") {
      return false;
    }
  } else {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
};
