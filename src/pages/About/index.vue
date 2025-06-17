<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";
import { onBeforeUnmount, onMounted } from "vue";

const { t } = useI18n();

const router = useRouter();

const toPage = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "https://www.wikidata.org/wiki/Wikidata:Lexica";
  }
};
onMounted(() => {
  const linkPage = document.querySelector("#to-page");

  linkPage.addEventListener("keydown", toPage);
});

onBeforeUnmount(() => {
  const linkPage = document.querySelector("#to-page");

  linkPage.removeEventListener("keydown", toPage);
});
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[var(--background-color-base)] text-[#54595D] dark:text-[#A2A9B1]">
    <div
      class="flex gap-x-[0.5rem] border-b border-[#C8CCD1] dark:border-[#54595D] max-[639px]:h-[3.375rem] h-[4rem] bg-[var(--background-color-neutral)] breakpoints-2">
      <div class="max-w-[56.75rem] w-full flex items-center h-full relative"
        style="display: block; margin-left: auto; margin-right: auto">
        <CdxButton :aria-label="t('aria.back')" weight="quiet" class="p-[var(--spacing-75)]" @click="router.back"
          v-tooltip:bottom-start="t('tooltips.back')">
          <CdxIcon :icon="cdxIconArrowPrevious" />
        </CdxButton>
      </div>
    </div>
    <div class="max-[639px]:p-[1rem] p-[2rem] flex flex-col items-center">
      <div class="max-w-[56rem]">
        <div class="border-b border-[#C8CCD1] dark:border-[#72777D] mb-[0.75rem]">
          <h1 class="p-0 text-[1.75rem] leading-[2.1875rem] pb-[0.75rem] text-[var(--color-emphasized)]">
            {{ t("about.title") }}
          </h1>
        </div>
        <I18nT keypath="about.content1" tag="p" class="p-0 text-[1rem] text-[var(--color-base)]">
          <template #lexica>
            <span>Lexica</span>
          </template>
        </I18nT>
        <br />
        <I18nT keypath="about.content2" tag="p" class="p-0 text-[1rem] text-[var(--color-base)]">
          <template #lexica>
            <span>Lexica</span>
          </template>
        </I18nT>
        <br />
        <I18nT keypath="about.content3" tag="p" class="p-0 text-[1rem] text-[var(--color-base)]">
          <template #lexica>
            <span>Lexica</span>
          </template>
        </I18nT>
        <br />
        <I18nT keypath="about.content4" tag="p" class="p-0 text-[1rem] text-[var(--color-base)]">
          <template #lexica>
            <span>Lexica</span>
          </template>
          <template #link>
            <a id="to-page" class="cdx-docs-link is-underlined" href="https://www.wikidata.org/wiki/Wikidata:Lexica">
              {{ t("about.page") }}</a>
          </template>
        </I18nT>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import (reference) "@wikimedia/codex-design-tokens/theme-wikimedia-ui.less";
@import (reference) "@wikimedia/codex-design-tokens/theme-wikimedia-ui-mixin-dark.less";
@import (reference) "@wikimedia/codex/mixins/link.less";

.cdx-docs-link {
  .cdx-mixin-link();

  // stylelint-disable-next-line selector-class-pattern
  .cdx-icon {
    color: inherit;
  }
}
</style>
