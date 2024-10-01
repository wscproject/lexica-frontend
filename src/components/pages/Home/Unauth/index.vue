<script setup>
import { CdxIcon, CdxLabel, CdxButton } from "@wikimedia/codex";
import { cdxIconLogIn, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import { useI18n } from "vue-i18n";
import Logo from "@/assets/home_logo.svg";
import LogoDark from "@/assets/home_logo_dark.svg";
import { computed } from "vue";
import { useStore } from "vuex";

const vuex = useStore();

const { t } = useI18n({ useScope: "global" });
const loginUrl = import.meta.env.VITE_LOGIN_URL;
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
</script>

<template>
  <div>
    <div
      class="flex w-100 align-center flex-col border-b-[1px] border-[#C8CCD1] dark:border-[#72777D] pb-[12px] mb-[12px]"
    >
      <img
        v-if="!isThemeDark"
        :src="Logo"
        alt="home_logo"
        class="shrink-0 w-[48px] h-[48px] mb-[8px] mt-[8px]"
      />
      <img
        v-else
        :src="LogoDark"
        alt="home_logo"
        class="shrink-0 w-[48px] h-[48px] mb-[8px] mt-[8px]"
      />
      <h1 class="dark:text-[#EAECF0]">
        {{ t("home.unauth.title") }}
      </h1>
    </div>

    <div class="text-[16px] pb-[12px] dark:text-[#EAECF0]">
      <span><b>Lexica </b> {{ t("home.unauth.body1") }}</span>
    </div>
    <div class="text-[16px] pb-[32px] dark:text-[#EAECF0]">
      <span>{{ t("home.unauth.body2") }}</span
      ><a class="cdx-docs-link is-underlined" href="/privacy-policy">{{
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

    <div class="flex gap-x-2 pt-[32px] dark:text-[#EAECF0]">
      <CdxIcon :icon="cdxIconInfoFilled" />
      <CdxLabel>{{ t("home.unauth.info") }}</CdxLabel>
    </div>
  </div>
</template>
