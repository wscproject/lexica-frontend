<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_3.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="w-full">
    <div class="mt-[20px] mb-[12px] w-full flex justify-center">
      <img :src="Image" alt="image" class="w-100 max-w-[329px]" rel="preload" />
    </div>
    <div class="px-[14px]">
      <CdxLabel class="text-[18px] pb-[12px]">{{
        t("tutorial.three.title")
      }}</CdxLabel>
      <ol class="px-[16px]">
        <li class="content">
          <b>{{ t("tutorial.three.point1Title") }}:</b>
          {{ t("tutorial.three.point1Content") }}
        </li>
        <li class="content">
          <b>{{ t("tutorial.three.point2Title") }}:</b>
          {{ t("tutorial.three.point2Content") }}
        </li>
        <li class="content">
          <b>{{ t("tutorial.three.point3Title") }}:</b>
          {{ t("tutorial.three.point3Content") }}
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.content {
  font-size: 16px;
  line-height: 25.6px;
  letter-spacing: -0.048px;
}

ol > li::marker {
  font-weight: bold;
}
</style>
