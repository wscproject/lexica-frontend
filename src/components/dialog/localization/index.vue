<script setup>
import {
  CdxDialog,
  CdxLabel,
  CdxButton,
  CdxIcon,
  CdxRadio,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { ref, watch } from "vue";

import { useI18n } from "vue-i18n";
import { updateUserPreference } from "@/api/Home";
import displayLang from "@/locale/displayLang.json";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const { t, locale } = useI18n();

const currentLocale = ref(
  cookies?.get("locale") || window.navigator.language.split("-")[0]
);

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

const radios = displayLang.lang;

const setLocale = async () => {
  if (!!cookies?.get("auth")) {
    await updateUserPreference({ displayLanguageCode: currentLocale.value });
  }

  locale.value = currentLocale.value;
  cookies.set("locale", currentLocale.value);
};

watch(locale, () => {
  currentLocale.value = cookies?.get("locale") || locale.value;
});
</script>

<template>
  <div>
    <CdxDialog
      :open="open"
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
                t("localeDialog.title")
              }}</CdxLabel>
              <CdxButton
                :aria-label="t('aria.close')"
                @click="close"
                weight="quiet"
              >
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
        <CdxRadio
          v-for="radio in radios"
          :key="'radio-' + radio.value"
          v-model="currentLocale"
          name="radio-group"
          :input-value="radio.value"
        >
          {{ radio.label }}
        </CdxRadio>
      </div>
      <template #footer>
        <div class="flex gap-x-[12px] w-full justify-end">
          <CdxButton class="w-fit h-[34px]" @click="emit('onPrimaryAction')">{{
            t("localeDialog.cancel")
          }}</CdxButton>
          <CdxButton
            :class="['h-[34px]', 'w-fit']"
            weight="primary"
            action="progressive"
            @click="
              () => {
                setLocale();
                emit('onPrimaryAction');
              }
            "
          >
            {{ t("localeDialog.apply") }}
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
