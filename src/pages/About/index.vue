<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-[var(--background-color-base)] text-[#54595D] dark:text-[#A2A9B1]"
  >
    <div
      class="flex gap-x-[8px] border-b border-[#C8CCD1] dark:border-[#54595D] max-[639px]:h-[54px] h-[64px] bg-[var(--background-color-neutral)] breakpoints-2"
    >
      <div
        class="max-w-[908px] w-full flex items-center h-full relative"
        style="display: block; margin-left: auto; margin-right: auto"
      >
        <CdxButton
          weight="quiet"
          class="absolute left-[0px] p-[var(--spacing-75)]"
          @click="router.back"
          v-tooltip:bottom-start="t('tooltips.back')"
        >
          <CdxIcon :icon="cdxIconArrowPrevious" />
        </CdxButton>
      </div>
    </div>
    <div class="max-[639px]:p-[16px] p-[32px] flex flex-col items-center">
      <div class="max-w-[896px]">
        <div class="border-b border-[#C8CCD1] dark:border-[#72777D] mb-[12px]">
          <h1
            class="p-0 text-[28px] leading-[35px] pb-[12px] text-[var(--color-emphasized)]"
          >
            {{ t("about.title") }}
          </h1>
        </div>
        <I18nT
          keypath="about.content1"
          tag="p"
          class="p-0 text-[16px] dark:text-[#EAECF0]"
        >
          <template #lexica>
            <span>Lexica</span>
          </template>
        </I18nT>
        <br />
        <I18nT
          keypath="about.content2"
          tag="p"
          class="p-0 text-[16px] dark:text-[#EAECF0]"
        >
          <template #lexica>
            <span>Lexica</span>
          </template>
        </I18nT>
        <br />
        <I18nT
          keypath="about.content3"
          tag="p"
          class="p-0 text-[16px] dark:text-[#EAECF0]"
        >
          <template #lexica>
            <span>Lexica</span>
          </template>
        </I18nT>
        <br />
        <I18nT
          keypath="about.content4"
          tag="p"
          class="p-0 text-[16px] dark:text-[#EAECF0]"
        >
          <template #lexica>
            <span>Lexica</span>
          </template>
          <template #link>
            <a
              class="cdx-docs-link is-underlined"
              href="https://www.wikidata.org/wiki/Wikidata:Lexica"
            >
              {{ t("about.page") }}</a
            >
          </template>
        </I18nT>
      </div>
    </div>
  </div>
</template>

<style lang="less">
@import (reference) "@wikimedia/codex-design-tokens/theme-wikimedia-ui.less";
@import (reference)
  "@wikimedia/codex-design-tokens/theme-wikimedia-ui-mixin-dark.less";
@import (reference) "@wikimedia/codex/mixins/link.less";

.cdx-docs-link {
  .cdx-mixin-link();

  // stylelint-disable-next-line selector-class-pattern
  .cdx-icon {
    color: inherit;
  }
}
</style>
