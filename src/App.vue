<script setup>
import { useMediaQuery, useTextDirection } from "@vueuse/core";
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";
import { computed } from "vue";
import displayLang from "@/locale/displayLang.json";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const vuex = useStore();
const route = useRoute();
const { locale } = useI18n();
const { cookies } = useCookies();
const dir = useTextDirection();

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const changeTheme = () => {
  if (
    !localStorage.getItem("theme") ||
    localStorage.getItem("theme") === "auto"
  ) {
    if (isPreferredDark.value) {
      document.documentElement.className = "dark";
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#27292D" : "#101418"
        );
    } else {
      document.documentElement.className = "";
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#EAECF0" : "#FFFFFF"
        );
    }
  } else {
    if (isThemeDark.value) {
      console.log("dark");

      document.documentElement.className = "dark";
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#27292D" : "#101418"
        );
    } else {
      document.documentElement.className = "";
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#EAECF0" : "#FFFFFF"
        );
    }
  }
  vuex.dispatch("profile/changeTheme");
};

watch([() => route.path, isThemeDark], () => {
  console.log("testing123", route.path);
  changeTheme();
});

onMounted(() => {
  changeTheme();
  const lang =
    window?.navigator?.language?.split("-")?.[0] === "en" ||
    window?.navigator?.language?.split("-")?.[0] === "id" ||
    window?.navigator?.language?.split("-")?.[0] === "ar"
      ? window?.navigator?.language?.split("-")?.[0]
      : "en";

  locale.value = cookies?.get("locale") || lang;
  dir.value = displayLang.lang.find(
    (item) => item.value === (cookies?.get("locale") || lang)
  )?.dir;

  console.log(window?.navigator?.language);

  if (localStorage?.getItem("altFont") === "true") {
    if (localStorage?.getItem("bold") === "true") {
      document.documentElement.style.setProperty(
        "--font-family",
        "AtkinsonBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew,  system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Atkinson, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew,  system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  } else {
    if (localStorage?.getItem("bold") === "true") {
      document.documentElement.style.setProperty(
        "--font-family",
        "InterBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew,  system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Inter, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew,  system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  }
});
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <router-view></router-view>
  </component>
</template>
