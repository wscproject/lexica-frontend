<script setup>
import { CdxLabel } from "@wikimedia/codex";

const props = defineProps({
  data: Object,
  currCount: Number,
});
</script>

<template>
  <div
    class="absolute z-[99] w-full flex justify-center flex-col text-white text-center p-[16px]"
  >
    <CdxLabel>Kartu {{ props.currCount }}</CdxLabel>
    <p class="text-[28px]">
      {{ props?.data?.lemma }} ({{ props?.data?.lexemeSenseId }})
    </p>
    <p class="text-[16px]">{{ props?.data?.gloss }}</p>
  </div>
</template>
