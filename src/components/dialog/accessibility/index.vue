<script setup>
import {
  CdxToggleSwitch,
  CdxDialog,
  CdxIcon,
  CdxButton,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
const { t, locale } = useI18n({ useScope: "global" });

const isBold = ref(false);
const isLexend = ref(false);

const emit = defineEmits(["onPrimaryAction"]);

const close = () => {
  emit("onPrimaryAction", false);
};

const apply = () => {
  console.log(isBold.value);

  if (isBold.value) {
    if (isLexend.value) {
      document.documentElement.style.setProperty(
        "--font-family",
        "LexendBold, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    } else {
      document.documentElement.style.setProperty(
        "--font-family",
        "InterBold, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
      );
    }
  } else {
    if (isLexend.value) {
      document.documentElement.style.setProperty(
        "--font-family",
        "Lexend, NotoSansSundanese, NotoSansBalinese, system-ui, Avenir, Helvetica, Arial, sans-serif"
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
            <CdxLabel class="text-[18px]">Accessibility</CdxLabel>
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
      <h5>Text</h5>
      <CdxToggleSwitch v-model="isBold"> Use bold font </CdxToggleSwitch>
      <CdxToggleSwitch v-model="isLexend">
        Use alternative font
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
