<script setup>
import Header from "@/components/layout/header/index.vue";
import Footer from "@/components/layout/footer/index.vue";
import { onMounted, ref } from "vue";
import { CdxProgressBar, CdxLabel, CdxButton } from "@wikimedia/codex";
import successlogo from "@/assets/Success.svg";
import { useCookies } from "vue3-cookies";
import { useGeneralStore } from "@/store/general";
import { GetProfile } from "@/api/Home";
import { useI18n } from "vue-i18n";
import { EndContribution } from "@/api/Session";

const { t, locale } = useI18n({ useScope: "global" });
const logout = ref(false);
const loading = ref(false);
const success = ref(false);
const { cookies } = useCookies();
const store = useGeneralStore();

const loggingOut = () => {
  logout.value = true;
  cookies.remove("auth");

  setTimeout(() => {
    success.value = true;
  }, 2000);
};

onMounted(async () => {
  if (cookies.get("auth")) {
    loading.value = true;

    const response = await GetProfile();
    if (response?.statusCode === 200) {
      store.setData(response.data);
      locale.value = response?.data?.displayLanguage || "en";
      cookies.set("locale", response?.data?.displayLanguage || "en");

      if (response?.data?.ongoingContribution) {
        EndContribution();
        loading.value = false;
      }
      loading.value = false;
    }
  }
});

const reload = () => {
  window.location.reload();
};
</script>

<template>
  <div
    v-if="loading"
    class="w-full text-center flex flex-col justify-center h-[100vh] p-[16px]"
  >
    <CdxLabel class="pb-[16px]">{{ t("home.loading") }}</CdxLabel>
    <CdxProgressBar class="w-full"></CdxProgressBar>
  </div>
  <div v-else class="relative flex flex-col items-center">
    <Header @logout="loggingOut" :isLogout="logout" />
    <div class="min-h-[100vh] pb-[103px] pt-[54px] w-full max-w-[896px]">
      <slot v-if="!logout && !loading" />

      <div
        v-if="logout && !success"
        class="w-full text-center flex flex-col justify-center h-[80vh] p-[16px]"
      >
        <CdxLabel class="pb-[16px]">{{ t("header.menu.loggingout") }}</CdxLabel>
        <CdxProgressBar class="w-full"></CdxProgressBar>
      </div>
      <div
        v-else-if="logout && success"
        class="w-full text-center flex flex-col justify-center items-center h-[80vh] p-[16px]"
      >
        <img :src="successlogo" alt="success" />
        <CdxLabel class="pb-[16px]">{{
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
</template>
