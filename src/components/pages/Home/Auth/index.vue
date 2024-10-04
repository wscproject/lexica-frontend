<script setup>
import "@wikimedia/codex/dist/codex.style.css";
import Logo from "@/assets/home_logo.svg";
import LogoDark from "@/assets/home_logo_dark.svg";
import GuideDialog from "@/components/dialog/guide/index.vue";
import ContributeLanguageDialog from "@/components/dialog/contributionLanguage/index.vue";

import { CdxIcon, CdxLabel, CdxSelect, CdxButton } from "@wikimedia/codex";
import { cdxIconPlay, cdxIconGlobe, cdxIconNext } from "@wikimedia/codex-icons";

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
const isGuide = ref(false);
const isContributeLang = ref(false);
const searchQuery = ref("");
const searchLoading = ref(false);

const selectedLang = ref({});

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

const getLexemeLanguage = async (search) => {
  searchLoading.value = true;

  const response = await GetLexemeLanguage({ search: search || "" });
  if (response?.statusCode === 200) {
    selection.value = response?.data?.languages?.map((item) => {
      return {
        label: `${item?.title} (${item?.code})`,
        full: item?.title,
        value: item?.code,
      };
    });

    searchLoading.value = false;
  }
};

onMounted(async () => {
  contributeLang.value = language.value || cookies?.get("locale") || "en";
  await getLexemeLanguage();

  await vuex.dispatch("profile/setLoadingState");
});

watch(searchQuery, async () => {
  await getLexemeLanguage(searchQuery.value);
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
  <div class="flex flex-col items-center w-full">
    <span class="font-[400] text-[28px] p-0 text-black dark:text-[#F8F9FA]">
      {{ t("home.auth.title") }},</span
    >
    <span
      class="mb-[12px] font-[400] text-[28px] p-0 text-black dark:text-[#F8F9FA]"
    >
      {{ name }}!</span
    >
  </div>

  <div class="menu mb-[12px] cursor-pointer" @click="isContributeLang = true">
    <div class="flex align-center justify-between gap-x-[12px]">
      <div class="flex gap-x-[12px]">
        <CdxIcon :icon="cdxIconGlobe" />
        <div class="flex flex-col">
          <CdxLabel class="text-[#202122] dark:text-[#EAECF0]">{{
            t("home.auth.languageSelect")
          }}</CdxLabel>
          <span class="text-[#54595D] dark:text-[#A2A9B1]"
            >{{ selectedLang?.full }} ({{ selectedLang?.value }})</span
          >
        </div>
      </div>
      <CdxIcon :icon="cdxIconNext" />
    </div>
  </div>

  <!-- <div
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
  </div> -->

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
      @click="isGuide = true"
    >
      <img :src="isThemeDark ? LightbulbDark : Lightbulb" alt="Lightbulb" />
      {{ t("home.auth.tutorial") }}</CdxButton
    >
  </div>

  <GuideDialog
    :open="isGuide"
    @onPrimaryAction="isGuide = false"
    @toSession="gotoSession"
  />

  <ContributeLanguageDialog
    :open="isContributeLang"
    :options="selection"
    :searchLoading="searchLoading"
    @onClose="
      () => {
        searchQuery = '';
        isContributeLang = false;
      }
    "
    @setSearch="
      (search) => {
        searchQuery = search;
      }
    "
    @applyLanguage="
      (value) => {
        selectedLang = value;
      }
    "
  />
</template>

<style>
.cont-lang .cdx-menu-item {
  border: none;
  color: white;
}

.menu {
  @apply border border-[#A2A9B1] dark:border-[#72777D] rounded-[2px] p-[12px];
}
</style>
