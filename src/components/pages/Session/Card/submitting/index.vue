<script setup>
import { CdxLabel, CdxProgressBar } from "@wikimedia/codex";

import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  submitAction: String,
});
</script>

<template>
  <div
    class="absolute z-[99] w-full bg-white dark:bg-[#101418] flex justify-center flex-col text-center p-[16px]"
  >
    <div class="w-full text-center">
      <CdxLabel
        v-if="props.submitAction === 'add'"
        class="pb-[16px] dark:text-[#EAECF0]"
        >{{ t("session.upload") }}</CdxLabel
      >
      <CdxProgressBar class="w-full"></CdxProgressBar>
    </div>
  </div>
</template>
