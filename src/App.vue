<script setup>
import { useMediaQuery } from "@vueuse/core";
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const vuex = useStore();
const route = useRoute();
const { locale } = useI18n();
const { cookies } = useCookies();

watch(
  () => route.path,
  () => {
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
    }
    vuex.dispatch("profile/changeTheme");
  }
);

onMounted(() => {
  const lang =
    window?.navigator?.language?.split("-")?.[0] === "en" ||
    window?.navigator?.language?.split("-")?.[0] === "id"
      ? window?.navigator?.language?.split("-")?.[0]
      : "en";

  locale.value = cookies?.get("locale") || lang;

  console.log(localStorage.getItem("altFont"));
  console.log();

  if (localStorage?.getItem("altFont") === "true") {
    if (localStorage?.getItem("bold") === "true") {
      document.documentElement.style.setProperty(
        "--font-family",
        "AtkinsonBold, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Atkinson, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  } else {
    if (localStorage?.getItem("bold") === "true") {
      document.documentElement.style.setProperty(
        "--font-family",
        "InterBold, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Inter, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
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
