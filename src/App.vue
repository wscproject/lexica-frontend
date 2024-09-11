<script setup>
import { useMediaQuery } from "@vueuse/core";
import { useGeneralStore } from "@/store/general";
import { watch } from "vue";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const store = useGeneralStore();

watch(isPreferredDark, () => {
  if (!localStorage.getItem("theme") || localStorage.getItem("theme")) {
    if (isPreferredDark.value) {
      document.documentElement.className = "dark";
    } else {
      document.documentElement.className = "";
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
