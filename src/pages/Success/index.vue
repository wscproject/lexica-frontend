<script setup>
import { CdxProgressBar, CdxLabel } from "@wikimedia/codex";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import { Login } from "@/api/Auth";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const route = useRoute();
const router = useRouter();

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
      <CdxLabel class="pb-[16px] dark:text-[#EAECF0]">{{
        t("home.loading")
      }}</CdxLabel>
      <CdxProgressBar class="w-full max-w-[448px]"></CdxProgressBar>
    </div>
  </div>
</template>
