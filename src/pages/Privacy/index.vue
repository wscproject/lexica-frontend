<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div
      class="flex p-[4px] gap-x-[8px] items-center border-b border-[#C8CCD1]"
    >
      <CdxButton
        weight="quiet"
        class="p-[11px]"
        @click="router.back"
        v-tooltip:bottom-start="t('tooltips.back')"
      >
        <CdxIcon :icon="cdxIconArrowPrevious" />
      </CdxButton>
      <p class="p-0 font-[700]">{{ t("privacy.header") }}</p>
    </div>
    <div class="p-[16px]">
      <div class="border-b border-[#C8CCD1] mb-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          {{ t("privacy.title1") }}
        </p>
      </div>
      <p class="pb-[12px] text-[14px] text-[#54595D]">
        {{ t("privacy.version") }} 1.0
      </p>
      <p class="p-0 text-[16px]">
        {{ t("privacy.section1") }}
      </p>
      <div class="border-b border-[#C8CCD1] my-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          {{ t("privacy.title2") }}
        </p>
      </div>
      <ul>
        <li>
          {{ t("privacy.section2.point1") }}
        </li>
        <li>
          {{ t("privacy.section2.point2") }}
        </li>
        <I18nT keypath="privacy.section2.point3" tag="li">
          <template #privacy>
            <a
              class="cdx-docs-link is-underlined"
              href="https://foundation.wikimedia.org/wiki/Policy:Privacy_policy/id"
            >
              {{ t("privacy.section2.privacy") }}</a
            >.
          </template>
        </I18nT>
      </ul>
      <div class="border-b border-[#C8CCD1] my-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          {{ t("privacy.title3") }}
        </p>
      </div>

      <I18nT keypath="privacy.section3" tag="p">
        <template #license>
          <a class="cdx-docs-link is-underlined" href="/license-list">
            {{ t("privacy.license") }}</a
          >
        </template>
      </I18nT>

      <div class="border-b border-[#C8CCD1] my-[12px]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px]">
          {{ t("privacy.title4") }}
        </p>
      </div>
      <ul>
        <li>{{ t("privacy.section4.point1") }}</li>
        <li>
          {{ t("privacy.section4.point2") }}
        </li>
        <li>
          {{ t("privacy.section4.point3") }}
        </li>
        <li>
          {{ t("privacy.section4.point4") }}
        </li>
        <li>
          {{ t("privacy.section4.point5") }}
        </li>
        <li>
          {{ t("privacy.section4.point6") }}
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
