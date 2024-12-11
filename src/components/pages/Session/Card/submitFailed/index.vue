<script setup>
import { CdxLabel, CdxButton } from "@wikimedia/codex";
import error from "@/assets/error.svg";
import errordark from "@/assets/errordark.svg";

import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { computed } from "vue";

const { t } = useI18n({ useScope: "global" });
const emit = defineEmits(["back"]);
const vuex = useStore();

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
</script>

<template>
  <div
    class="absolute z-[99] w-full bg-white dark:bg-[#101418] flex justify-center flex-col text-center p-[16px]"
  >
    <div class="w-full text-center">
      <div class="w-full flex justify-center pb-[16px]">
        <img v-if="!isThemeDark" :src="error" alt="home" />
        <img v-if="isThemeDark" :src="errordark" alt="home" />
      </div>

      <CdxLabel class="pb-[16px] text-[18px] dark:text-[#EAECF0]">{{
        t("session.cardError.title")
      }}</CdxLabel>
      <p class="w-full text-[16px] dark:text-[#EAECF0]">
        {{ t("session.cardError.description") }}
      </p>

      <CdxButton
        class="w-full h-[44px] mt-[16px]"
        weight="primary"
        action="progressive"
        @click="emit('back')"
      >
        {{ t("session.cardError.button") }}</CdxButton
      >
    </div>
  </div>
</template>
