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
import { CdxLabel, CdxButton } from "@wikimedia/codex";
import successlogo from "@/assets/Success.svg";
import { useCookies } from "vue3-cookies";
import { GetProfile, updateUserPreference } from "@/api/Home";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import Loading from "@/components/ui/loading.vue";

const { t, locale } = useI18n({ useScope: "global" });
const logout = ref(false);
const loading = ref(false);
const success = ref(false);
const { cookies } = useCookies();
const vuex = useStore();
const isAuth = ref(null);

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

onMounted(() => {
  isAuth.value = cookies.get("auth");
  console.log("Auth status:", cookies.get("auth"));

});
</script>

<template>
  <div class="bg-white dark:bg-[#101418] w-full container-home w-full relative">
    <div v-if="isLoading"
      class="bg-white dark:bg-[#101418] w-full text-center flex flex-col justify-center align-center h-[100vh] p-[1rem] absolute z-[1000] top-0 items-center px-[1rem]">
      <Loading :text="t('home.loading')" variant="big" />
    </div>
    <div :class="[
      'relative flex flex-col items-center container-home',
      !isAuth ? 'min-[640px]:min-h-[43.75rem]' : 'min-[640px]:min-h-[26.25rem]',
    ]">
      <Header @logout="loggingOut" :isLogout="logout" />
      <div class="container-home max-[639px]:pt-[3.375rem] pt-[4rem] w-full bg-white dark:bg-[#101418] relative z-[0]">
        <slot v-if="!logout && !loading" />

        <div v-if="logout && !success"
          class="w-full text-center flex flex-col justify-center h-[80vh] p-[1rem] items-center px-[1rem]">
          <Loading :text="t('header.menu.loggingout')" variant="big" />
        </div>
        <div v-else-if="logout && success"
          class="w-full text-center flex flex-col justify-center items-center h-[80vh] p-[1rem]">
          <img :src="successlogo" alt="success" />
          <h3 class="text-[var(--color-base)] font-[700] text-[1.25rem] pb-[var(--spacing-100)]">{{
            t("header.menu.logoutsuccess")
          }}</h3>
          <CdxButton weight="primary" action="progressive" class="w-full h-[44px]" @click="reload">{{
            t("header.menu.ok") }}
          </CdxButton>
        </div>
      </div>
      <Footer v-if="!logout" />
    </div>
  </div>
</template>

<style scoped>
.container-home {
  height: 100%;
  /* min-height: stretch; */
}
</style>
