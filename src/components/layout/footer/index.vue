<script setup>
import Logo from "@/assets/lexica_footer.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>

<template>
  <footer
    class="h-[103px] fixed flex justify-center items-center w-full left-0 bottom-0 flex-col px-[16px] bg-[#EAECF0]"
  >
    <img :src="Logo" alt="lexica_footer" />
    <div class="text-center text-[12px]">
      <span>{{ t("footer.label") }} </span
      ><a
        href="https://meta.wikimedia.org/wiki/Software_Collaboration_for_Wikidata"
      >
        Wikidata Software Collaboration</a
      >
    </div>
    <div class="text-center text-[12px] mt-[4px]">
      <a href="/about">{{ t("footer.about") }}</a>
      <span> · </span>
      <a href="/privacy-policy">{{ t("footer.privacy") }}</a>
      <span> · </span>
      <a href="/license-list">{{ t("footer.license") }}</a>
    </div>
  </footer>
</template>
