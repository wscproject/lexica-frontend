<script setup>
import { onMounted, ref } from "vue";
import Unauth from "@/components/pages/Home/Unauth/index.vue";
import Auth from "@/components/pages/Home/Auth/index.vue";

import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const isAuth = ref(null);

onMounted(async () => {
  isAuth.value = cookies.get("auth");
});
</script>

<template>
  <div
    class="p-[16px] bg-white dark:bg-[#101418] h-full overflow-hidden flex justify-center"
  >
    <!-- <div class="pt-[100px]">
      <CdxLabel class="mb-[12px] text-[18px] p-0 text-black dark:text-white">
        asdasd</CdxLabel
      >
    </div> -->

    <div
      v-if="isAuth"
      class="flex align-center flex-col w-full justify-center h-full max-w-[512px]"
    >
      <Auth />
    </div>

    <div v-else-if="!isAuth">
      <Unauth />
    </div>
  </div>
</template>
