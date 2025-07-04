<script setup>
import {
  useMediaQuery,
  usePreferredReducedMotion,
  useTextDirection,
} from "@vueuse/core";
import { nextTick, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";
import { computed } from "vue";
import displayLang from "@/locale/displayLang.json";
import { useHtmlHasClass } from "@/helper/hasClass";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const vuex = useStore();
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const { cookies } = useCookies();
const dir = useTextDirection();

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
const isReducedMotion = usePreferredReducedMotion();
const { hasClass } = useHtmlHasClass("reduced-motion");

const loadTheme = (href, name) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.crossOrigin = "anonymous";
  link.href = href;
  link.dataset.theme = name; // tag it so we can find it later
  document.head.appendChild(link);
};

function removeTheme(name) {
  const link = document.querySelector(`link[data-theme="${name}"]`);
  if (link) {
    link.remove();
  }
}

const changeTheme = () => {
  if (
    !localStorage.getItem("theme") ||
    localStorage.getItem("theme") === "auto"
  ) {
    if (isPreferredDark.value) {
      document.documentElement.classList.add("dark");
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#27292D" : "#101418"
        );
    } else {
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light");
      } else if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
      }
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#EAECF0" : "#FFFFFF"
        );
    }
  } else {
    if (isThemeDark.value) {
      document.documentElement.classList.add("dark");
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute(
          "content",
          route.path.includes("/session") ? "#27292D" : "#101418"
        );
    } else {
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light");
      } else if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("dark");
      }
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

watch([() => route.path, isThemeDark, isPreferredDark], () => {
  changeTheme();
});

const updatePreference = (event) => {
  if (event.matches) {
    document.documentElement.classList.remove("reduced-motion");

    if (localStorage.getItem("reduceMotion") === "true") {
      loadTheme("/reduce-motion.css");
    } else {
      removeTheme("reduced-motion");
    }
  } else {
    removeTheme("reduced-motion");

    if (localStorage.getItem("reduceMotion") === "true") {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }
};

let mediaQueryList;

const addUnderline = async () => {
  const links = document.querySelectorAll("a");

  if (localStorage.getItem("underline") === "true") {

    links.forEach((link) => {
      link.style.textDecoration = "underline";
    });
  } else {
    links.forEach((link) => {
      link.style.textDecoration = "none";
    });
  }
}

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    addUnderline();
  }
);


onMounted(async () => {
  await nextTick();
  addUnderline();

  mediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener("change", updatePreference);
  } else {
    // For older browsers
    mediaQueryList.addListener(updatePreference);
  }

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

  if (isReducedMotion.value === "reduce") {
    if (localStorage?.getItem("reduceMotion") === "true") {
      loadTheme("/reduce-motion.css");
    }
  } else {
    if (localStorage?.getItem("reduceMotion") === "true") {
      document.documentElement.classList.add("reduced-motion");
    }
  }

  if (localStorage?.getItem("altFont") === "true") {
    if (localStorage?.getItem("bold") === "true") {
      document.documentElement.style.setProperty(
        "--font-family",
        "AtkinsonBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Atkinson, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  } else {
    if (localStorage?.getItem("bold") === "true") {
      document.documentElement.style.setProperty(
        "--font-family",
        "InterBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Inter, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
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
