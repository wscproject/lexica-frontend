<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";
import { onMounted } from "vue";

const { t } = useI18n({ useScope: "global" });
const router = useRouter();
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-black text-[#54595D]">
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
    <div class="p-[16px] flex flex-col items-center">
      <div class="max-w-[896px]">
        <div class="border-b border-[#C8CCD1] mb-[12px] dark:border-[#72777D]">
          <h1
            class="p-0 text-[28px] leading-[35px] pb-[12px] dark:text-[#F8F9FA]"
          >
            {{ t("license.title1") }}
          </h1>
        </div>
        <I18nT
          keypath="license.section1"
          tag="p"
          class="p-0 text-[16px] dark:text-[#EAECF0]"
        >
          <template #gnu>
            <a
              class="cdx-docs-link is-underlined"
              href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html"
            >
              GNU GPL-2.0</a
            >
          </template>
          <template #lexica>
            <b>Lexica</b>
          </template>
          <template #cc0>
            <a
              href="https://creativecommons.org/public-domain/cc0/"
              class="cdx-docs-link is-underlined"
              >CC0</a
            >
          </template>
        </I18nT>

        <div
          class="border-b border-[#C8CCD1] mb-[12px] mt-[24px] dark:border-[#72777D]"
        >
          <h2
            class="p-0 text-[24px] leading-[35px] pb-[12px] dark:text-[#F8F9FA]"
          >
            {{ t("license.title2") }}
          </h2>
        </div>
        <p class="p-0 text-[16px] mb-[12px] dark:text-[#EAECF0]">
          {{ t("license.section2.content") }}
        </p>
        <ul class="dark:text-[#EAECF0]">
          <li>
            <a
              href="https://gerrit.wikimedia.org/r/admin/repos/design/codex,general"
              class="cdx-docs-link is-underlined"
              >Wikimedia Codex Design System</a
            >, GNU GPL-2.0
          </li>
          <li>
            <a href="https://vuejs.org/" class="cdx-docs-link is-underlined"
              >Vue.js</a
            >, MIT
          </li>
          <li>
            <a href="https://interactjs.io/" class="cdx-docs-link is-underlined"
              >Interact.js</a
            >, MIT
          </li>
          <li>
            <a href="https://vuetifyjs.com/" class="cdx-docs-link is-underlined"
              >Vuetify</a
            >, MIT
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
