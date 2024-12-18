<script setup>
import Header from "@/components/layout/header/index.vue";
import Footer from "@/components/layout/footer/index.vue";
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { CdxProgressBar, CdxLabel, CdxButton } from "@wikimedia/codex";
import successlogo from "@/assets/Success.svg";
import { useCookies } from "vue3-cookies";
import { GetProfile, updateUserPreference } from "@/api/Home";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const { t, locale } = useI18n({ useScope: "global" });
const logout = ref(false);
const loading = ref(false);
const success = ref(false);
const { cookies } = useCookies();
const vuex = useStore();

const isLoading = computed(() => vuex.getters["profile/isLoading"]);

const loggingOut = () => {
  logout.value = true;
  cookies.remove("auth");

  setTimeout(() => {
    success.value = true;
  }, 2000);
};

const reload = () => {
  window.location.reload();
};
</script>

<template>
  <div class="bg-white dark:bg-[#101418] w-full container-home w-full relative">
    <div
      v-if="isLoading"
      class="bg-white dark:bg-[#101418] w-full text-center flex flex-col justify-center align-center h-[100vh] p-[16px] absolute z-[1000] top-0"
    >
      <CdxLabel class="pb-[16px] dark:text-[#EAECF0]">{{
        t("home.loading")
      }}</CdxLabel>
      <CdxProgressBar class="w-full max-w-[896px]"></CdxProgressBar>
    </div>
    <div class="relative flex flex-col items-center container-home">
      <Header @logout="loggingOut" :isLogout="logout" />
      <div
        class="container-home pb-[103px] max-[639px]:pt-[54px] pt-[64px] w-full bg-white dark:bg-[#101418] relative z-[0]"
      >
        <slot v-if="!logout && !loading" />

        <div
          v-if="logout && !success"
          class="w-full text-center flex flex-col justify-center h-[80vh] p-[16px]"
        >
          <CdxLabel class="pb-[16px] dark:text-[#EAECF0]">{{
            t("header.menu.loggingout")
          }}</CdxLabel>
          <CdxProgressBar class="w-full"></CdxProgressBar>
        </div>
        <div
          v-else-if="logout && success"
          class="w-full text-center flex flex-col justify-center items-center h-[80vh] p-[16px]"
        >
          <img :src="successlogo" alt="success" />
          <CdxLabel class="pb-[16px] dark:text-[#EAECF0]">{{
            t("header.menu.logoutsuccess")
          }}</CdxLabel>
          <CdxButton
            weight="primary"
            action="progressive"
            class="w-full"
            @click="reload"
            >{{ t("header.menu.ok") }}</CdxButton
          >
        </div>
      </div>
      <Footer v-if="!logout" />
    </div>
  </div>
</template>

<style scoped>
.container-home {
  height: 100%;
  min-height: stretch;
}
</style>
