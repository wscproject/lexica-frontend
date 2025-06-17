<script setup>
import { CdxDialog, CdxLabel, CdxButton, CdxIcon } from "@wikimedia/codex";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n({ useScope: "global" });
const open = ref(false);

let resolvePromise;

const props = defineProps({
  count: Number,
  loading: Boolean,
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

const handleUserInput = async (value) => {
  if (!resolvePromise) return;

  resolvePromise(value);

  if (!value) {
    open.value = false;
  }
};

watch(props, () => {
  if (!props.loading) {
    open.value = false;
  }
});

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
  <CdxDialog v-model:open="open" class="mx-[1rem] w-full max-w-[32rem] leave-warning-dialog"
    :title="t('session.warning.title')" @update:open="handleUserInput(false)" close-button-label="Close">
    <div class="px-[1rem]">
      <p class="text-[var(--color-base)]">
        {{ t("session.warning.content") }}
        <b>
          {{ props.count }}
          {{ locale === "en" ? t("session.warning.card", props.count) : "" }}
          {{ t("session.warning.subtext") }}</b>
      </p>
    </div>

    <template #footer>
      <div class="flex gap-x-2 justify-end" v-if="!props.loading">
        <CdxButton @click="handleUserInput(false)">{{
          t("session.warning.button1")
        }}</CdxButton>
        <CdxButton weight="primary" action="progressive" @click="handleUserInput(true)">{{ t("session.warning.button2")
        }}</CdxButton>
      </div>

      <div class="flex gap-x-2 justify-end" v-if="props.loading">
        <CdxButton disabled>{{ t("session.warning.loading") }}</CdxButton>
      </div>
    </template>
  </CdxDialog>
</template>

<style>
[dir] .cdx-dialog--dividers .cdx-dialog__header {
  border-bottom: none !important;
}

[dir] .cdx-dialog--dividers .cdx-dialog__footer {
  border-top: none !important;
}
</style>
