<script setup>
import { CdxDialog, CdxLabel, CdxButton, CdxIcon } from "@wikimedia/codex";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const open = ref(false);

let resolvePromise;

const props = defineProps({
  count: Number,
});

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
    class="mx-[16px] w-full"
    :title="t('session.warning.title')"
    @update:open="handleUserInput(false)"
    close-button-label="Close"
  >
    <div class="px-[16px]">
      <p>
        {{ t("session.warning.content") }}
        <b> {{ props.count }} {{ t("session.warning.subtext") }}</b>
      </p>
    </div>

    <template #footer>
      <div class="flex gap-x-2 justify-end">
        <CdxButton @click="handleUserInput(false)">{{
          t("session.warning.button1")
        }}</CdxButton>
        <CdxButton
          weight="primary"
          action="progressive"
          @click="handleUserInput(true)"
          >{{ t("session.warning.button2") }}</CdxButton
        >
      </div>
    </template>
  </CdxDialog>
</template>
