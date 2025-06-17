<script setup>
import { CdxIcon, CdxLabel, CdxButton } from "@wikimedia/codex";
import { cdxIconLogIn, cdxIconInfoFilled } from "@wikimedia/codex-icons";
import { useI18n } from "vue-i18n";
import { useDirWatcher } from "@/helper/useDirWatcher";
import HomeImage from "@/assets/home_image.svg";

import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";

const vuex = useStore();

const { dir } = useDirWatcher();
const { t } = useI18n({ useScope: "global" });
const loginUrl = import.meta.env.VITE_LOGIN_URL;
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const toPrivacy = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "/privacy-policy";
  }
};
onMounted(() => {
  const linkPrivacy = document.querySelector("#privacy-policy");

  linkPrivacy.addEventListener("keydown", toPrivacy);
});

onBeforeUnmount(() => {
  const linkPrivacy = document.querySelector("#privacy-policy");

  linkPrivacy.removeEventListener("keydown", toPrivacy);
});
</script>

<template>
  <div
    class="h-full flex justify-center max-[1023px]:flex-col max-[1023px]:gap-y-[var(--spacing-150)] min-[1024px]:flex-row min-[1024px]:gap-x-[var(--spacing-150)] font-[400] items-center">
    <div>
      <h1 class="text-[1.75rem] text-[var(--color-emphasized)] pb-[var(--spacing-50)] leading-[2.1875rem]">
        {{ t("home.unauth.title2") }}
      </h1>

      <div class="text-[1rem] dark:text-[#EAECF0]">
        <span>{{ t("home.unauth.body2") }}</span><a class="cdx-docs-link is-underlined" href="/privacy-policy"
          id="privacy-policy">{{ t("home.unauth.privacyPolicy") }}</a>.
      </div>

      <a :href="loginUrl" class="" tabindex="-1">
        <CdxButton action="progressive" weight="primary"
          class="py-[0.75rem] rounded-[0.1250rem] w-full max-w-[10rem] h-[2.75rem] my-[var(--spacing-100)]">
          <CdxIcon :dir="dir" :icon="cdxIconLogIn" />
          {{ t("home.unauth.login") }}
        </CdxButton>
      </a>

      <div
        class="flex gap-x-2 p-[var(--spacing-100)] rounded-[var(--border-radius-base)] border-[0.0625rem] border-[var(--border-color-notice)] bg-[var(--background-color-notice-subtle)] text-[var(--color-base)]">
        <CdxIcon :icon="cdxIconInfoFilled" />
        <span class="p-0 font-[400] text-[1rem]">{{
          t("home.unauth.info")
        }}</span>
      </div>
    </div>
    <div class="w-[360px] h-[360px] shrink-0 flex justify-center items-center max-[639px]:hidden">
      <img :src="HomeImage" alt="home" />
    </div>
  </div>
</template>
