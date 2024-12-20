<script setup>
import { CdxIcon, CdxLabel, CdxButton } from "@wikimedia/codex";
import { cdxIconLogIn, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import { useI18n } from "vue-i18n";

import HomeImage from "@/assets/home_image.svg";

import { computed } from "vue";
import { useStore } from "vuex";

const vuex = useStore();

const { t } = useI18n({ useScope: "global" });
const loginUrl = import.meta.env.VITE_LOGIN_URL;
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
</script>

<template>
  <div
    class="h-full flex justify-center max-[1023px]:flex-col max-[1023px]:gap-y-[var(--spacing-150)] min-[1024px]:flex-row min-[1024px]:gap-x-[var(--spacing-150)] font-[400] items-center"
  >
    <div>
      <h1
        class="text-[28px] text-[var(--color-emphasized)] pb-[var(--spacing-50)] leading-[35px]"
      >
        {{ t("home.unauth.title2") }}
      </h1>

      <div class="text-[16px] dark:text-[#EAECF0]">
        <span>{{ t("home.unauth.body2") }}</span
        ><a class="cdx-docs-link is-underlined" href="/privacy-policy">{{
          t("home.unauth.privacyPolicy")
        }}</a
        >.
      </div>

      <a :href="loginUrl" class="">
        <CdxButton
          action="progressive"
          weight="primary"
          class="py-[12px] rounded-[2px] w-full max-w-[160px] h-[44px] my-[var(--spacing-100)]"
          ><CdxIcon :icon="cdxIconLogIn" />
          {{ t("home.unauth.login") }}</CdxButton
        >
      </a>

      <div
        class="flex gap-x-2 p-[var(--spacing-100)] rounded-[var(--border-radius-base)] border-[1px] border-[var(--border-color-notice)] bg-[var(--background-color-notice-subtle)] text-[var(--color-base)]"
      >
        <CdxIcon :icon="cdxIconInfoFilled" />
        <CdxLabel class="p-0 font-[400]">{{ t("home.unauth.info") }}</CdxLabel>
      </div>
    </div>
    <div
      class="w-[360px] h-[360px] shrink-0 flex justify-center items-center max-[639px]:hidden"
    >
      <img :src="HomeImage" alt="home" />
    </div>
  </div>
</template>
