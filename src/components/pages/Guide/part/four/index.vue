<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_4.svg";
</script>

<template>
  <div class="w-100">
    <div class="w-100">
      <img :src="Image" alt="image" class="w-100 mb-[12px] object-cover" />
    </div>
    <div class="px-[16px]">
      <CdxLabel class="text-[18px] pb-[12px]">Selesai!</CdxLabel>
      <p class="content pb">
        Selamat berkontribusi ke Wikidata Leksem dengan Lexica.
      </p>
      <br />
      <p class="content">
        Tip: Anda dapat melihat panduan ini kembali dari halaman Beranda.
      </p>
    </div>
  </div>
</template>

<style scoped>
.content {
  font-size: 16px;
  line-height: 25.6px;
  letter-spacing: -0.048px;
}
</style>
