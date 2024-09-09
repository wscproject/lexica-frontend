<script setup>
import {
  CdxDialog,
  CdxLabel,
  CdxButton,
  CdxIcon,
  CdxRadio,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { useDark, useToggle } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { watch } from "vue";

const { t } = useI18n({ useScope: "global" });

const isDark = useDark();
const toggleDark = useToggle(isDark);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["onPrimaryAction"]);

const close = () => {
  emit("onPrimaryAction", false);
};

watch(props, () => {
  // console.log(isDark.effect.);
  console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);
});

const menu = [];
</script>

<template>
  <div>
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
              <CdxLabel class="text-[18px]">{{
                t("darkmodeDialog.title")
              }}</CdxLabel>
              <CdxButton @click="close" weight="quiet">
                <CdxIcon
                  :icon="cdxIconClose"
                  dir="rtl"
                  class="cursor-pointer"
                />
              </CdxButton>
            </div>
          </div>
        </div>
      </template>
      <div class="w-full px-[16px] py-[12px]">
        <!-- <CdxRadio
          v-for="radio in radios"
          :key="'radio-' + radio.value"
          v-model="currentLocale"
          name="radio-group"
          :input-value="radio.value"
        >
          {{ radio.label }}
        </CdxRadio> -->
      </div>
      <template #footer>
        <div class="flex gap-x-[12px] w-full justify-end">
          <CdxButton class="w-fit h-[34px]" @click="toggleDark()">{{
            t("darkmodeDialog.cancel")
          }}</CdxButton>
          <CdxButton
            :class="['h-[34px]', 'w-fit']"
            weight="primary"
            action="progressive"
          >
            {{ t("darkmodeDialog.apply") }}
          </CdxButton>
        </div>
      </template>
    </CdxDialog>
    <!-- </client-only> -->
  </div>
</template>

<style>
.locale .cdx-dialog__header {
  display: flex !important;
  align-items: center !important;
  padding: 16px 16px !important;
  border: 0 !important;
}

.locale .cdx-dialog__footer {
  padding: 16px 16px 24px !important;
  border: 0 !important;
}
</style>
