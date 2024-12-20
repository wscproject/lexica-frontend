<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";
import { onMounted } from "vue";

const { t } = useI18n({ useScope: "global" });
const router = useRouter();

onMounted(() => {
  const div = document.getElementById("yes");
  const hasVerticalScrollbar = div.scrollHeight > div.clientHeight;

  if (hasVerticalScrollbar) {
    console.log("tes", div);
  } else {
    console.log(div);
  }
});
</script>

<template>
  <div
    id="yes"
    class="min-h-screen flex flex-col bg-[var(--background-color-base)] text-[#54595D] dark:text-[#A2A9B1]"
  >
    <div
      class="gap-x-[8px] border-b border-[#C8CCD1] dark:border-[#54595D] max-[639px]:h-[54px] h-[64px] bg-[var(--background-color-neutral)] breakpoints-2"
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
        <div class="border-b border-[#C8CCD1] mb-[12px] dark:border-[#72777D]">
          <h1
            class="p-0 text-[28px] leading-[35px] pb-[12px] text-[var(--color-emphasized)]"
          >
            {{ t("privacy.title1") }}
          </h1>
        </div>
        <p class="p-0 text-[16px] dark:text-[#EAECF0]">
          {{ t("privacy.section1") }}
        </p>
        <div class="border-b border-[#C8CCD1] my-[12px] dark:border-[#72777D]">
          <h2
            class="p-0 text-[24px] leading-[35px] pb-[12px] text-[var(--color-emphasized)]"
          >
            {{ t("privacy.title2") }}
          </h2>
        </div>
        <ul class="dark:text-[#EAECF0]">
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
        <div class="border-b border-[#C8CCD1] my-[12px] dark:border-[#72777D]">
          <h2
            class="p-0 text-[24px] leading-[35px] pb-[12px] text-[var(--color-emphasized)]"
          >
            {{ t("privacy.title3") }}
          </h2>
        </div>

        <I18nT keypath="privacy.section3" tag="p" class="dark:text-[#EAECF0]">
          <template #license>
            <a class="cdx-docs-link is-underlined" href="/license-list">
              {{ t("privacy.license") }}</a
            >
          </template>
        </I18nT>

        <div class="border-b border-[#C8CCD1] my-[12px] dark:border-[#72777D]">
          <h2
            class="p-0 text-[24px] leading-[35px] pb-[12px] text-[var(--color-emphasized)]"
          >
            {{ t("privacy.title4") }}
          </h2>
        </div>
        <ul class="dark:text-[#EAECF0]">
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
  </div>
</template>
