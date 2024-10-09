<script setup>
import { CdxDialog } from "@wikimedia/codex";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
});

const primaryAction = {
  label: "Save",
  actionType: "progressive",
};

const defaultAction = {
  label: "Cancel",
};

const emit = defineEmits(["onClose", "applyActivity"]);

const apply = () => {
  emit("applyActivity");
};
</script>

<template>
  <div>
    <CdxDialog
      :open="props.open"
      @update:open="close"
      :use-close-button="true"
      class="activities"
      title="activities"
      :primary-action="primaryAction"
      :default-action="defaultAction"
      @primary="apply"
      @default="emit('onClose')"
    >
      <div class="p-[16px]">
        <div
          v-for="activity in props.options"
          class="border border-[var(--border-color-base)] rounded-[2px] p-[12px]"
        >
          <img :src="activity.image" />
        </div>
      </div>
    </CdxDialog>
  </div>
</template>

<style></style>
