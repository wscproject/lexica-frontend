<script setup>
import {
  CdxToggleSwitch,
  CdxDialog,
  CdxIcon,
  CdxButton,
  CdxLabel,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { updateUserPreference } from "@/api/Home";
import { usePreferredReducedMotion } from "@vueuse/core";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
const { t, locale } = useI18n({ useScope: "global" });

const isAlternateFont = ref(
  localStorage.getItem("altFont") === "true" ? true : false
);
const isSystemPreferReduce = usePreferredReducedMotion();

const isBold = ref(localStorage.getItem("bold") === "true" ? true : false);
const isUnderline = ref(
  localStorage.getItem("underline") === "true" ? true : false
);
const isReducedMotion = ref(
  localStorage.getItem("reduceMotion") === "true" ? true : false
);

const emit = defineEmits(["onPrimaryAction"]);

const close = () => {
  emit("onPrimaryAction", false);
};

const loadTheme = (href, name) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.crossOrigin = "anonymous";
  link.href = href;
  link.dataset.theme = name; // tag it so we can find it later
  document.head.appendChild(link);
};

function removeTheme(name) {
  const link = document.querySelector(`link[data-theme="${name}"]`);
  if (link) {
    link.remove();
  }
}

const apply = async () => {
  updateUserPreference({
    isAlternateFont: isAlternateFont.value,
    isBold: isBold.value,
    isUnderline: isUnderline.value,
    isReducedMotion: isReducedMotion.value,
  });

  localStorage.setItem("altFont", isAlternateFont.value);
  localStorage.setItem("bold", isBold.value);
  localStorage.setItem("underline", isUnderline.value);
  localStorage.setItem("reduceMotion", isReducedMotion.value);

  if (isReducedMotion.value) {
    if (isSystemPreferReduce.value === "reduce") {

      loadTheme("/reduce-motion.css", "reduced-motion");
    } else {
      document.documentElement.classList.add("reduced-motion");
    }
  } else {
    if (isSystemPreferReduce.value === "reduce") {
      removeTheme("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  }

  const links = document.querySelectorAll("a");

  if (isUnderline.value) {
    links.forEach((link) => {
      link.style.textDecoration = "underline";
    });
  } else {
    links.forEach((link) => {
      link.style.textDecoration = "none";
    });
  }

  if (isAlternateFont.value) {
    if (isBold.value) {
      document.documentElement.style.setProperty(
        "--font-family",
        "AtkinsonBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Atkinson, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  } else {
    if (isBold.value) {
      document.documentElement.style.setProperty(
        "--font-family",
        "InterBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Inter, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  }

  close();
};
</script>

<template>
  <CdxDialog :open="props.open" title="Save changes" close-button-label="Close" @update:open="close" :class="[
    'locale rounded-[0.1250rem] max-w-[32rem] min-w-[18rem] w-100 mx-[1rem]',
  ]">
    <template #header>
      <div class="w-full">
        <div class="w-full">
          <div class="flex w-full justify-between items-center">
            <h4 class="text-[1.125rem] text-[var(--color-base)] font-bold">
              {{ t("accessibilityDialog.title") }}
            </h4>
            <CdxButton :aria-label="t('aria.close')" @click="close" weight="quiet">
              <CdxIcon :icon="cdxIconClose" dir="rtl" class="cursor-pointer" />
            </CdxButton>
          </div>
        </div>
      </div>
    </template>
    <div class="w-full px-[1rem] py-[0.75rem]">
      <h4 class="pb-[var(--spacing-50)] text-[var(--color-base)] font-bold">
        {{ t("accessibilityDialog.subtitle2") }}
      </h4>
      <CdxToggleSwitch v-model="isReducedMotion" alignSwitch>
        {{ t("accessibilityDialog.option4") }}
        <template #description>
          {{ t("accessibilityDialog.option4Note") }}
        </template>
      </CdxToggleSwitch>
      <h4 class="pb-[var(--spacing-50)] mt-[var(--spacing-100)] text-[var(--color-base)] font-bold">
        {{ t("accessibilityDialog.subtitle1") }}
      </h4>
      <CdxToggleSwitch v-model="isUnderline" alignSwitch>
        {{ t("accessibilityDialog.option3") }}
      </CdxToggleSwitch>
      <CdxToggleSwitch v-model="isBold" alignSwitch>
        {{ t("accessibilityDialog.option1") }}
      </CdxToggleSwitch>
      <CdxToggleSwitch v-model="isAlternateFont" alignSwitch>
        {{ t("accessibilityDialog.option2") }}
        <template #description>
          {{ t("accessibilityDialog.option2Note") }}
        </template>
      </CdxToggleSwitch>
    </div>
    <template #footer>
      <div class="flex gap-x-[0.75rem] w-full justify-end">
        <CdxButton class="w-fit h-[2.125rem]" @click="close">{{
          t("darkmodeDialog.cancel")
        }}</CdxButton>
        <CdxButton :class="['h-[2.125rem]', 'w-fit']" weight="primary" action="progressive" @click="apply">
          {{ t("darkmodeDialog.apply") }}
        </CdxButton>
      </div>
    </template>
  </CdxDialog>
</template>
