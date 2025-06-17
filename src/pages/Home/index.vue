<script setup>
import { onMounted, ref } from "vue";
import Unauth from "@/components/pages/Home/Unauth/index.vue";
import Auth from "@/components/pages/Home/Auth/index.vue";

import { useCookies } from "vue3-cookies";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";

const { cookies } = useCookies();
const { locale } = useI18n({ useScope: "global" });

const isAuth = ref(null);
const vuex = useStore();
const data = ref();

onMounted(async () => {
  isAuth.value = cookies.get("auth");
});
</script>

<template>
  <div
    class="max-[639px]:p-[var(--spacing-100)] max-[1023px]:p-[var(--spacing-200)] bg-white dark:bg-[#101418] h-full flex justify-center">
    <!-- <div class="pt-[6.25rem]">
      <CdxLabel class="mb-[0.75rem] text-[1.125rem] p-0 text-black dark:text-white">
        asdasd</CdxLabel
      >
    </div> -->

    <div v-if="isAuth" class="flex align-center flex-col w-full justify-center h-full max-w-[28rem]">
      <Auth />
    </div>

    <div v-else-if="!isAuth" class="w-full max-w-[56rem]">
      <Unauth />
    </div>
  </div>
</template>
