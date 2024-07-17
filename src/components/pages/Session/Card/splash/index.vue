<script setup>
import { CdxLabel } from "@wikimedia/codex";

const props = defineProps({
  data: Object,
  currCount: Number,
});
</script>

<template>
  <div
    class="absolute z-[99] w-full flex justify-center flex-col text-white text-center p-[16px] h-full"
  >
    <CdxLabel>Kartu {{ props.currCount }}</CdxLabel>
    <p class="text-[28px]">
      {{ props?.data?.lemma }} ({{ props?.data?.lexemeSenseId }})
    </p>
    <p v-if="props?.data?.gloss" class="text-[16px]">
      {{ props?.data?.gloss }}
    </p>
    <p v-else class="text-[16px]"><i>Tidak ada deskripsi</i></p>
  </div>
</template>
