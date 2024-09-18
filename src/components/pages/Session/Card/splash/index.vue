<script setup>
import { CdxLabel } from "@wikimedia/codex";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  data: Object,
  currCount: Number,
  isNotCurrent: Boolean,
});
</script>

<template>
  <div
    class="absolute z-[99] w-full flex justify-center flex-col text-white text-center p-[16px] h-full"
  >
    <div v-if="!isNotCurrent">
      <CdxLabel>{{ t("session.title") }} {{ props.currCount }}</CdxLabel>
      <p class="text-[28px]">
        {{ props?.data?.lemma }} ({{ props?.data?.lexemeSenseId }})
      </p>
      <p v-if="props?.data?.gloss" class="text-[16px]">
        {{ props?.data?.gloss }}
      </p>
      <p v-else class="text-[16px]">
        <i>{{ t("session.emptyDescription") }}</i>
      </p>
    </div>
  </div>
</template>
