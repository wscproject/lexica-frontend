<script setup>
import { useMediaQuery } from "@vueuse/core";
import { useGeneralStore } from "@/store/general";
import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const store = useGeneralStore();
const route = useRoute();
const { locale } = useI18n();
const { cookies } = useCookies();

watch(isPreferredDark, () => {
  if (
    !localStorage.getItem("theme") ||
    localStorage.getItem("theme") === "auto"
  ) {
    if (isPreferredDark.value) {
      console.log("testing123");

      document.documentElement.className = "dark";
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path === "/session" ? "#27292D" : "#101418"
        );
    } else {
      document.documentElement.className = "";
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path === "/session" ? "#EAECF0" : "#FFFFFF"
        );
    }
  }
  store.setTheme();
});

onMounted(() => {
  const lang =
    window?.navigator?.language?.split("-")?.[0] === "en" ||
    window?.navigator?.language?.split("-")?.[0] === "id"
      ? window?.navigator?.language?.split("-")?.[0]
      : "en";

  locale.value = cookies?.get("locale") || lang;
});
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <router-view></router-view>
  </component>
</template>
