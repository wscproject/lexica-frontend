<script setup>
import displayLang from "@/locale/displayLang.json";

import GuideDialog from "@/components/dialog/guide/index.vue";
import ContributeLanguageDialog from "@/components/dialog/contributionLanguage/index.vue";
import ActivityDialog from "@/components/dialog/activities/index.vue";
import { GetProfile } from "@/api/Home";
import { useDirWatcher } from "@/helper/useDirWatcher";

import { CdxIcon, CdxLabel, CdxButton } from "@wikimedia/codex";
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
import { usePreferredReducedMotion, useTextDirection } from "@vueuse/core";
import { useHtmlHasClass } from "@/helper/hasClass";

const vuex = useStore();

const { cookies } = useCookies();

const { t, locale } = useI18n({ useScope: "global" });
const isReducedMotion = usePreferredReducedMotion();
const { hasClass } = useHtmlHasClass("reduced-motion");

const selection = ref([]);
const isContributeLang = ref(false);
const searchQuery = ref("");
const searchLoading = ref(false);
const activityList = ref([]);
const dir = useTextDirection();

//this one is for the render. useTextDirection for some reason does not update when there is changes
const { dir: currDir } = useDirWatcher();

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
const activityType = computed(() => vuex.getters["profile/contributionType"]);

/**
 * Fetches user profile data and applies user preferences
 * @param {string} lang - The language code to use as fallback
 * @description Retrieves user profile, sets language/theme preferences, and applies accessibility settings
 * @see {@link ./DOCS.md#fetchProfile-conditionals} For detailed conditional logic breakdown
 */
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
    localStorage.setItem("bold", response?.data?.isBold || false);
    localStorage.setItem("underline", response?.data?.isUnderline || false);

    if (!localStorage.getItem("reduceMotion")) {
      if (isReducedMotion.value === "reduce") {
        localStorage.setItem("reduceMotion", "true");
      } else {
        localStorage.setItem("reduceMotion", response?.data?.isReducedMotion);
      }
    }

    const links = document.querySelectorAll("a");
    if (response?.data?.isUnderline) {
      links.forEach((link) => {
        link.style.textDecoration = "underline";
      });
    } else {
      links.forEach((link) => {
        link.style.textDecoration = "none";
      });
    }

    if (!localStorage.getItem("altFont")) {
      if (response?.data?.isAlternateFont) {
        if (response?.data?.isBold) {
          document.documentElement.style.setProperty(
            "--font-family",
            "AtkinsonBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
          );
        } else {
          document.documentElement.style.setProperty(
            "--font-family",
            "Atkinson, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
          );
        }
      } else {
        if (response?.data?.isBold) {
          document.documentElement.style.setProperty(
            "--font-family",
            "InterBold, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
          );
        } else {
          document.documentElement.style.setProperty(
            "--font-family",
            "Inter, NotoSansSundanese, NotoSansBalinese, NotoSansArabic, NotoSansHebrew, NotoSansJP, NotoSansKR, NotoSansSC, NotoSansTC, NotoSansThai, system-ui, Avenir, Helvetica, Arial, sans-serif"
          );
        }
      }
    }

    selectedAct.value = response?.data?.activityType || "connect";
    vuex.dispatch("profile/addData", response?.data || lang);
    locale.value = response?.data?.displayLanguageCode || lang;
    dir.value = displayLang.lang.find(
      (item) => item.value === (response?.data?.displayLanguageCode || lang)
    )?.dir;

    cookies.set(
      "dir",
      displayLang.lang.find(
        (item) => item.value === (response?.data?.displayLanguageCode || lang)
      )?.dir
    );

    cookies.set("locale", response?.data?.displayLanguageCode || lang);

    if (response?.data?.displayTheme !== "default") {
      if (response?.data?.displayTheme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else if (response?.data?.displayTheme === "light") {
        document.documentElement.classList.add("light");
        localStorage.setItem("theme", "light");
      }
    } else {
      localStorage.setItem("theme", "auto");

      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("light");
        } else if (document.documentElement.classList.contains("light")) {
          document.documentElement.classList.remove("dark");
        }
      }
    }

    vuex.dispatch("profile/changeTheme");

    if (response?.data?.ongoingContribution) {
      EndContribution();
    }
  }
};

/**
 * Fetches available activities for a specific language
 * @param {number} id - The language ID to fetch activities for
 * @description Retrieves and sets available contribution activities for the selected language
 * @see {@link ./DOCS.md#getActivities} For detailed documentation
 */
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

/**
 * Fetches available lexeme languages with optional search filter
 * @param {string} search - Optional search query to filter languages
 * @description Retrieves list of available languages for lexeme contribution
 * @see {@link ./DOCS.md#getLexemeLanguage} For detailed documentation
 */
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

/**
 * Component lifecycle hook - initializes component data on mount
 * @description Sets up default language, fetches profile and language data
 * @see {@link ./DOCS.md#onMounted} For detailed documentation
 */
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

/**
 * Watcher for search query changes
 * @description Triggers language search when search query changes
 * @see {@link ./DOCS.md#searchQuery-watcher} For detailed documentation
 */
watch(searchQuery, async () => {
  await getLexemeLanguage(searchQuery.value);
});

/**
 * Watcher for selected language changes
 * @description Fetches activities when language selection changes
 * @see {@link ./DOCS.md#selectedLang-watcher} For detailed documentation
 */
watch(selectedLang, async () => {
  await getActivities(selectedLang?.value?.id);
});

/**
 * Navigates to the appropriate session page based on selected activity
 * @description Updates store with current selections and routes to session page
 * @see {@link ./DOCS.md#gotoSession} For detailed documentation
 */
const gotoSession = async () => {
  await vuex.dispatch("profile/addData", {
    ...vuex.getters["profile/allData"],
    languageCode: selectedLang?.value?.value || "",
    activityType: selectedAct?.value || "connect",
  });

  if (selectedAct.value === "connect") {
    await router.push("/session-connect");
  } else if (selectedAct.value === "script") {
    await router.push("/session-script");
  } else {
    await router.push("/session-hyphenation");
  }
};

</script>

<template>
  <div class="flex flex-col items-center w-full text-center">
    <h1
      class="font-[400] text-[1.75rem] p-0 text-black dark:text-[#F8F9FA] mb-[0.75rem] break-normal w-fit leading-[2.1875rem]">
      {{ t("home.auth.title") }}, <br />
      {{ name }}!
    </h1>
  </div>

  <div class="menu mb-[0.75rem] cursor-pointer w-100" tabindex="0" @click="isContributeLang = true"
    @keydown.enter="isContributeLang = true" @keydown.space="isContributeLang = true">
    <div class="flex align-center justify-between gap-x-[0.75rem]">
      <div class="flex gap-x-[0.75rem]">
        <CdxIcon :icon="cdxIconGlobe" />
        <div class="flex flex-col">
          <CdxLabel class="text-[#202122] dark:text-[#EAECF0]">{{
            t("contributionLangDialog.title")
          }}</CdxLabel>
          <span class="text-[#54595D] dark:text-[#A2A9B1]">{{ selectedLang?.full }} ({{ selectedLang?.value }})</span>
        </div>
      </div>
      <CdxIcon :dir="currDir" :icon="cdxIconNext" />
    </div>
  </div>

  <div class="menu mb-[0.75rem] cursor-pointer w-100" @click="isActivity = true" @keydown.enter="isActivity = true"
    @keydown.space="isActivity = true" tabindex="0">
    <div class="flex align-center justify-between gap-x-[0.75rem]">
      <div class="flex gap-x-[0.75rem]">
        <img :src="isThemeDark ? ChangesDark : Changes" alt="Changes" class="h-[100%]" />
        <div class="flex flex-col">
          <CdxLabel class="text-[#202122] dark:text-[#EAECF0]">{{
            t("activityDialog.title")
          }}</CdxLabel>
          <span v-if="selectedAct === 'connect'" class="text-[#54595D] dark:text-[#A2A9B1]">{{
            t("activityDialog.connect.title") }}</span>
          <span v-else-if="selectedAct === 'script'" class="text-[#54595D] dark:text-[#A2A9B1]">{{
            t("activityDialog.script.title") }}</span>
          <span v-else-if="selectedAct === 'hyphenation'" class="text-[#54595D] dark:text-[#A2A9B1]">{{
            t("activityDialog.hyphenation.title") }}</span>
        </div>
      </div>
      <CdxIcon :dir="currDir" :icon="cdxIconNext" />
    </div>
  </div>

  <!-- <div
    class="text-[1rem] pt-[1.5rem] pb-[0.75rem] font-[700] text-black dark:text-white text-left w-100"
  >
    <span>{{ t("home.auth.languageSelect") }}</span>
  </div>
  <div class="text-[1rem] pb-[1.5rem] w-full">
    <CdxSelect
      v-model:selected="contributeLang"
      class="w-full cont-lang"
      :menuItems="selection"
      selected="id"
      :menu-config="{ visibleItemLimit: 5 }"
    />
  </div> -->

  <!-- <div class="flex gap-x-2 pb-[1.5rem]">
      <CdxIcon :icon="cdxIconInfoFilled" />
      <CdxLabel
        >Untuk sementara, Lexica hanya tersedia untuk leksem Bahasa
        Indonesia.</CdxLabel
      >
    </div> -->

  <div class="w-full flex flex-col min-[616px]:gap-x-[0.75rem] gap-y-[0.75rem] items-center justify-center">
    <CdxButton weight="primary" action="progressive"
      class="w-full py-[0.3125rem] max-w-[unset] rounded-[0.1250rem] h-[2.75rem]" @click="gotoSession">
      <CdxIcon :icon="cdxIconPlay" /> {{ t("home.auth.start") }}
    </CdxButton>
    <a href="https://www.wikidata.org/wiki/Wikidata:Lexica#How_to_use" class="w-100" tabindex="-1">
      <CdxButton class="w-100 py-[0.3125rem] max-w-[unset] rounded-[0.1250rem] h-[2.75rem]">
        <img :src="isThemeDark ? LightbulbDark : Lightbulb" alt="Lightbulb" />
        {{ t("home.auth.tutorial") }}
      </CdxButton>
    </a>
  </div>

  <GuideDialog :open="isGuide" @onPrimaryAction="isGuide = false" @toSession="gotoSession" />

  <ContributeLanguageDialog :open="isContributeLang" :options="selection" :searchLoading="searchLoading"
    :defaultLang="selectedLang" @onClose="
      () => {
        searchQuery = '';
        isContributeLang = false;
      }
    " @setSearch="
      (search) => {
        searchQuery = search;
      }
    " @applyLanguage="
      (value) => {
        selectedLang = value;
      }
    " />

  <ActivityDialog :open="isActivity" :options="activityList" @onClose="
    () => {
      isActivity = false;
    }
  " @applyActivity="
    (value) => {
      selectedAct = value;
      isActivity = false;
    }
  " :defaultValue="selectedAct" />
</template>

<style>
.cont-lang .cdx-menu-item {
  border: none;
  color: white;
}

.menu {
  @apply border border-[var(--border-color-base)] rounded-[0.1250rem] p-[0.75rem];
}
</style>
