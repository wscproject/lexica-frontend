<script setup>
import { CdxLabel, CdxButton } from "@wikimedia/codex";
import error from "@/assets/error.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const emit = defineEmits(["back"]);
</script>

<template>
  <div
    class="absolute z-[99] w-full bg-white dark:bg-[#101418] flex justify-center flex-col text-center p-[16px]"
  >
    <div class="w-full text-center">
      <div class="w-full flex justify-center pb-[16px]">
        <img :src="error" alt="home" />
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
