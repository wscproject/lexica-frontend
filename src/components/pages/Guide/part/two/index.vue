<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_2.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="w-full pb-[0.5rem]">
    <div class="pb-[0.75rem] pt-[1.25rem] px-[0.9375rem] w-full flex justify-center">
      <img :src="Image" alt="image" class="w-100 max-w-[320px]" rel="preload" />
    </div>
    <div class="px-[0.8750rem]">
      <CdxLabel class="text-[1.125rem] pb-[0.75rem]">{{
        t("tutorial.two.title")
      }}</CdxLabel>
      <ol class="px-[1rem]">
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
  font-size: 1rem;
  line-height: 1.6rem;
  letter-spacing: -0.048px;
}

ol>li::marker {
  font-weight: bold;
}
</style>
