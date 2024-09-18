<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_2.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="w-full pb-[8px]">
    <div class="mb-[12px] px-[15px] w-full flex justify-center">
      <img :src="Image" alt="image" class="w-100 max-w-[320px]" rel="preload" />
    </div>
    <div class="px-[14px]">
      <CdxLabel class="text-[18px] pb-[12px]">{{
        t("tutorial.two.title")
      }}</CdxLabel>
      <ol class="px-[16px]">
        <li class="content">
          <b>{{ t("tutorial.two.point1Title") }}:</b>
          {{ t("tutorial.two.point1Content") }}
        </li>
        <li class="content">
          <b>{{ t("tutorial.two.point2Title") }}:</b>
          {{ t("tutorial.two.point2Content") }}
        </li>
        <li class="content">
          <b>{{ t("tutorial.two.point3Title") }}:</b>
          {{ t("tutorial.two.point3Content") }}
        </li>
        <li class="content">
          <b>{{ t("tutorial.two.point4Title") }}:</b>
          {{ t("tutorial.two.point4Content") }}
        </li>
        <li class="content">
          <b>{{ t("tutorial.two.point5Title") }}:</b>
          {{ t("tutorial.two.point5Content") }}
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
