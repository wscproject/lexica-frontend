<script setup>
import { CdxLabel, CdxButton } from "@wikimedia/codex";
import error from "@/assets/error.svg";

const emit = defineEmits(["back"]);
</script>

<template>
  <div
    class="absolute z-[99] w-full bg-white flex justify-center flex-col text-center p-[16px]"
  >
    <div class="w-full text-center">
      <div class="w-full flex justify-center pb-[16px]">
        <img :src="error" alt="home" />
      </div>

      <CdxLabel class="pb-[16px] text-[18px]"
        >Tidak dapat mengunggah kontribusi</CdxLabel
      >
      <p class="w-full text-[16px]">
        Periksa koneksi internet Anda, lalu coba lagi.
      </p>

      <CdxButton
        class="w-full h-[44px] mt-[16px]"
        weight="primary"
        action="progressive"
        @click="emit('back')"
        >Coba lagi</CdxButton
      >
    </div>
  </div>
</template>
