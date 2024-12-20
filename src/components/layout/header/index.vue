<script setup>
import Logo from "@/assets/lexica_logo.svg";
import LogoDark from "@/assets/lexica_logo_dark.svg";

import ButtonIcon from "@/components/buttons/ButtonIcon/index.vue";
import { onMounted, ref, watch, toRaw, computed } from "vue";
import { useCookies } from "vue3-cookies";
import { CdxIcon, CdxButton, CdxMenuButton, CdxLabel } from "@wikimedia/codex";
import {
  cdxIconUserAvatar,
  cdxIconLogOut,
  cdxIconLogIn,
  cdxIconLanguage,
  cdxIconBright,
  cdxIconMoon,
} from "@wikimedia/codex-icons";
import ChooseLocale from "@/components/dialog/localization/index.vue";
import ChooseTheme from "@/components/dialog/darkMode/index.vue";

import { useI18n } from "vue-i18n";
import { useMediaQuery } from "@vueuse/core";
import { useStore } from "vuex";

const { t, locale } = useI18n({ useScope: "global" });

const vuex = useStore();

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const { cookies } = useCookies();
const selection = ref(null);
const loginUrl = import.meta.env.VITE_LOGIN_URL;
const changeLanguage = ref(false);
const changeTheme = ref(false);
const unauthClass = ref("");
const authClass = ref("");

const isAuth = ref(null);

const emit = defineEmits(["logout"]);
const props = defineProps({
  isLogout: Boolean,
});

const storeTheme = ref();

const unauthMenu = computed(() => {
  return [
    {
      label: t("header.menu.login"),
      value: "login",
      icon: cdxIconLogIn,
      url: loginUrl,
    },
    {
      label: t("header.menu.theme"),
      value: "theme",
      icon: vuex.getters["profile/isDark"] ? cdxIconMoon : cdxIconBright,
      description:
        storeTheme.value === "auto" || !storeTheme.value
          ? t("header.menu.auto")
          : vuex.getters["profile/isDark"]
          ? t("header.menu.dark")
          : t("header.menu.light"),
    },
    {
      label: t("header.menu.locale"),
      value: "locale",
      icon: cdxIconLanguage,
      description: t("header.menu.language"),
    },
  ];
});
const authMenu = computed(() => {
  return [
    {
      label: vuex.getters["profile/name"],
      value: "user",
      icon: cdxIconUserAvatar,
      action: "progressive",
      disabled: true,
    },
    {
      label: t("header.menu.theme"),
      value: "theme",
      icon: vuex.getters["profile/isDark"] ? cdxIconMoon : cdxIconBright,
      description:
        storeTheme.value === "auto"
          ? t("header.menu.auto")
          : vuex.getters["profile/isDark"]
          ? t("header.menu.dark")
          : t("header.menu.light"),
    },
    {
      label: t("header.menu.locale"),
      value: "locale",
      icon: cdxIconLanguage,
      description: t("header.menu.language"),
    },
    { label: t("header.menu.logout"), value: "logout", icon: cdxIconLogOut },
  ];
});

watch(changeTheme, () => {
  storeTheme.value = localStorage.getItem("theme");
});

onMounted(() => {
  isAuth.value = cookies.get("auth");

  storeTheme.value = localStorage.getItem("theme");

  if (vuex.getters["profile/isDark"]) {
    unauthClass.value = "unauth-dark";
    authClass.value = "first-child-dark";
  } else {
    unauthClass.value = "unauth";
    authClass.value = "first-child";
  }
});

const onSelect = (newSelection) => {
  switch (newSelection) {
    case "logout":
      emit("logout");
      break;
    case "locale":
      changeLanguage.value = true;
      break;

    case "theme":
      changeTheme.value = true;
      break;

    default:
      break;
  }
};

watch(isThemeDark, () => {
  if (vuex.getters["profile/isDark"]) {
    unauthClass.value = "unauth-dark";
    authClass.value = "first-child-dark";
  } else {
    unauthClass.value = "unauth";
    authClass.value = "first-child";
  }
});
</script>

<template>
  <header
    class="h-[64px] fixed w-full bg-white dark:bg-[#101418] left-0 z-[10] flex justify-center breakpoints"
  >
    <div class="flex items-center max-w-[908px] w-full relative">
      <div class="flex justify-center items-center h-full">
        <img v-if="!isThemeDark" :src="Logo" alt="lexica_logo" />
        <img v-else :src="LogoDark" alt="lexica_logo" />
      </div>
      <div class="absolute right-[0px] edited">
        <CdxMenuButton
          :key="locale"
          top-right
          v-tooltip:bottom="t('tooltips.account')"
          v-model="selection"
          :menu-items="isAuth && !props.isLogout ? authMenu : unauthMenu"
          :class="[
            'z-[5] top-[58px] p-[4px]',
            isAuth && !props.isLogout ? authClass : unauthClass,
            'dark:text-[#fff]',
          ]"
          @update:selected="onSelect"
        >
          <cdx-icon :icon="cdxIconUserAvatar" />
        </CdxMenuButton>

        <ChooseLocale
          :open="changeLanguage"
          @onPrimaryAction="changeLanguage = false"
        />

        <ChooseTheme
          :open="changeTheme"
          @onPrimaryAction="changeTheme = false"
        />
      </div>
    </div>
  </header>
</template>

<style>
.edited .cdx-menu {
  right: unset !important;
  left: 0px !important;
  transform: translate(-212px, 4px) !important;
}
.home-button:active {
  border-radius: 2px !important;
  border-color: #72777d !important;
  border: 1px solid;
  background: #eaecf0 !important;
}

/* .active {
  border-radius: 2px !important;
  border-color: #72777d !important;
  border: 1px solid;
  background: #eaecf0 !important;
} */
.dropdown-content {
  position: absolute;
  right: 4px;
  top: 58px;
  border-radius: 2px;
  background-color: white;
  min-width: 288px;
  border: 1px solid #a2a9b1;
  z-index: 9999;
  padding: 8px 0;

  flex-direction: column;
  row-gap: 24px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
}

.cdx-menu {
  top: 4px !important;
}

.cdx-menu-button__menu-wrapper {
  z-index: 9999 !important;
}

.cdx-menu ul {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.cdx-toggle-button {
  padding: 12px !important;
}

.first-child .cdx-menu-item:first-child {
  font-weight: bold;
}

.first-child-dark .cdx-menu-item--disabled:first-child {
  color: #202122 !important;
}

.unauth .cdx-menu-item:first-child bdi {
  color: #202122 !important;
}

.unauth .cdx-menu-item:first-child svg {
  color: #202122 !important;
}

.first-child .cdx-menu-item--disabled:first-child {
  color: #202122 !important;
}

.unauth-dark .cdx-menu-item:first-child bdi {
  color: #eaecf0 !important;
}

.unauth-dark .cdx-menu-item:first-child svg {
  color: #eaecf0 !important;
}

.first-child-dark .cdx-menu-item--disabled:first-child {
  color: #eaecf0 !important;
}

.first-child-dark .cdx-menu-item {
  border-bottom: 1px solid #72777d;
}

.first-child .cdx-menu-item {
  border-bottom: 1px solid #a2a9b1;
}

.unauth-dark .cdx-menu-item {
  border-bottom: 1px solid #72777d;
}
.unauth .cdx-menu-item {
  border-bottom: 1px solid #a2a9b1;
}

.cdx-menu-item:nth-child(2) {
  border-bottom: unset;
}

.cdx-menu-item:last-child {
  border-bottom: unset;
}
</style>
