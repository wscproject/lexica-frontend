<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_3.svg";
</script>

<template>
  <div class="w-full">
    <div class="mt-[20px] mb-[12px] w-full flex justify-center">
      <img :src="Image" alt="image" class="w-100 max-w-[329px]" rel="preload" />
    </div>
    <div class="px-[14px]">
      <CdxLabel class="text-[18px] pb-[12px]"
        >Isi sebuah kartu kontribusi</CdxLabel
      >
      <ol class="px-[16px]">
        <li class="content">
          <b>Kepala kartu:</b> berisi nama leksem, deskripsi singkat, dan tombol
          untuk melihat informasi lanjutan leksem tersebut.
        </li>
        <li class="content">
          <b>Isi kartu:</b> berisi pertanyaan, kotak pencarian, dan rekomendasi
          atau hasil pencarian Wikidata.
        </li>
        <li class="content">
          <b>Tombol aksi:</b> pilih “Selanjutnya” setelah memilih jawaban yang
          sesuai atau “Butir tidak ada” jika jawabannya tidak ditemukan.
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
