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
      <p class="p-0 font-[700] dark:text-[#EAECF0]">
        {{ t("license.title1") }}
      </p>
    </div>
    <div class="p-[16px]">
      <div class="border-b border-[#C8CCD1] mb-[12px] dark:border-[#72777D]">
        <p class="p-0 text-[28px] leading-[35px] pb-[12px] dark:text-[#F8F9FA]">
          {{ t("license.title1") }}
        </p>
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
        <p class="p-0 text-[28px] leading-[35px] pb-[12px] dark:text-[#F8F9FA]">
          {{ t("license.title2") }}
        </p>
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
</template>
