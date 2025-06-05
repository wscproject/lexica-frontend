<script setup>
import { CdxLabel } from "@wikimedia/codex";
import { onMounted } from "vue";
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

const { cookies } = useCookies();

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
    cookies.set("auth", response?.data?.token);
    if (isReducedMotion.value === "reduce") {
      localStorage.setItem("reduceMotion", "true");
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
  <div
    class="min-h-screen flex justify-center items-center w-full p-[16px] dark:bg-[#101418] w-full"
  >
    <div
      class="w-full text-center max-w-[896px] flex justify-center items-center flex-col"
    >
      <Loading :text="t('home.loading')" variant="big" />
    </div>
  </div>
</template>
