<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Image from "@/assets/guide_2.svg";
</script>

<template>
  <div class="w-full">
    <div class="mt-[20px] mb-[12px] w-full flex justify-center">
      <img :src="Image" alt="image" class="w-100 max-w-[320px]" rel="preload" />
    </div>
    <div class="px-[14px]">
      <CdxLabel class="text-[18px] pb-[12px]">Antarmuka kontribusi</CdxLabel>
      <ol class="px-[16px]">
        <li class="content">
          <b>Beranda:</b> mengakhiri sesi kontribusi dan kembali ke halaman
          utama.
        </li>
        <li class="content">
          <b>Nomor kartu:</b> menampilkan urutan kartu yang sedang ditampilkan.
        </li>
        <li class="content">
          <b>Gestur lewati kartu:</b> usap kepala kartu ke atas untuk melewati
          kartu yang tidak dapat Anda isi.
        </li>
        <li class="content">
          <b>Tombol lewati kartu:</b> cara lain untuk melewati kartu.
        </li>
        <li class="content">
          <b>Akhiri sesi:</b> mengakhiri sesi kontribusi dan kembali ke halaman
          utama.
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
