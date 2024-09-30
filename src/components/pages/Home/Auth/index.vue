<script setup>
import "@wikimedia/codex/dist/codex.style.css";
import Logo from "@/assets/home_logo.svg";
import LogoDark from "@/assets/home_logo_dark.svg";

import { CdxIcon, CdxLabel, CdxSelect, CdxButton } from "@wikimedia/codex";
import { cdxIconPlay } from "@wikimedia/codex-icons";

import Lightbulb from "@/assets/lightbulb.svg";
import LightbulbDark from "@/assets/lightbulbdark.svg";

import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { GetLexemeLanguage } from "@/api/Home";
import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";

const vuex = useStore();

const { cookies } = useCookies();

const { t } = useI18n({ useScope: "global" });

const selection = ref([]);

const contributeLang = ref();

const router = useRouter();
const emit = defineEmits(["onHint"]);
const props = defineProps({
  data: Object,
});

//vuex
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
const name = computed(() => vuex.getters["profile/name"]);
const language = computed(() => vuex.getters["profile/language"]);

onMounted(async () => {
  contributeLang.value = language.value || cookies?.get("locale") || "en";

  const response = await GetLexemeLanguage();
  if (response?.statusCode === 200) {
    vuex.dispatch("profile/setLoadingState");

    selection.value = response?.data?.languages?.map((item) => {
      return {
        label: `${item?.title} (${item?.code})`,

        value: item?.code,
      };
    });
  }
});

watch(language, () => {
  contributeLang.value = language.value || cookies?.get("locale") || "en";
});

const gotoSession = async () => {
  await vuex.dispatch("profile/addData", {
    ...vuex.getters["profile/allData"],
    language: contributeLang?.value || "",
  });
  await router.push("/session");
};

// watch(store, () => {
//   contributeLang.value = store?.language || cookies?.get("locale") || "en";
// });
</script>

<template>
  <div
    class="flex flex-col items-center border-b-[1px] border-[#C8CCD1] dark:border-[#72777D] w-full"
  >
    <div>
      <img
        v-if="!isThemeDark"
        :src="Logo"
        alt="home_logo"
        class="shrink-0 w-[48px] h-[48px] mb-[8px]"
      />
      <img
        v-else
        :src="LogoDark"
        alt="home_logo"
        class="shrink-0 w-[48px] h-[48px] mb-[8px]"
      />
    </div>
    <CdxLabel class="mb-[12px] text-[18px] p-0 text-black dark:text-white">
      {{ t("home.auth.title") }}, {{ name }}!</CdxLabel
    >
  </div>

  <div
    class="text-[16px] pt-[24px] pb-[12px] font-[700] text-black dark:text-white text-left w-100"
  >
    <span>{{ t("home.auth.languageSelect") }}</span>
  </div>
  <div class="text-[16px] pb-[24px] w-full">
    <CdxSelect
      v-model:selected="contributeLang"
      class="w-full cont-lang"
      :menuItems="selection"
      selected="id"
      :menu-config="{ visibleItemLimit: 5 }"
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
      <img :src="isThemeDark ? LightbulbDark : Lightbulb" alt="Lightbulb" />
      {{ t("home.auth.tutorial") }}</CdxButton
    >
  </div>
</template>

<style>
.cont-lang .cdx-menu-item {
  border: none;
  color: white;
}
</style>
