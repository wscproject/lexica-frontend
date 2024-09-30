<script setup>
import Logo from "@/assets/lexica_footer.svg";
import LogoDark from "@/assets/lexica_footer_dark.svg";
import { computed } from "vue";

import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const vuex = useStore();

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const { t, locale } = useI18n({ useScope: "global" });
</script>

<template>
  <footer
    class="h-[103px] fixed flex justify-center items-center w-full left-0 bottom-0 flex-col px-[16px] bg-[#EAECF0] dark:bg-[#27292D]"
  >
    <img v-if="!isThemeDark" :src="Logo" alt="lexica_footer" />
    <img v-else :src="LogoDark" alt="lexica_footer" />

    <div class="text-center text-[12px]">
      <span class="text-[#54595D] dark:text-[#A2A9B1]"
        >{{ t("footer.label") }} </span
      ><a
        class="cdx-docs-link"
        href="https://meta.wikimedia.org/wiki/Software_Collaboration_for_Wikidata"
      >
        Wikidata Software Collaboration</a
      ><span class="text-[#54595D] dark:text-[#A2A9B1]" v-if="locale === 'en'">
        team</span
      >
    </div>
    <div class="text-center text-[12px] mt-[4px]">
      <a class="cdx-docs-link" href="/about">{{ t("footer.about") }}</a>
      <span class="cdx-docs-link"> · </span>
      <a class="cdx-docs-link" href="/privacy-policy">{{
        t("footer.privacy")
      }}</a>
      <span class="cdx-docs-link"> · </span>
      <a class="cdx-docs-link" href="/license-list">{{
        t("footer.license")
      }}</a>
    </div>
  </footer>
</template>
