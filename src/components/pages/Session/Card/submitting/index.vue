<script setup>
import { CdxLabel, CdxProgressBar } from "@wikimedia/codex";

import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div
    class="absolute z-[99] w-full bg-white flex justify-center flex-col text-center p-[16px]"
  >
    <div class="w-full text-center">
      <CdxLabel class="pb-[16px]">{{ t("session.upload") }}</CdxLabel>
      <CdxProgressBar class="w-full"></CdxProgressBar>
    </div>
  </div>
</template>
