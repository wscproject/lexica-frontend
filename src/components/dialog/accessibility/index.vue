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

const isBold = ref(localStorage.getItem("bold") === "true" ? true : false);

const emit = defineEmits(["onPrimaryAction"]);

const close = () => {
  emit("onPrimaryAction", false);
};

const apply = async () => {
  updateUserPreference({
    isAlternateFont: isAlternateFont.value,
    isBold: isBold.value,
  });

  localStorage.setItem("altFont", isAlternateFont.value);
  localStorage.setItem("bold", isBold.value);

  if (isAlternateFont.value) {
    if (isBold.value) {
      document.documentElement.style.setProperty(
        "--font-family",
        "AtkinsonBold, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Atkinson, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  } else {
    if (isBold.value) {
      document.documentElement.style.setProperty(
        "--font-family",
        "InterBold, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "Inter, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  }

  close();
};
</script>

<template>
  <CdxDialog
    :open="props.open"
    title="Save changes"
    close-button-label="Close"
    @update:open="close"
    :class="[
      'locale rounded-[2px] max-w-[512px] min-w-[288px] w-100 mx-[16px]',
    ]"
  >
    <template #header>
      <div class="w-full">
        <div class="w-full">
          <div class="flex w-full justify-between items-center">
            <h4 class="text-[18px] text-[var(--color-base)] font-bold">
              {{ t("accessibilityDialog.title") }}
            </h4>
            <CdxButton
              :aria-label="t('aria.close')"
              @click="close"
              weight="quiet"
            >
              <CdxIcon :icon="cdxIconClose" dir="rtl" class="cursor-pointer" />
            </CdxButton>
          </div>
        </div>
      </div>
    </template>
    <div class="w-full px-[16px] py-[12px]">
      <h4 class="pb-[var(--spacing-50)] text-[var(--color-base)] font-bold">
        {{ t("accessibilityDialog.subtitle") }}
      </h4>
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
      <div class="flex gap-x-[12px] w-full justify-end">
        <CdxButton class="w-fit h-[34px]" @click="close">{{
          t("darkmodeDialog.cancel")
        }}</CdxButton>
        <CdxButton
          :class="['h-[34px]', 'w-fit']"
          weight="primary"
          action="progressive"
          @click="apply"
        >
          {{ t("darkmodeDialog.apply") }}
        </CdxButton>
      </div>
    </template>
  </CdxDialog>
</template>
