<script setup>
import Logo from "@/assets/lexica_footer.svg";
import ButtonIcon from "@/components/buttons/ButtonIcon/index.vue";
</script>

<template>
  <footer
    class="h-[103px] fixed flex justify-center items-center w-full left-0 bottom-0 flex-col px-[16px] bg-[#EAECF0]"
  >
    <img :src="Logo" alt="lexica_footer" />
    <div class="text-center text-[12px]">
      <span>Sebuah perkakas dari </span
      ><a
        href="https://meta.wikimedia.org/wiki/Software_Collaboration_for_Wikidata"
        >Wikidata Software Collaboration</a
      >
    </div>
    <div class="text-center text-[12px] mt-[4px]">
      <a href="/about">Tentang</a>
      <span> · </span>
      <a href="/privacy-policy">Privasi</a>
      <span> · </span>
      <a href="/license-list">Lisensi</a>
    </div>
  </footer>
</template>
