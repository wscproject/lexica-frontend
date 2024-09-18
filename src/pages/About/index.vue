<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-black text-[#54595D]">
    <div
      class="flex p-[4px] gap-x-[8px] items-center border-b border-[#C8CCD1] dark:border-[#54595D]"
    >
      <CdxButton
        weight="quiet"
        class="p-[11px]"
        @click="router.back"
        v-tooltip:bottom-start="t('tooltips.back')"
      >
        <CdxIcon :icon="cdxIconArrowPrevious" />
      </CdxButton>
      <p class="p-0 font-[700] dark:text-[#EAECF0]">{{ t("about.title") }}</p>
    </div>
    <div class="p-[16px]">
      <div class="border-b border-[#C8CCD1] dark:border-[#72777D] mb-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px] dark:text-[#F8F9FA]">
          {{ t("about.title") }}
        </p>
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
