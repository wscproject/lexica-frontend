<script setup>
import { CdxProgressBar, CdxLabel } from "@wikimedia/codex";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCookies } from "vue3-cookies";
import { Login } from "@/api/Auth";

const route = useRoute();
const router = useRouter();

const { cookies } = useCookies();

onMounted(async () => {
  const response = await Login({ code: route.query.code });

  if (response.statusCode === 200) {
    cookies.set("auth", response?.data?.access_token);
    cookies.set("refresh", response?.data?.refresh_token);

    router.push("/");
  }
});
</script>

<template>
  <div class="min-h-screen flex justify-center items-center w-full p-[16px]">
    <div class="w-full text-center max-w-[896px]">
      <CdxLabel class="pb-[16px]">Memuat...</CdxLabel>
      <CdxProgressBar class="w-full"></CdxProgressBar>
    </div>
  </div>
</template>
