<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import {
  cdxIconArrowPrevious,
  cdxIconLinkExternal,
} from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div
      class="flex p-[4px] gap-x-[8px] items-center border-b border-[#C8CCD1]"
    >
      <CdxButton weight="quiet" class="p-[11px]" @click="router.back">
        <CdxIcon :icon="cdxIconArrowPrevious" />
      </CdxButton>
      <p class="p-0 font-[700]">Tentang</p>
    </div>
    <div class="p-[16px]">
      <div class="border-b border-[#C8CCD1] mb-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">Tentang</p>
      </div>
      <p class="p-0 text-[16px]">
        Menyunting data leksikografis di Wikidata melalui ponsel merupakan
        kegiatan yang menantang bagi sebagian pengguna. Hal itulah yang
        mendasari hadirnya <b>Lexica.</b> Tujuan kami sederhana: membuat proses
        menyunting menjadi lebih mudah dan dapat dilakukan oleh siapa saja, di
        mana saja.
      </p>
      <br />
      <p class="p-0 text-[16px]">
        <b>Lexica</b> merupakan eksperimen untuk menyajikan pengalaman
        menyunting data leksikografis di Wikidata dengan cara yang berbeda.
        Sebagai perkakas berbasis web yang dioptimalkan untuk pengguna ponsel,
        <b>Lexica</b>
        memungkinkan Anda untuk menautkan makna pada Leksem ke butir Wikidata
        secara cepat melalui tampilan kartu yang responsif.
      </p>
      <br />
      <p class="p-0 text-[16px]">
        <b>Lexica</b> dikembangkan oleh tim pengembangan perangkat lunak dari
        Indonesia bersama Wikimedia Deutschland. Kerja sama ini merupakan bagian
        dari Wikidata Software Collaboration yang didukung oleh hibah dari
        Arcadia Philanthropic Fund.
      </p>
      <br />
      <p class="p-0 text-[16px]">
        Kami berkomitmen untuk terus mengembangkan <b>Lexica</b> agar dapat
        memberikan pengalaman pengguna yang lebih baik. Untuk mempelajari proyek
        kami lebih lanjut, silakan kunjungi
        <a
          class="cdx-docs-link is-underlined"
          href="https://archive.org/details/completebookofca00behr/page/28/mode/2up"
        >
          halaman berikut </a
        >.
      </p>
    </div>
  </div>
</template>

<style lang="less">
@import (reference) "@wikimedia/codex-design-tokens/theme-wikimedia-ui.less";
@import (reference) "@wikimedia/codex/mixins/link.less";

.cdx-docs-link {
  .cdx-mixin-link();

  // stylelint-disable-next-line selector-class-pattern
  .cdx-icon {
    color: inherit;
  }
}
</style>
