<script setup>
import {
  CdxDialog,
  CdxLabel,
  CdxButton,
  CdxIcon,
  CdxRadio,
  CdxField,
  CdxSearchInput,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { computed, ref, watch } from "vue";

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

const search = ref("");

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

const radios = computed(() => {
  return !search.value ? displayLang.lang : displayLang.lang.filter(item => item.label.toLowerCase().includes(search.value.toLocaleLowerCase()))
});

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

const onInput = (e) => {
  search.value = e.target.value
}
</script>

<template>
  <div>
    <CdxDialog :open="open" title="Save changes" close-button-label="Close" @update:open="close" :class="[
      'rounded-[0.1250rem] max-w-[32rem] min-w-[18rem] w-100 mx-[1rem] locale',
    ]">
      <template #header>
        <div class="w-full">
          <div class="w-full flex flex-col gap-y-[var(--spacing-100)]">
            <div class="flex w-full justify-between items-center">
              <CdxLabel class="text-[1.125rem]">{{
                t("localeDialog.title")
              }}</CdxLabel>
              <CdxButton :aria-label="t('aria.close')" @click="close" weight="quiet">
                <CdxIcon :icon="cdxIconClose" dir="rtl" class="cursor-pointer" />
              </CdxButton>
            </div>
            <div class="relative">
              <CdxSearchInput clearable="true" :placeholder="t('contributionLangDialog.placeholder')" class="relative"
                v-model="search" @input="onInput" />
            </div>
          </div>
        </div>
      </template>
      <div class="w-full px-[var(--spacing-150)] py-[var(--spacing-50)]"
        style="max-height: calc(100vh - 360px); min-height: 16rem;">
        <CdxField :is-fieldset="true" v-if="radios.length > 0">
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

        <div v-else>
          <CdxLabel class="text-[#D73333] dark:text-[#FD7865]">{{
            t("contributionLangDialog.emptySearch1")
          }}</CdxLabel>
          <CdxLabel class="text-[#D73333] dark:text-[#FD7865]">{{
            t("contributionLangDialog.emptySearch2")
          }}</CdxLabel>
        </div>
      </div>
      <template #footer>
        <p class="text-[var(--color-subtle)] text-[14px] ">{{ t('localeDialog.footerText') }} <a
            href="https://translatewiki.net/wiki/Translating:Lexica" target="_blank"
            class="text-[var(--color-progressive)]">{{
              t('localeDialog.footerLink') }}</a></p>
        <div class="flex gap-x-[0.75rem] w-full justify-end mt-[var(--spacing-50)]">
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
  padding-top: var(--spacing-125) !important;
  padding-bottom: var(--spacing-75) !important;
  padding-left: var(--spacing-150) !important;
  padding-right: var(--spacing-150) !important;
  border-bottom: 1px solid var(--border-color-subtle) !important;
}

[dir] .locale .cdx-dialog--dividers .cdx-dialog__header {
  border-bottom: 1px solid var(--border-color-subtle) !important;
}

.locale .cdx-dialog__footer {
  padding: var(--spacing-125) var(--spacing-150) var(--spacing-150) !important;
  border-top: 1px solid var(--border-color-subtle) !important;
}
</style>
