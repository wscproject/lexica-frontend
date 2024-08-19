<script setup>
import { CdxIcon, CdxLabel, CdxButton } from "@wikimedia/codex";
import { cdxIconLogIn, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const loginUrl = import.meta.env.VITE_LOGIN_URL;
</script>

<template>
  <div>
    <h1 class="pb-[12px] mb-[13px] border-b-[1px] border-[#C8CCD1]">
      {{ t("home.unauth.title") }}
    </h1>
    <div class="text-[16px] pb-[12px]">
      <span><b>Lexica </b> {{ t("home.unauth.body1") }}</span>
    </div>
    <div class="text-[16px] pb-[32px]">
      <span>{{ t("home.unauth.body2") }}</span
      ><a class="text-decoration-underline" href="/privacy-policy">{{
        t("home.unauth.privacyPolicy")
      }}</a>
    </div>

    <a class="w-full flex justify-center" :href="loginUrl">
      <CdxButton
        action="progressive"
        weight="primary"
        class="py-[12px] rounded-[2px] w-full max-w-[488px] h-[44px]"
        ><CdxIcon :icon="cdxIconLogIn" />
        {{ t("home.unauth.login") }}</CdxButton
      >
    </a>

    <div class="flex gap-x-2 pt-[32px]">
      <CdxIcon :icon="cdxIconInfoFilled" />
      <CdxLabel>{{ t("home.unauth.info") }}</CdxLabel>
    </div>
  </div>
</template>
