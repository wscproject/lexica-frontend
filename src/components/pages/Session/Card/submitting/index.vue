<script setup>
import { CdxLabel, CdxProgressBar } from "@wikimedia/codex";
</script>

<template>
  <div
    class="absolute z-[99] w-full bg-white flex justify-center flex-col text-center p-[16px]"
  >
    <div class="w-full text-center">
      <CdxLabel class="pb-[16px]">Menggunggah kontribusi...</CdxLabel>
      <CdxProgressBar class="w-full"></CdxProgressBar>
    </div>
  </div>
</template>
