<script setup>
import Logo from "@/assets/lexica_footer.svg";
import LogoDark from "@/assets/lexica_footer_dark.svg";
import LogoLexica from "@/assets/lexica_logo_footer.svg";
import LogoLexicaDark from "@/assets/lexica_logo_footer_dark.svg";
import { CdxIcon } from "@wikimedia/codex";
import { cdxIconHeart } from "@wikimedia/codex-icons";

import { computed, onBeforeUnmount, onMounted } from "vue";

import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const vuex = useStore();

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const toWiki = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href =
      "https://meta.wikimedia.org/wiki/Software_Collaboration_for_Wikidata";
  }
};

const toPrivacy = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "/privacy-policy";
  }
};

const toAbout = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "/about";
  }
};

const toLicense = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "/license-list";
  }
};
onMounted(() => {
  const linkPrivacy = document.querySelector("#privacy-policy");
  const linkAbout = document.querySelector("#about");
  const linklicense = document.querySelector("#license");
  const linkWiki = document.querySelector("#wikidata");

  linkPrivacy.addEventListener("keydown", toPrivacy);
  linkAbout.addEventListener("keydown", toAbout);
  linklicense.addEventListener("keydown", toLicense);
  linkWiki.addEventListener("keydown", toWiki);
});

onBeforeUnmount(() => {
  const linkPrivacy = document.querySelector("#privacy-policy");
  const linkAbout = document.querySelector("#about");
  const linklicense = document.querySelector("#license");
  const linkWiki = document.querySelector("#wikidata");

  linkPrivacy.removeEventListener("keydown", toPrivacy);
  linkAbout.removeEventListener("keydown", toAbout);
  linklicense.removeEventListener("keydown", toLicense);
  linkWiki.removeEventListener("keydown", toWiki);
});

const { t, locale } = useI18n({ useScope: "global" });
</script>

<template>
  <footer
    class="flex items-center jusitfy-center w-full left-0 bottom-0 flex-col px-[16px] bg-[#EAECF0] dark:bg-[#27292D] py-[var(--spacing-100)] px-[var(--spacing-200)] max-[639px]:px-[var(--spacing-100)]"
  >
    <div
      class="max-w-[896px] w-full flex items-center justify-between h-full gap-x-[var(--spacing-200)] max-[639px]:flex-col max-[639px]:items-start max-[639px]:gap-y-[var(--spacing-50)]"
    >
      <div
        class="flex flex-col max-[639px]:w-fit h-full justify-between gap-y-[var(--spacing-50)]"
      >
        <div class="flex items-center gap-x-[var(--spacing-50)]">
          <div>
            <img v-if="!isThemeDark" :src="LogoLexica" alt="lexica_footer" />
            <img v-else :src="LogoLexicaDark" alt="lexica_footer" />
          </div>
          <CdxIcon
            :icon="cdxIconHeart"
            size="extra-small"
            dir="rtl"
            class="text-[#BF3C2C] w-[12px] h-[12px]"
          />
          <div>
            <img v-if="!isThemeDark" :src="Logo" alt="lexica_footer" />
            <img v-else :src="LogoDark" alt="lexica_footer" />
          </div>
        </div>
        <div class="text-[#54595D] dark:text-[#A2A9B1]">
          <I18nT
            keypath="footer.label"
            tag="p"
            class="p-0 text-[14px] dark:text-[#EAECF0] font-[700]"
          >
            <template #wikidata>
              <a
                id="wikidata"
                class="cdx-docs-link"
                href="https://meta.wikimedia.org/wiki/Software_Collaboration_for_Wikidata"
              >
                <b> Wikidata Software Collaboration</b></a
              >
            </template>
          </I18nT>
        </div>
      </div>
      <div class="flex items-end max-[639px]:w-fit justify-end h-full">
        <div
          class="text-center text-[14px] font-[700] flex gap-x-[var(--spacing-50)] items-center"
        >
          <a class="cdx-docs-link" id="about" href="/about">{{
            t("footer.about")
          }}</a>
          <span class="cdx-docs-link">·</span>
          <a id="privacy-policy" class="cdx-docs-link" href="/privacy-policy">{{
            t("footer.privacy")
          }}</a>
          <span class="cdx-docs-link">·</span>
          <a class="cdx-docs-link" id="license" href="/license-list">{{
            t("footer.license")
          }}</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
a {
  color: var(--color-progressive);
}
</style>
