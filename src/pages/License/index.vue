<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";
import { onBeforeUnmount, onMounted } from "vue";

const { t } = useI18n({ useScope: "global" });
const router = useRouter();
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[var(--background-color-base)] text-[#54595D] dark:text-[#A2A9B1]">
    <div
      class="gap-x-[0.5rem] border-b border-[#C8CCD1] dark:border-[#54595D] max-[639px]:h-[3.375rem] h-[4rem] bg-[var(--background-color-neutral)] breakpoints-2">
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
        <div class="border-b border-[#C8CCD1] mb-[0.75rem] dark:border-[#72777D]">
          <h1 class="p-0 text-[1.75rem] leading-[2.1875rem] pb-[0.75rem] text-[var(--color-emphasized)]">
            {{ t("license.title1") }}
          </h1>
        </div>
        <I18nT keypath="license.section1.content1" tag="p" class="p-0 text-[1rem] text-[var(--color-base)]">
          <template #gnu>
            <a id="GNU" class="cdx-docs-link is-underlined"
              href="https://www.gnu.org/licenses/old-licenses/gpl-2.0.html">
              GNU General Public License version 2.0</a>
          </template>
          <template #lexica>
            <b>Lexica</b>
          </template>
          <template #cc0>
            <a id="CC0" href="https://creativecommons.org/publicdomain/zero/1.0/"
              class="cdx-docs-link is-underlined">Creative Commons Zero</a>
          </template>
        </I18nT>
        <br />
        <div class="text-[var(--color-base)]">
          <span class="text-[1rem]">
            {{ t("license.section1.content2") }}
          </span>
          <ul>
            <li>
              Frontend:
              <a href="https://github.com/wscproject/lexica-frontend">GitHub</a>
            </li>
            <li>
              Backend:
              <a href="https://github.com/wscproject/lexica-backend">GitHub</a>
            </li>
          </ul>
        </div>

        <div class="border-b border-[#C8CCD1] mb-[0.75rem] mt-[1.5rem] dark:border-[#72777D]">
          <h2 class="p-0 text-[1.5rem] leading-[2.1875rem] pb-[0.75rem] text-[var(--color-emphasized)]">
            {{ t("license.title2") }}
          </h2>
        </div>
        <p class="p-0 text-[1rem] text-[var(--color-base)]">
          {{ t("license.section2.content") }}
        </p>
        <br />
        <h3 class="text-[1.25rem] font-bold text-[var(--color-base)] pb-[0.5rem]">
          {{ t("license.section2.subtitle1") }}
        </h3>
        <ul class="text-[var(--color-base)]">
          <li>
            <a id="axios" href="https://axios-http.com/" class="cdx-docs-link is-underlined">Axios</a>, MIT
          </li>
          <li>
            <a id="interact" href="https://interactjs.io/" class="cdx-docs-link is-underlined">Interact.js</a>, MIT
          </li>

          <li>
            <a id="vue" href="https://vuejs.org/" class="cdx-docs-link is-underlined">Vue.js</a>, MIT
          </li>
          <li>
            <a id="vuex" href="https://vuex.vuejs.org/" class="cdx-docs-link is-underlined">Vuex</a>, MIT
          </li>
          <li>
            <a id="vueuse" href="https://vueuse.org/" class="cdx-docs-link is-underlined">VueUse</a>, MIT
          </li>
          <li>
            <a id="vuetify" href="https://vuetifyjs.com/" class="cdx-docs-link is-underlined">Vuetify</a>, MIT
          </li>
          <li>
            <a id="vue3-cookies" href="https://www.npmjs.com/package/vue3-cookies"
              class="cdx-docs-link is-underlined">Vue3-Cookies</a>, MIT
          </li>
          <li>
            <a id="wikimedia" href="https://gerrit.wikimedia.org/r/admin/repos/design/codex,general"
              class="cdx-docs-link is-underlined">Wikimedia Codex Design System</a>, GNU GPL-2.0
          </li>
        </ul>
        <br />
        <h3 class="text-[1.25rem] font-bold text-[var(--color-base)] pb-[0.5rem]">
          {{ t("license.section2.subtitle2") }}
        </h3>
        <ul class="text-[var(--color-base)]">
          <li>
            <a id="axios" href="https://axios-http.com/" class="cdx-docs-link is-underlined">Axios</a>, MIT
          </li>
          <li>
            <a id="express" href="https://expressjs.com/" class="cdx-docs-link is-underlined">Express</a>, MIT
          </li>

          <li>
            <a id="joi" href="https://joi.dev/" class="cdx-docs-link is-underlined">Joi</a>, MIT
          </li>
          <li>
            <a id="jsonwebtoken" href="https://jwt.io/" class="cdx-docs-link is-underlined">Jsonwebtoken</a>, MIT
          </li>
          <li>
            <a id="node-cron" href="https://github.com/node-cron/node-cron"
              class="cdx-docs-link is-underlined">Node-cron</a>,
            MIT
          </li>
          <li>
            <a id="Swagger UI Express" href="https://github.com/scottie1984/swagger-ui-express"
              class="cdx-docs-link is-underlined">Swagger UI Express</a>, MIT
          </li>
          <li>
            <a id="Sequelize" href="https://sequelize.org/" class="cdx-docs-link is-underlined">Sequelize</a>, MIT
          </li>
        </ul>
        <br />
        <h3 class="text-[1.25rem] font-bold text-[var(--color-base)] pb-[0.5rem]">
          {{ t("license.section2.subtitle3") }}
        </h3>
        <ul class="text-[var(--color-base)]">
          <li>
            <a id="Atkinson Hyperlegible Next" href="https://brailleinstitute.org/freefont"
              class="cdx-docs-link is-underlined">Atkinson Hyperlegible Next</a>, SIL Open Font License 1.1 (OFL-1.1)
          </li>
          <li>
            <a id="Inter" href="https://rsms.me/inter/" class="cdx-docs-link is-underlined">Inter</a>, SIL Open Font
            License 1.1
            (OFL-1.1)
          </li>

          <li>
            <a id="Noto Sans Balinese" href="https://fonts.google.com/noto/specimen/Noto+Sans+Balinese"
              class="cdx-docs-link is-underlined">Noto Sans Balinese</a>, SIL Open Font License 1.1 (OFL-1.1)
          </li>
          <li>
            <a id="Noto Sans Javanese" href="https://fonts.google.com/noto/specimen/Noto+Sans+Javanese"
              class="cdx-docs-link is-underlined">Noto Sans Javanese</a>, SIL Open Font License 1.1 (OFL-1.1)
          </li>
          <li>
            <a id="Noto Sans Sundanese" href="https://fonts.google.com/noto/specimen/Noto+Sans+Sundanese"
              class="cdx-docs-link is-underlined">Noto Sans Sundanese</a>, SIL Open Font License 1.1 (OFL-1.1)
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: var(--color-progressive);
}
</style>
