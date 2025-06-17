<script setup>
import { CdxLabel } from "@wikimedia/codex";
import Loading from "@/components/ui/loading.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  submitAction: String,
});
</script>

<template>
  <div class="absolute z-[99] w-full bg-white dark:bg-[#101418] flex justify-center flex-col text-center p-[1rem]">
    <div class="w-full text-center">
      <Loading :text="t('session.upload')" variant="big" />
    </div>
  </div>
</template>
