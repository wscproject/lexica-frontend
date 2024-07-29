<script setup>
import { CdxIcon, CdxLabel, CdxButton } from "@wikimedia/codex";
import { cdxIconLogIn, cdxIconInfoFilled } from "@wikimedia/codex-icons";

const loginUrl = import.meta.env.VITE_LOGIN_URL;
</script>

<template>
  <div>
    <h1 class="pb-[12px] mb-[13px] border-b-[1px] border-[#C8CCD1]">
      Selamat datang!
    </h1>
    <div class="text-[16px] pb-[12px]">
      <span
        ><b>Lexica</b> merupakan sebuah perkakas eksperimental untuk
        berkontribusi ke Wikidata Leksem dengan mudah.</span
      >
    </div>
    <div class="text-[16px] pb-[32px]">
      <span>Dengan menggunakan Lexica, Anda menyetujui </span
      ><a class="text-decoration-underline" href="/privacy-policy"
        >Kebijakan Privasi Lexica.</a
      >
    </div>

    <a class="w-full flex justify-center" :href="loginUrl">
      <CdxButton
        action="progressive"
        weight="primary"
        class="py-[12px] rounded-[2px] w-full max-w-[488px]"
        ><CdxIcon :icon="cdxIconLogIn" /> Masuk log</CdxButton
      >
    </a>

    <div class="flex gap-x-2 pt-[32px]">
      <CdxIcon :icon="cdxIconInfoFilled" />
      <CdxLabel
        >Untuk sementara, Lexica hanya tersedia untuk leksem Bahasa
        Indonesia.</CdxLabel
      >
    </div>
  </div>
</template>
