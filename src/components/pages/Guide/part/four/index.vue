<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_4.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="w-100">
    <div class="w-100">
      <img :src="Image" alt="image" class="w-100 mb-[12px] object-cover" />
    </div>
    <div class="px-[16px]">
      <CdxLabel class="text-[18px] pb-[12px]">{{
        t("tutorial.four.title")
      }}</CdxLabel>
      <p class="content pb">
        {{ t("tutorial.four.content1") }}
      </p>
      <br />
      <p class="content">
        {{ t("tutorial.four.content2") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.content {
  font-size: 16px;
  line-height: 25.6px;
  letter-spacing: -0.048px;
}
</style>
