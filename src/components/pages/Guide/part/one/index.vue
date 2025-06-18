<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_1.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <div class="w-100">
    <div class="w-100">
      <img :src="Image" alt="image" class="w-100 mb-[0.75rem] object-cover" />
    </div>

    <div class="px-[1rem]">
      <CdxLabel class="text-[1.125rem] pb-[0.75rem]">{{
        t("tutorial.one.title")
      }}</CdxLabel>
      <p class="content pb">
        {{ t("tutorial.one.content") }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.content {
  font-size: 1rem;
  line-height: 1.6rem;
  letter-spacing: -0.048px;
}
</style>
