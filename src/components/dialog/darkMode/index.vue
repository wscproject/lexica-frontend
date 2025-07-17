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
import { useI18n } from "vue-i18n";
import { computed, onMounted, ref, watch } from "vue";
import { useMediaQuery } from "@vueuse/core";
import { updateUserPreference } from "@/api/Home";
import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";

const vuex = useStore();
const { cookies } = useCookies();

const currTheme = ref();

const { t, locale } = useI18n({ useScope: "global" });

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

onMounted(() => {
  currTheme.value =
    localStorage.getItem("theme") === "auto" || !localStorage.getItem("theme")
      ? "auto"
      : localStorage.getItem("theme");
});

const emit = defineEmits(["onPrimaryAction"]);

const close = () => {
  emit("onPrimaryAction", false);
};

const light = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.replace("dark", "light");
  } else {
    document.documentElement.classList.add("light");
  }
  localStorage.setItem("theme", "light");
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", "#FFFFFF");

  vuex.dispatch("profile/changeTheme");
};

const dark = () => {
  if (document.documentElement.classList.contains("light")) {
    document.documentElement.classList.replace("light", "dark");
  } else {
    document.documentElement.classList.add("dark");
  }
  localStorage.setItem("theme", "dark");
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", "#101418");

  vuex.dispatch("profile/changeTheme");
};

const auto = () => {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    if (document.documentElement.classList.contains("light")) {
      document.documentElement.classList.replace("light", "dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "#101418");
  } else {
    if (document.documentElement.classList.contains("light")) {
      document.documentElement.classList.remove("light");
    } else if (document.documentElement.classList.contains("light")) {
      document.documentElement.classList.remove("dark");
    }
    document
      .querySelector('meta[name="theme-color"]')
      .setAttribute("content", "#FFFFFF");
  }
  localStorage.setItem("theme", "auto");

  vuex.dispatch("profile/changeTheme");
};

const menus = computed(() => {
  return [
    {
      label: t("darkmodeDialog.auto"),
      value: "auto",
      description: t("darkmodeDialog.desc"),
    },
    {
      label: t("darkmodeDialog.light"),
      value: "light",
    },
    {
      label: t("darkmodeDialog.dark"),
      value: "dark",
    },
  ];
});

const applyTheme = async () => {
  if (cookies.get("auth")) {
    await updateUserPreference({
      displayTheme: currTheme.value === "auto" ? "default" : currTheme.value,
    });
  }

  if (currTheme.value === "light") {
    light();
    close();
  } else if (currTheme.value === "dark") {
    dark();
    close();
  } else {
    auto();
    close();
  }
};
</script>

<template>
  <div>
    <CdxDialog :open="props.open" title="Save changes" close-button-label="Close" @update:open="close" :class="[
      'rounded-[0.1250rem] max-w-[32rem] min-w-[18rem] w-100 mx-[1rem]',
    ]">
      <template #header>
        <div class="w-full">
          <div class="w-full">
            <div class="flex w-full justify-between items-center">
              <CdxLabel class="text-[1.125rem]">{{
                t("darkmodeDialog.title")
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
          <CdxRadio @keydown.enter="applyTheme" v-for="menu in menus" :key="locale" v-model="currTheme"
            name="radio-group" :input-value="menu.value">
            {{ menu.label }}

            <template #description>
              {{ menu.description }}
            </template>
          </CdxRadio>
        </CdxField>

      </div>
      <template #footer>
        <div class="flex gap-x-[0.75rem] w-full justify-end">
          <CdxButton class="w-fit h-[2.125rem]" @click="close">{{
            t("darkmodeDialog.cancel")
          }}</CdxButton>
          <CdxButton :class="['h-[2.125rem]', 'w-fit']" weight="primary" action="progressive" @click="applyTheme">
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
  /* padding: 1rem 1rem !important;
  border: 0 !important; */
}
</style>
