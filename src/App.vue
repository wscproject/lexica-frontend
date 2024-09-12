<script setup>
import { useMediaQuery } from "@vueuse/core";
import { useGeneralStore } from "@/store/general";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const store = useGeneralStore();
const route = useRoute();

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
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <router-view></router-view>
  </component>
</template>
