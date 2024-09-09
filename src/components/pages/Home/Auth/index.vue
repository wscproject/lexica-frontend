<script setup>
import "@wikimedia/codex/dist/codex.style.css";
import Logo from "@/assets/home_logo.svg";
import { useGeneralStore } from "@/store/general";
import { CdxIcon, CdxLabel, CdxSelect, CdxButton } from "@wikimedia/codex";
import { cdxIconPlay } from "@wikimedia/codex-icons";

import Lightbulb from "@/assets/lightbulb.svg";
import LightbulbDark from "@/assets/lightbulbdark.svg";

import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { onMounted, ref } from "vue";
import { GetLexemeLanguage } from "@/api/Home";
import { useCookies } from "vue3-cookies";
import { useDark } from "@vueuse/core";

const { cookies } = useCookies();

const { t, locale } = useI18n({ useScope: "global" });

const selection = ref([]);

const store = useGeneralStore();

const contributeLang = ref();

const router = useRouter();
const emit = defineEmits(["onHint"]);
const props = defineProps({
  data: Object,
});

const isDark = useDark();

onMounted(async () => {
  contributeLang.value = store?.language || cookies?.get("locale") || "en";
  const response = await GetLexemeLanguage();
  if (response?.statusCode === 200) {
    selection.value = response?.data?.languages?.map((item) => {
      return {
        label: `${item?.title} (${item?.code})`,

        value: item?.code,
      };
    });
  }
});

const gotoSession = async () => {
  await store.setData({ language: contributeLang?.value || "" });
  await router.push("/session");
};

// watch(store, () => {
//   contributeLang.value = store?.language || cookies?.get("locale") || "en";
// });
</script>

<template>
  <div style="color-scheme: dark">
    <div
      class="flex flex-col items-center border-b-[1px] border-[#C8CCD1] mb-[12px]"
    >
      <div class="mt-[12.5px]">
        <img
          :src="Logo"
          alt="home_logo"
          class="shrink-0 w-[48px] h-[48px] mb-[8px]"
        />
      </div>
      <CdxLabel class="mb-[12px] text-[18px] p-0 text-black dark:text-white">
        {{ t("home.auth.title") }}, {{ store.name }}!</CdxLabel
      >
    </div>

    <div class="text-[16px] pb-[12px] font-[700] text-black dark:text-white">
      <span>{{ t("home.auth.languageSelect") }}</span>
    </div>
    <div class="text-[16px] pb-[12px]">
      <CdxSelect
        v-model:selected="contributeLang"
        class="w-full cont-lang"
        :menuItems="selection"
        selected="id"
      />
    </div>

    <!-- <div class="flex gap-x-2 pb-[24px]">
      <CdxIcon :icon="cdxIconInfoFilled" />
      <CdxLabel
        >Untuk sementara, Lexica hanya tersedia untuk leksem Bahasa
        Indonesia.</CdxLabel
      >
    </div> -->

    <div
      class="w-full flex flex-col min-[616px]:flex-row min-[616px]:gap-x-[12px] gap-y-[12px] items-center justify-center"
    >
      <CdxButton
        weight="primary"
        action="progressive"
        class="w-full max-w-[384px] py-[5px] rounded-[2px] h-[44px]"
        @click="gotoSession"
      >
        <CdxIcon :icon="cdxIconPlay" /> {{ t("home.auth.start") }}</CdxButton
      >
      <CdxButton
        class="w-full max-w-[384px] py-[5px] rounded-[2px] h-[44px]"
        @click="emit('onHint')"
      >
        <img :src="isDark ? LightbulbDark : Lightbulb" alt="Lightbulb" />
        {{ t("home.auth.tutorial") }}</CdxButton
      >
    </div>
  </div>
</template>

<style>
.cont-lang .cdx-menu-item {
  border: none;
  color: white;
}
</style>
