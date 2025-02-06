<script setup>
import "@wikimedia/codex/dist/codex.style.css";
import Logo from "@/assets/home_logo.svg";
import LogoDark from "@/assets/home_logo_dark.svg";
import GuideDialog from "@/components/dialog/guide/index.vue";
import ContributeLanguageDialog from "@/components/dialog/contributionLanguage/index.vue";
import ActivityDialog from "@/components/dialog/activities/index.vue";
import { GetProfile } from "@/api/Home";

import { CdxIcon, CdxLabel, CdxSelect, CdxButton } from "@wikimedia/codex";
import { cdxIconPlay, cdxIconGlobe, cdxIconNext } from "@wikimedia/codex-icons";

import Lightbulb from "@/assets/lightbulb.svg";
import LightbulbDark from "@/assets/lightbulbdark.svg";

import Changes from "@/assets/changes.svg";
import ChangesDark from "@/assets/changesdark.svg";

import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed, onBeforeMount, onMounted, ref, toRaw, watch } from "vue";
import { GetLexemeLanguage, GetActivities } from "@/api/Home";
import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";

import { EndContribution } from "@/api/Session";

const vuex = useStore();

const { cookies } = useCookies();

const { t, locale } = useI18n({ useScope: "global" });

const selection = ref([]);
const isGuide = ref(false);
const isContributeLang = ref(false);
const searchQuery = ref("");
const searchLoading = ref(false);
const activityList = ref([]);

const isActivity = ref(false);
const selectedLang = ref({});
const selectedAct = ref(null);

const router = useRouter();
const emit = defineEmits(["onHint"]);
const props = defineProps({
  data: Object,
});

//vuex
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
const name = computed(() => vuex.getters["profile/name"]);
// const language = computed(() => vuex.getters["profile/language"]);
// const languageCode = computed(() => vuex.getters["profile/language"]);
// const languageName = computed(() => vuex.getters["profile/fullLang"]);
// const languageId = computed(() => vuex.getters["profile/langId"]);
const activityType = computed(() => vuex.getters["profile/contributionType"]);

const fetchProfile = async (lang) => {
  const response = await GetProfile();
  if (response?.statusCode === 200) {
    if (!response?.data?.languageCode) {
      selectedLang.value = {
        full: selection?.value?.find((item) => item.value === lang)?.full,
        value: lang,
        id: selection?.value?.find((item) => item.value === lang)?.id,
      };
    } else {
      selectedLang.value = {
        full: response?.data?.language?.title,
        value: response?.data?.languageCode,
        id: response?.data?.language?.id,
      };
    }

    localStorage.setItem("altFont", response?.data?.isAlternateFont || false);
    selectedAct.value = response?.data?.activityType || "connect";
    vuex.dispatch("profile/addData", response?.data || lang);
    locale.value = response?.data?.displayLanguageCode || lang;
    cookies.set("locale", response?.data?.displayLanguageCode || lang);

    if (response?.data?.displayTheme !== "default") {
      if (response?.data?.displayTheme === "dark") {
        document.documentElement.className = "dark";
        localStorage.setItem("theme", "dark");
      } else if (response?.data?.displayTheme === "light") {
        document.documentElement.className = "light";
        localStorage.setItem("theme", "light");
      }
    } else {
      localStorage.setItem("theme", "auto");

      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.className = "dark";
      } else {
        document.documentElement.className = "";
      }
    }

    vuex.dispatch("profile/changeTheme");

    if (response?.data?.ongoingContribution) {
      EndContribution();
    }
  }
};

const getActivities = async (id) => {
  const response = await GetActivities({ id: id });

  if (response?.statusCode === 200) {
    activityList.value = response?.data?.activities?.map((item) => {
      return item;
    });

    if (activityList.value.find((item) => item.type === activityType.value)) {
      selectedAct.value = activityType.value;
    } else {
      selectedAct.value = activityList?.value?.[0]?.type;
    }
  }
};

const getLexemeLanguage = async (search) => {
  searchLoading.value = true;

  const response = await GetLexemeLanguage({ search: search || "" });
  if (response?.statusCode === 200) {
    selection.value = response?.data?.languages?.map((item) => {
      return {
        label: `${item?.title} (${item?.code})`,
        full: item?.title,
        value: item?.code,
        id: item?.id,
      };
    });

    searchLoading.value = false;
  }
};

onMounted(async () => {
  const lang =
    window?.navigator?.language?.split("-")?.[0] === "en" ||
    window?.navigator?.language?.split("-")?.[0] === "id"
      ? window?.navigator?.language?.split("-")?.[0]
      : "en";

  await vuex.dispatch("profile/setLoadingState");

  await getLexemeLanguage();

  await fetchProfile(lang);

  await vuex.dispatch("profile/setLoadingState");
});

watch(searchQuery, async () => {
  await getLexemeLanguage(searchQuery.value);
});

watch(selectedLang, async () => {
  await getActivities(selectedLang?.value?.id);
});

const gotoSession = async () => {
  await vuex.dispatch("profile/addData", {
    ...vuex.getters["profile/allData"],
    languageCode: selectedLang?.value?.value || "",
  });

  if (selectedAct.value === "connect") {
    await router.push("/session-connect");
  } else {
    await router.push("/session-script");
  }
};

// watch(store, () => {
//   contributeLang.value = store?.language || cookies?.get("locale") || "en";
// });
</script>

<template>
  <div class="flex flex-col items-center w-full text-center">
    <h1
      class="font-[400] text-[28px] p-0 text-black dark:text-[#F8F9FA] mb-[12px] break-normal w-fit leading-[35px]"
    >
      {{ t("home.auth.title") }}, <br />
      {{ name }}!
    </h1>
  </div>

  <div
    class="menu mb-[12px] cursor-pointer w-100"
    tabindex="0"
    @click="isContributeLang = true"
    @keydown.enter="isContributeLang = true"
    @keydown.space="isContributeLang = true"
  >
    <div class="flex align-center justify-between gap-x-[12px]">
      <div class="flex gap-x-[12px]">
        <CdxIcon :icon="cdxIconGlobe" />
        <div class="flex flex-col">
          <CdxLabel class="text-[#202122] dark:text-[#EAECF0]">{{
            t("contributionLangDialog.title")
          }}</CdxLabel>
          <span class="text-[#54595D] dark:text-[#A2A9B1]"
            >{{ selectedLang?.full }} ({{ selectedLang?.value }})</span
          >
        </div>
      </div>
      <CdxIcon :icon="cdxIconNext" />
    </div>
  </div>

  <div
    class="menu mb-[12px] cursor-pointer w-100"
    @click="isActivity = true"
    @keydown.enter="isActivity = true"
    @keydown.space="isActivity = true"
    tabindex="0"
  >
    <div class="flex align-center justify-between gap-x-[12px]">
      <div class="flex gap-x-[12px]">
        <img
          :src="isThemeDark ? ChangesDark : Changes"
          alt="Changes"
          class="h-[100%]"
        />
        <div class="flex flex-col">
          <CdxLabel class="text-[#202122] dark:text-[#EAECF0]">{{
            t("activityDialog.title")
          }}</CdxLabel>
          <span
            v-if="selectedAct === 'connect'"
            class="text-[#54595D] dark:text-[#A2A9B1]"
            >{{ t("activityDialog.connect.title") }}</span
          >
          <span
            v-else-if="selectedAct === 'script'"
            class="text-[#54595D] dark:text-[#A2A9B1]"
            >{{ t("activityDialog.script.title") }}</span
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
    class="w-full flex flex-col min-[616px]:gap-x-[12px] gap-y-[12px] items-center justify-center"
  >
    <CdxButton
      weight="primary"
      action="progressive"
      class="w-full py-[5px] max-w-[unset] rounded-[2px] h-[44px]"
      @click="gotoSession"
    >
      <CdxIcon :icon="cdxIconPlay" /> {{ t("home.auth.start") }}</CdxButton
    >
    <a
      href="https://www.wikidata.org/wiki/Wikidata:Lexica#How_to_use"
      class="w-100"
      tabindex="-1"
    >
      <CdxButton class="w-100 py-[5px] max-w-[unset] rounded-[2px] h-[44px]">
        <img :src="isThemeDark ? LightbulbDark : Lightbulb" alt="Lightbulb" />
        {{ t("home.auth.tutorial") }}</CdxButton
      >
    </a>
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
    :defaultLang="selectedLang"
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

  <ActivityDialog
    :open="isActivity"
    :options="activityList"
    @onClose="
      () => {
        isActivity = false;
      }
    "
    @applyActivity="
      (value) => {
        selectedAct = value;
        isActivity = false;
      }
    "
    :defaultValue="selectedAct"
  />
</template>

<style>
.cont-lang .cdx-menu-item {
  border: none;
  color: white;
}

.menu {
  @apply border border-[var(--border-color-base)] rounded-[2px] p-[12px];
}
</style>
