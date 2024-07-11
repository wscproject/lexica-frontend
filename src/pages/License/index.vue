<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
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
      <p class="p-0 font-[700]">Lisensi</p>
    </div>
    <div class="p-[16px]">
      <div class="border-b border-[#C8CCD1] mb-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">Lisensi</p>
      </div>
      <p class="p-0 text-[16px]">
        <b>Lexica</b> dan seluruh komponennya dipublikasikan dengan lisensi
        <a
          class="cdx-docs-link is-underlined"
          href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html"
        >
          GNU GPL-2.0</a
        >. Semua data yang ditambahkan dengan perkakas ini akan disimpan di
        Wikidata dengan lisensi
        <a
          href="https://creativecommons.org/public-domain/cc0/"
          class="cdx-docs-link is-underlined"
          >CC0</a
        >.
      </p>
      <div class="border-b border-[#C8CCD1] mb-[12px] mt-[24px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          Komponen sumber terbuka
        </p>
      </div>
      <p class="p-0 text-[16px] mb-[12px]">
        Berikut adalah komponen sumber terbuka yang digunakan Lexica:
      </p>
      <ul>
        <li>
          <a
            href="https://gerrit.wikimedia.org/r/admin/repos/design/codex,general"
            class="cdx-docs-link is-underlined"
            >Wikimedia Codex Design System</a
          >, GNU GPL-2.0
        </li>
        <li>
          <a href="https://vuejs.org/" class="cdx-docs-link is-underlined"
            >Vue.js</a
          >, MIT
        </li>
      </ul>
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
