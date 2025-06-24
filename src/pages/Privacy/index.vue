<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconArrowPrevious } from "@wikimedia/codex-icons";
import { useRouter } from "vue-router";
import { useI18n, I18nT } from "vue-i18n";
import { onBeforeUnmount, onMounted } from "vue";

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

const toPolicy = (event) => {
  if (event.code === "Space") {
    event.preventDefault(); // Prevent default scrolling behavior
    window.location.href =
      "https://foundation.wikimedia.org/wiki/Privacy_policy";
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
  const linklicense = document.querySelector("#license");

  linkPrivacy.addEventListener("keydown", toPolicy);
  linklicense.addEventListener("keydown", toLicense);
});

onBeforeUnmount(() => {
  const linkPrivacy = document.querySelector("#privacy-policy");
  const linklicense = document.querySelector("#license");

  linkPrivacy.removeEventListener("keydown", toPolicy);
  linklicense.removeEventListener("keydown", toLicense);
});
</script>

<template>
  <div id="yes" class="min-h-screen flex flex-col bg-[var(--background-color-base)] text-[#54595D] dark:text-[#A2A9B1]">
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
          <h1 class="p-0 text-[1.75rem] leading-[2.1875rem] pb-[0.5rem] text-[var(--color-emphasized)]">
            {{ t("privacy.title1") }}
          </h1>
        </div>
        <p class="p-0 text-[1rem] text-[var(--color-base)]">
          {{ t("privacy.section1") }}
        </p>
        <div class="border-b border-[#C8CCD1] mb-[0.75rem] mt-[1.5rem] dark:border-[#72777D]">
          <h2 class="p-0 text-[1.5rem] leading-[2.1875rem] pb-[0.5rem] text-[var(--color-emphasized)]">
            {{ t("privacy.title2") }}
          </h2>
        </div>
        <ul class="text-[var(--color-base)]">
          <li>
            {{ t("privacy.section2.point1") }}
          </li>
          <li>
            {{ t("privacy.section2.point2") }}
          </li>
          <I18nT keypath="privacy.section2.point3" tag="li">
            <template #privacy>
              <a id="privacy-policy" class="cdx-docs-link "
                href="https://foundation.wikimedia.org/wiki/Policy:Privacy_policy">
                {{ t("privacy.section2.privacy") }}</a>.
            </template>
          </I18nT>
        </ul>
        <div class="border-b border-[#C8CCD1] mb-[0.75rem] mt-[1.5rem] dark:border-[#72777D]">
          <h2 class="p-0 text-[1.5rem] leading-[2.1875rem] pb-[0.5rem] text-[var(--color-emphasized)]">
            {{ t("privacy.title3") }}
          </h2>
        </div>

        <I18nT keypath="privacy.section3" tag="p" class="text-[var(--color-base)]">
          <template #license>
            <a id="license" class="cdx-docs-link " href="/license-list">
              {{ t("privacy.license") }}</a>
          </template>
        </I18nT>

        <div class="border-b border-[#C8CCD1] mb-[0.75rem] mt-[1.5rem] dark:border-[#72777D]">
          <h2 class="p-0 text-[1.5rem] leading-[2.1875rem] pb-[0.5rem] text-[var(--color-emphasized)]">
            {{ t("privacy.title4") }}
          </h2>
        </div>
        <ul class="text-[var(--color-base)]">
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
