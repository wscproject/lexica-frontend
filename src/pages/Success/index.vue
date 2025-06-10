<script setup>
import { CdxLabel } from "@wikimedia/codex";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import { Login } from "@/api/Auth";
import { useI18n } from "vue-i18n";
import { usePreferredReducedMotion } from "@vueuse/core";
import Loading from "@/components/ui/loading.vue";

const { t } = useI18n({ useScope: "global" });
const route = useRoute();
const router = useRouter();
const isReducedMotion = usePreferredReducedMotion();

const responseAPI = ref(true);

const { cookies } = useCookies();

const loadTheme = (href, name) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.crossOrigin = "anonymous";
  link.href = href;
  link.dataset.theme = name; // tag it so we can find it later
  document.head.appendChild(link);
};

onMounted(async () => {
  const lang =
    window?.navigator?.language?.split("-")?.[0] === "en" ||
      window?.navigator?.language?.split("-")?.[0] === "id"
      ? window?.navigator?.language?.split("-")?.[0]
      : "en";

  const response = await Login({
    code: route.query.code,
    displayLanguageCode: lang,
  });

  if (response.statusCode === 200) {
    responseAPI.value = false;
    cookies.set("auth", response?.data?.token);
    if (isReducedMotion.value === "reduce") {
      localStorage.setItem("reduceMotion", "true");
      loadTheme("/reduce-motion.css");
    } else {
      localStorage.setItem("reduceMotion", response?.data?.isReducedMotion);

      if (response?.data?.isReducedMotion) {
        document.documentElement.classList.add("reduced-motion");
      }
    }

    router.push("/");
  }
});
</script>

<template>
  <div class="min-h-screen flex justify-center items-center w-full p-[16px] dark:bg-[#101418] w-full">
    <div class="w-full text-center max-w-[896px] flex justify-center items-center flex-col">
      <Loading :isNotUsingIndicator="responseAPI" :text="t('home.loading')" variant="big" />
    </div>
  </div>
</template>
