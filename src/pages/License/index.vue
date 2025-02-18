<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";
import { onBeforeUnmount, onMounted } from "vue";

const { t } = useI18n({ useScope: "global" });
const router = useRouter();

const toGNU = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href =
      "https://www.gnu.org/licenses/old-licenses/gpl-2.0.html";
  }
};

const toCC0 = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "https://creativecommons.org/public-domain/cc0/";
  }
};

const toWikimedia = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href =
      "https://gerrit.wikimedia.org/r/admin/repos/design/codex,general";
  }
};
const toVue = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "https://vuejs.org/";
  }
};
const toInteract = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "https://interactjs.io/";
  }
};
const toVuetify = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "https://vuetifyjs.com/";
  }
};
const toInter = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href = "https://github.com/rsms/inter";
  }
};
const toAtkinson = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href =
      "https://github.com/googlefonts/atkinson-hyperlegible";
  }
};

onMounted(() => {
  const linkGNU = document.querySelector("#GNU");
  const linkCC0 = document.querySelector("#CC0");
  const linkWikimedia = document.querySelector("#wikimedia");
  const linkVue = document.querySelector("#vue");
  const linkInteract = document.querySelector("#interact");
  const linkVuetify = document.querySelector("#vuetify");
  const linkInter = document.querySelector("#inter");
  const linkAtkinson = document.querySelector("#inter");

  linkGNU.addEventListener("keydown", toGNU);
  linkCC0.addEventListener("keydown", toCC0);
  linkWikimedia.addEventListener("keydown", toWikimedia);
  linkVue.addEventListener("keydown", toVue);
  linkInteract.addEventListener("keydown", toInteract);
  linkVuetify.addEventListener("keydown", toVuetify);
  linkInter.addEventListener("keydown", toInter);
  linkAtkinson.addEventListener("keydown", toAtkinson);
});

onBeforeUnmount(() => {
  const linkGNU = document.querySelector("#GNU");
  const linkCC0 = document.querySelector("#CC0");
  const linkWikimedia = document.querySelector("#wikimedia");
  const linkVue = document.querySelector("#vue");
  const linkInteract = document.querySelector("#interact");
  const linkVuetify = document.querySelector("#vuetify");
  const linkInter = document.querySelector("#inter");
  const linkAtkinson = document.querySelector("#inter");

  linkGNU.removeEventListener("keydown", toGNU);
  linkCC0.removeEventListener("keydown", toCC0);
  linkWikimedia.removeEventListener("keydown", toWikimedia);
  linkVue.removeEventListener("keydown", toVue);
  linkInteract.removeEventListener("keydown", toInteract);
  linkVuetify.removeEventListener("keydown", toVuetify);
  linkInter.removeEventListener("keydown", toInter);
  linkAtkinson.removeEventListener("keydown", toAtkinson);
});
</script>

<template>
  <div
    class="min-h-screen flex flex-col bg-white dark:bg-[var(--background-color-base)] text-[#54595D] dark:text-[#A2A9B1]"
  >
    <div
      class="gap-x-[8px] border-b border-[#C8CCD1] dark:border-[#54595D] max-[639px]:h-[54px] h-[64px] bg-[var(--background-color-neutral)] breakpoints-2"
    >
      <div
        class="max-w-[908px] w-full flex items-center h-full relative"
        style="display: block; margin-left: auto; margin-right: auto"
      >
        <CdxButton
          :aria-label="t('aria.back')"
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
            {{ t("license.title1") }}
          </h1>
        </div>
        <I18nT
          keypath="license.section1"
          tag="p"
          class="p-0 text-[16px] text-[var(--color-base)]"
        >
          <template #gnu>
            <a
              id="GNU"
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
              id="CC0"
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
            class="p-0 text-[24px] leading-[35px] pb-[12px] text-[var(--color-emphasized)]"
          >
            {{ t("license.title2") }}
          </h2>
        </div>
        <p class="p-0 text-[16px] mb-[12px] text-[var(--color-base)]">
          {{ t("license.section2.content") }}
        </p>
        <ul class="text-[var(--color-base)]">
          <li>
            <a
              id="wikimedia"
              href="https://gerrit.wikimedia.org/r/admin/repos/design/codex,general"
              class="cdx-docs-link is-underlined"
              >Wikimedia Codex Design System</a
            >, GNU GPL-2.0
          </li>
          <li>
            <a
              id="vue"
              href="https://vuejs.org/"
              class="cdx-docs-link is-underlined"
              >Vue.js</a
            >, MIT
          </li>
          <li>
            <a
              id="interact"
              href="https://interactjs.io/"
              class="cdx-docs-link is-underlined"
              >Interact.js</a
            >, MIT
          </li>
          <li>
            <a
              id="vuetify"
              href="https://vuetifyjs.com/"
              class="cdx-docs-link is-underlined"
              >Vuetify</a
            >, MIT
          </li>
          <li>
            <a
              id="inter"
              href="https://github.com/rsms/inter"
              class="cdx-docs-link is-underlined"
              >Inter</a
            >, OFL-1.1
          </li>
          <li>
            <a
              id="atkinson"
              href="https://github.com/googlefonts/atkinson-hyperlegible"
              class="cdx-docs-link is-underlined"
              >Atkinson Hyperlegible</a
            >, OFL-1.1
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
