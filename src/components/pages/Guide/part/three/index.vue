<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_3.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="w-full pb-[0.5rem]">
    <div class="pb-[0.75rem] pt-[1.25rem] px-[1.25rem] w-full flex justify-center">
      <img :src="Image" alt="image" class="w-100 max-w-[20.563rem]" rel="preload" />
    </div>
    <div class="px-[0.875rem]">
      <CdxLabel class="text-[1.125rem] pb-[0.75rem]">{{
        t("tutorial.three.title")
      }}</CdxLabel>
      <ol class="px-[1rem]">
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
  font-size: 1rem;
  line-height: 1.6rem;
  letter-spacing: -0.048px;
}

ol>li::marker {
  font-weight: bold;
}
</style>
