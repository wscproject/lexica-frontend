<script setup>
import Logo from "@/assets/lexica_logo.svg";
import Login from "@/assets/login.svg";
import ButtonIcon from "@/components/buttons/ButtonIcon/index.vue";
import { onMounted, ref, watch, toRaw } from "vue";
import { useCookies } from "vue3-cookies";
import { CdxIcon, CdxButton, CdxMenuButton, CdxLabel } from "@wikimedia/codex";
import {
  cdxIconUserAvatar,
  cdxIconLogOut,
  cdxIconLogIn,
} from "@wikimedia/codex-icons";
import { useGeneralStore } from "@/store/general";

const store = useGeneralStore();

const { cookies } = useCookies();
const loginUrl = import.meta.env.VITE_LOGIN_URL;

const testRef = ref(null);
const isAuth = ref(null);
const selected = ref(null);
const menu = ref(false);
const menuItems = [{ label: "Keyboard shortcuts", value: "logout" }];

const emit = defineEmits(["logout"]);
const props = defineProps({
  isLogout: Boolean,
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
</script>

<template>
  <header
    class="h-[54px] border-b-[1px] border-[#C8CCD1] fixed flex justify-end items-center w-full bg-white left-0"
  >
    <div class="absolute w-full flex justify-center items-center h-full">
      <img :src="Logo" alt="lexica_logo" />
    </div>

    <a
      class="z-[99] mr-[4px]"
      v-if="!isAuth && !props.isLogout"
      :href="loginUrl"
    >
      <CdxButton weight="quiet" class="p-[11px]">
        <CdxIcon :icon="cdxIconLogIn" class="text-[#54595D]" />
      </CdxButton>
    </a>

    <CdxButton
      v-else-if="isAuth && !props.isLogout"
      weight="quiet"
      class="p-0 m-[4px] cursor-pointer z-[5] shrink-0"
    >
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
          class="cursor-pointer pointer-events-none text-[#54595D] w-[20px] h-[20px]"
        />
        <div class="dropdown-content" :class="menu ? 'flex' : 'hidden'">
          <div class="flex gap-x-[12px]">
            <CdxIcon :icon="cdxIconUserAvatar" />
            <CdxLabel class="text-[18px] p-0">{{ store.name }}</CdxLabel>
          </div>

          <CdxButton @click="emit('logout')"
            ><CdxIcon :icon="cdxIconLogOut" /> Keluar log</CdxButton
          >
        </div>
      </button>
    </CdxButton>

    <div class="z-[5] dropdown"></div>
  </header>
</template>

<style>
.home-button:active {
  border-radius: 2px !important;
  border-color: #72777d !important;
  border: 1px solid;
  background: #eaecf0 !important;
}

.active {
  border-radius: 2px !important;
  border-color: #72777d !important;
  border: 1px solid;
  background: #eaecf0 !important;
}
.dropdown-content {
  position: absolute;
  right: 4px;
  top: 58px;
  border-radius: 2px;
  background-color: white;
  min-width: 288px;
  border: 1px solid #a2a9b1;
  z-index: 9999;
  padding: 16px 16px 24px;

  flex-direction: column;
  row-gap: 24px;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
}
</style>
