<script setup>
import Logo from "@/assets/lexica_logo.svg";
import Login from "@/assets/login.svg";
import ButtonIcon from "@/components/buttons/ButtonIcon/index.vue";
import { onMounted, ref, watch, toRaw, computed } from "vue";
import { useCookies } from "vue3-cookies";
import { CdxIcon, CdxButton, CdxMenuButton, CdxLabel } from "@wikimedia/codex";
import {
  cdxIconUserAvatar,
  cdxIconLogOut,
  cdxIconLogIn,
  cdxIconLanguage,
} from "@wikimedia/codex-icons";
import ChooseLocale from "@/components/dialog/localization/index.vue";
import { useGeneralStore } from "@/store/general";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });

const store = useGeneralStore();

const { cookies } = useCookies();
const selection = ref(null);
const loginUrl = import.meta.env.VITE_LOGIN_URL;
const changeLanguage = ref(false);

const testRef = ref(null);
const isAuth = ref(null);
const selected = ref(null);
const menu = ref(false);
const menuItems = [{ label: "Keyboard shortcuts", value: "logout" }];

const emit = defineEmits(["logout"]);
const props = defineProps({
  isLogout: Boolean,
});

const unauthMenu = computed(() => {
  return [
    {
      label: t("header.menu.login"),
      value: "login",
      icon: cdxIconLogIn,
      url: loginUrl,
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
      label: store.name,
      value: "user",
      icon: cdxIconUserAvatar,
      action: "progressive",
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

onMounted(() => {
  isAuth.value = cookies.get("auth");
});

const temp = (e) => {
  const a = testRef.value;

  const closeListerner = (event) => {
    if (catchOutsideClick(event, toRaw(a))) {
      window.removeEventListener("click", closeListerner);
      menu.value = false;
    }
  };

  window.addEventListener("click", closeListerner);
};

const catchOutsideClick = (event, dropdown) => {
  // When user clicks menu — do nothing
  if (dropdown == event.target) return false;

  // When user clicks outside of the menu — close the menu
  if (menu.value && dropdown != event.target) return true;
};

const onSelect = (newSelection) => {
  switch (newSelection) {
    case "logout":
      emit("logout");
      break;
    case "locale":
      changeLanguage.value = true;
    default:
      break;
  }
};
</script>

<template>
  <header
    class="h-[54px] border-b-[1px] border-[#C8CCD1] fixed flex justify-end items-center w-full bg-white left-0"
  >
    <div class="absolute w-full flex justify-center items-center h-full">
      <img :src="Logo" alt="lexica_logo" />
    </div>

    <!-- <a class="z-[99] mr-[4px]" :href="loginUrl">
      <CdxButton weight="quiet" class="p-[11px]">
        <CdxIcon :icon="cdxIconLogIn" class="text-[#54595D]" />
      </CdxButton>
    </a> -->

    <CdxMenuButton
      v-tooltip:bottom="'Akun'"
      v-model="selection"
      :menu-items="isAuth && !props.isLogout ? authMenu : unauthMenu"
      :class="[
        'z-[5] top-[58px] p-[4px]',
        isAuth && !props.isLogout ? 'first-child' : 'unauth',
      ]"
      @update:selected="onSelect"
    >
      <cdx-icon :icon="cdxIconUserAvatar" />
    </CdxMenuButton>

    <!-- <CdxButton weight="quiet" class="p-0 m-[4px] cursor-pointer z-[5] shrink-0">
      <button
        weight="quiet"
        ref="testRef"
        :class="[
          'home-button dropdown w-full p-[11px] w-[44px] h-[44px] flex items-center',
          menu && 'active',
        ]"
        @click="
          (e) => {
            temp(e);
            menu = !menu;
          }
        "
      >
        <CdxIcon
          :icon="cdxIconUserAvatar"
          class="cursor-pointer pointer-events-none w-[20px] h-[20px]"
        />
        <div class="dropdown-content" :class="menu ? 'flex' : 'hidden'">
          <div v-if="!isAuth && !props.isLogout"></div>

          <div v-else-if="isAuth && !props.isLogout">
            <div
              class="flex gap-x-[8px] items-center pb-[8px] px-[12px] border-b border-[#A2A9B1] cursor-pointer"
            >
              <CdxIcon
                :icon="cdxIconLogIn"
                class="text-[#202122] mt-[2px]"
              /><span class="text-[16px] font-[400] text-[#202122]"
                >Masuk log</span
              >
            </div>
            <div class="flex gap-x-[12px] text-[#54595D]">
              <CdxIcon :icon="cdxIconUserAvatar" />
              <CdxLabel class="text-[18px] p-0">{{ store.name }}</CdxLabel>
            </div>

            <CdxButton @click="emit('logout')"
              ><CdxIcon :icon="cdxIconLogOut" /> Keluar log</CdxButton
            >
          </div>
        </div>
      </button>
    </CdxButton> -->

    <ChooseLocale
      :open="changeLanguage"
      @onPrimaryAction="changeLanguage = false"
    />
  </header>
</template>

<style>
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

.unauth .cdx-menu-item:first-child bdi {
  color: #202122 !important;
}

.unauth .cdx-menu-item:first-child svg {
  color: #202122 !important;
}
</style>
