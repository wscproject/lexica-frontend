<script setup>
import { CdxDialog, CdxLabel, CdxButton, CdxIcon } from "@wikimedia/codex";
import check from "@/assets/check.svg";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const open = ref(false);

let resolvePromise;

const emit = defineEmits(["onPrimaryAction, result"]);

const close = () => {
  emit("onPrimaryAction", false);
};

const openModal = () => {
  open.value = true;
  return new Promise((resolve) => {
    resolvePromise = resolve;
  });
};

const handleUserInput = (value) => {
  if (!resolvePromise) return;

  resolvePromise(value);

  open.value = false;
};

const primaryAction = {
  label: "Save",
  actionType: "progressive",
};

const defaultAction = {
  label: "Cancel",
};

defineExpose({ openModal });
</script>

<template>
  <CdxDialog
    v-model:open="open"
    class="text-center max-w-[512px]"
    @update:open="handleUserInput(true)"
  >
    <div class="flex flex-col items-center">
      <img :src="check" alt="check" rel="preload" />
      <CdxLabel class="text-[18px] px-[16px] pb-[16px]">
        {{ t("session.done.title") }}
      </CdxLabel>
    </div>
    <template #footer>
      <div class="flex gap-x-2 justify-center">
        <CdxButton
          :aria-label="t('aria.backToHome')"
          class="w-full"
          weight="primary"
          action="progressive"
          @click="handleUserInput(true)"
          >{{ t("session.done.button") }}</CdxButton
        >
      </div>
    </template>
  </CdxDialog>
</template>
