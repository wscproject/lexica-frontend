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
      <span>Sebuah perkakas dari </span><a>Wikidata Software Collaboration</a>
    </div>
    <div class="text-center text-[12px] mt-[4px]">
      <a>Tentang</a>
      <span> · </span>
      <a>Privasi</a>
      <span> · </span>
      <a>Lisensi</a>
    </div>
  </footer>
</template>
