<script setup>
import {
  CdxDialog,
  CdxLabel,
  CdxButton,
  CdxIcon,
  CdxRadio,
  CdxField,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { ref, watch } from "vue";

import { useI18n } from "vue-i18n";
import { updateUserPreference } from "@/api/Home";
import displayLang from "@/locale/displayLang.json";

import { useCookies } from "vue3-cookies";
import { useTextDirection } from "@vueuse/core";

const { cookies } = useCookies();

const { t, locale } = useI18n();

const currentLocale = ref(
  cookies?.get("locale") || window.navigator.language.split("-")[0]
);

const currentDir = ref("");

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["onPrimaryAction"]);
const dir = useTextDirection();

const close = () => {
  emit("onPrimaryAction", false);
};

const radios = displayLang.lang;

const setLocale = async () => {
  if (!!cookies?.get("auth")) {
    await updateUserPreference({ displayLanguageCode: currentLocale.value });
  }

  locale.value = currentLocale.value;
  dir.value = currentDir.value;
  cookies.set("locale", currentLocale.value);
  cookies.set("dir", currentDir.value);
};

const changeDir = (value) => {
  currentDir.value = value.dir;
};

watch(locale, () => {
  currentLocale.value = cookies?.get("locale") || locale.value;
});
</script>

<template>
  <div>
    <CdxDialog :open="open" title="Save changes" close-button-label="Close" @update:open="close" :class="[
      'rounded-[0.1250rem] max-w-[32rem] min-w-[18rem] w-100 mx-[1rem]',
    ]">
      <template #header>
        <div class="w-full">
          <div class="w-full">
            <div class="flex w-full justify-between items-center">
              <CdxLabel class="text-[1.125rem]">{{
                t("localeDialog.title")
              }}</CdxLabel>
              <CdxButton :aria-label="t('aria.close')" @click="close" weight="quiet">
                <CdxIcon :icon="cdxIconClose" dir="rtl" class="cursor-pointer" />
              </CdxButton>
            </div>
          </div>
        </div>
      </template>
      <div class="w-full px-[var(--spacing-150)]">
        <CdxField :is-fieldset="true">
          <CdxRadio @keydown.enter="
            () => {
              setLocale();
              emit('onPrimaryAction');
            }
          " v-for="radio in radios" :key="'radio-' + radio.value" v-model="currentLocale" name="radio-group"
            :input-value="radio.value" @update:modelValue="changeDir(radio)">
            {{ radio.label }}
          </CdxRadio>
        </CdxField>
      </div>
      <template #footer>
        <div class="flex gap-x-[0.75rem] w-full justify-end">
          <CdxButton class="w-fit h-[2.125rem]" @click="emit('onPrimaryAction')">{{
            t("localeDialog.cancel")
          }}</CdxButton>
          <CdxButton :class="['h-[2.125rem]', 'w-fit']" weight="primary" action="progressive" @click="
            () => {
              setLocale();
              emit('onPrimaryAction');
            }
          ">
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
  padding: 1rem 1rem !important;
  border: 0 !important;
}

.locale .cdx-dialog__footer {
  padding: 1rem 1rem 1.5rem !important;
  border: 0 !important;
}
</style>
