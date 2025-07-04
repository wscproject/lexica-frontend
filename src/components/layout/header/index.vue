<script setup>
import Logo from "@/assets/lexica_logo.svg";
import LogoDark from "@/assets/lexica_logo_dark.svg";

import ButtonIcon from "@/components/buttons/ButtonIcon/index.vue";
import { onMounted, ref, watch, toRaw, computed } from "vue";
import { useCookies } from "vue3-cookies";
import {
  CdxIcon,
  CdxButton,
  CdxMenuButton,
  CdxLabel,
  CdxMenuItem,
} from "@wikimedia/codex";
import {
  cdxIconUserAvatar,
  cdxIconLogOut,
  cdxIconLogIn,
  cdxIconLanguage,
  cdxIconBright,
  cdxIconMoon,
} from "@wikimedia/codex-icons";
import accIconDark from "@/assets/accessibility-dark.svg";
import accIcon from "@/assets/accessibility.svg";

import ChooseLocale from "@/components/dialog/localization/index.vue";
import ChooseTheme from "@/components/dialog/darkMode/index.vue";
import ChooseAccessibility from "@/components/dialog/accessibility/index.vue";

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
const changeAccessibility = ref(false);
const unauthClass = ref("");
const authClass = ref("");

const isAuth = ref(null);

const emit = defineEmits(["logout"]);
const props = defineProps({
  isLogout: Boolean,
});

const storeTheme = ref();

const authMenu = computed(() => {
  if (!isAuth.value && !props.isLogout) {
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
  }

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
    {
      label: t("header.menu.accessibility"),
      value: "accessibility",
      icon: vuex.getters["profile/isDark"] ? accIconDark : accIcon,
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
    case "login":
      window.location.href = loginUrl;
      break;
    case "accessibility":
      changeAccessibility.value = true;
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
  <header class="h-[4rem] fixed w-full bg-white dark:bg-[#101418] left-0 z-[10] flex justify-center breakpoints">
    <div class="flex items-center justify-between max-w-[56.75rem] w-full relative">
      <div class="flex justify-center items-center h-full">
        <img v-if="!isThemeDark" :src="Logo" alt="Lexica logo" />
        <img v-else :src="LogoDark" alt="Lexica logo" />
      </div>
      <div>
        <CdxMenuButton :key="locale" :aria-label="t('aria.account')" top-left v-tooltip:bottom="t('tooltips.account')"
          v-model="selection" :menu-items="authMenu" :class="[
            'z-[5] top-[3.625rem] p-[0.2500rem]',
            isAuth && !props.isLogout ? authClass : unauthClass,
            'dark:text-[#fff]',
          ]" @update:selected="onSelect">
          <cdx-icon :icon="cdxIconUserAvatar" />
          <template #menu-item="{ menuItem }">
            <div class="flex gap-x-[var(--spacing-50)]" @click="onSelect(menuItem.value)">
              <CdxIcon v-if="menuItem.value !== 'accessibility'" :icon="menuItem.icon" :class="[
                menuItem.value !== 'user' && 'text-[var(--color-subtle)]',
              ]" />
              <img v-if="menuItem.value === 'accessibility'" :src="menuItem.icon" />

              <div>
                <div :class="[
                  'cdx-menu-item__label text-[var(--color-base)]',
                  menuItem.value === 'user' && 'font-bold',
                ]">
                  <bdi>{{ menuItem.label }}</bdi>
                </div>
                <div class="cdx-menu-item__description text-[var(--color-subtle)]">
                  {{ menuItem.description }}
                </div>
              </div>
            </div>
          </template>
        </CdxMenuButton>

        <ChooseLocale :open="changeLanguage" @onPrimaryAction="changeLanguage = false" />

        <ChooseTheme :open="changeTheme" @onPrimaryAction="changeTheme = false" />

        <ChooseAccessibility :open="changeAccessibility" @onPrimaryAction="changeAccessibility = false" />
      </div>
    </div>
  </header>
</template>

<style>
.edited .cdx-menu {
  right: unset !important;
  left: 0px !important;
  transform: translate(-13.25rem, 0.25rem) !important;
}

.home-button:active {
  border-radius: 0.125rem !important;
  border-color: #72777d !important;
  border: 1px solid;
  background: #eaecf0 !important;
}

/* .active {
  border-radius: 0.125rem !important;
  border-color: #72777d !important;
  border: 1px solid;
  background: #eaecf0 !important;
} */
.dropdown-content {
  position: absolute;
  right: 0.25rem;
  top: 3.625rem;
  border-radius: 0.125rem;
  background-color: white;
  min-width: 288px;
  border: 1px solid #a2a9b1;
  z-index: 9999;
  padding: 8px 0;

  flex-direction: column;
  row-gap: 1.5rem;
  box-shadow: 0px 0.125rem 0.125rem 0px rgba(0, 0, 0, 0.2);
}

.cdx-menu {
  top: 0.25rem !important;
}

.cdx-menu-button__menu-wrapper {
  z-index: 9999 !important;
}

.cdx-menu ul {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.cdx-toggle-button {
  padding: 0.75rem !important;
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

.cdx-menu-item:nth-child(3) {
  border-bottom: unset;
}

.cdx-menu-item:last-child {
  border-bottom: unset;
}
</style>
