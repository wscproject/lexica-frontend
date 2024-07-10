<script setup>
import { CdxDialog, CdxLabel, CdxButton, CdxIcon } from "@wikimedia/codex";
import { ref } from "vue";

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
    title="Akhiri sesi kontribusi ini?"
    @update:open="handleUserInput(false)"
    close-button-label="Close"
  >
    <div class="px-[16px]">
      <p>
        Anda telah mengerjakan <b>{{ props.count }} kartu sejauh ini.</b>
      </p>
    </div>

    <template #footer>
      <div class="flex gap-x-2 justify-end">
        <CdxButton @click="handleUserInput(false)">Sunting lagi</CdxButton>
        <CdxButton
          weight="primary"
          action="progressive"
          @click="handleUserInput(true)"
          >Akhiri sesi</CdxButton
        >
      </div>
    </template>
  </CdxDialog>
</template>
