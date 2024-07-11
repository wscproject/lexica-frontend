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
      <p class="p-0 font-[700]">Privasi</p>
    </div>
    <div class="p-[16px]">
      <div class="border-b border-[#C8CCD1] mb-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          Kebijakan Privasi
        </p>
      </div>
      <p class="pb-[12px] text-[14px] text-[#54595D]">Versi 1.0</p>
      <p class="p-0 text-[16px]">
        Lexica masih berada dalam tahap pengembangan awal. Kebijakan privasi
        akan terus diperbarui seiring dengan perubahan pada Lexica. Dengan
        menggunakan Lexica, pengguna dianggap setuju pada kebijakan privasi ini.
      </p>
      <div class="border-b border-[#C8CCD1] my-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          Pengumpulan Informasi Data Pribadi
        </p>
      </div>
      <ul>
        <li>
          Lexica tidak menyimpan data apapun yang terkait dengan pengguna,
          seperti namun tidak terbatas pada nama pengguna, kata sandi, alamat
          IP, riwayat interaksi, dan data statistik penggunaan.
        </li>
        <li>
          Lexica hanya memperoleh otorisasi untuk mengambil tindakan atas nama
          pengguna ketika pengguna masuk melalui akun pengguna Wikimedia.
        </li>
        <li>
          Catatan kontribusi pengguna akan disimpan di situs Wikidata yang
          tunduk pada
          <a
            class="cdx-docs-link is-underlined"
            href="https://foundation.wikimedia.org/wiki/Policy:Privacy_policy/id"
          >
            kebijakan privasi Wikimedia Foundation</a
          >.
        </li>
      </ul>
      <div class="border-b border-[#C8CCD1] my-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">Lisensi</p>
      </div>

      <p class="p-0 text-[16px]">
        Lihat halaman
        <a class="cdx-docs-link is-underlined" href="/license-list"> Lisensi</a
        >.
      </p>

      <div class="border-b border-[#C8CCD1] my-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          Perubahan Kebjiakan Privasi
        </p>
      </div>
      <ul>
        <li>Lexica dapat mengubah kebijakan privasi kapan saja.</li>
        <li>
          Sebelum melakukan perubahan kebijakan privasi, Lexica akan memberikan
          pemberitahuan terlebih dahulu mengenai perubahan kebijakan privasi
          sebelum secara tetap diimplementasikan.
        </li>
        <li>
          Pemberitahuan perubahan kebijakan privasi akan diumumkan melalui
          Lexica.
        </li>
        <li>
          Terdapat periode waktu yang disebut sebagai masa tunggu, yang mencakup
          tujuh hari setelah adanya pengumuman perubahan kebijakan privasi dan
          penerapan kebijakan privasi yang baru.
        </li>
        <li>
          Lexica menyarankan pengguna untuk secara rutin memeriksa perubahan
          kebijakan privasi yang dapat ditemukan di halaman ini, halaman
          pengguna di Wikidata, dan kebijakan privasi Wikimedia Foundation.
        </li>
        <li>
          Dengan terus menggunakan Lexica setelah adanya perubahan kebijakan
          privasi, pengguna dianggap menyetujui perubahan kebijakan privasi
          tersebut.
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
