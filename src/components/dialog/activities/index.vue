<script setup>
import { CdxDialog } from "@wikimedia/codex";
import { useI18n } from "vue-i18n";
import { onMounted, ref, watch } from "vue";
import SelectedImage from "@/assets/selected.svg";

const { t } = useI18n();
const selectedType = ref(null);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  defaultValue: {
    type: String,
    required: false,
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
  emit("applyActivity", selectedType.value);
};

watch(props, () => {
  if (props.defaultValue) {
    selectedType.value = props.defaultValue;
  }
});
</script>

<template>
  <div>
    <CdxDialog
      :open="props.open"
      @update:open="emit('onClose')"
      :use-close-button="true"
      class="activities"
      :title="t('activityDialog.title')"
      :primary-action="primaryAction"
      :default-action="defaultAction"
      @primary="apply"
      @default="emit('onClose')"
    >
      <div class="p-[16px]">
        <div
          v-for="activity in props.options"
          @click="selectedType = activity?.type"
          :class="[
            'border border-[var(--border-color-base)] rounded-[2px] p-[12px] flex gap-x-[12px] mb-[var(--spacing-50)]',
            selectedType === activity.type &&
              'border-[2px] border-[var(--border-color-progressive--focus)] bg-[var(--background-color-progressive-subtle)]',
          ]"
        >
          <div
            :class="[
              selectedType === activity.type &&
                'border-[var(--border-color-progressive)]',
              selectedType !== activity.type &&
                'border-[var(--border-color-subtle)]',
              'w-[40px] h-[40px] border rounded-[2px] overflow-hidden shrink-0',
            ]"
          >
            <img
              v-if="selectedType !== activity.type"
              :src="activity.imageUrl"
              :alt="activity.type"
            />
            <img
              v-else
              :src="SelectedImage"
              alt="selected"
              class="overflow-hidden"
            />
          </div>
          <div>
            <p
              v-if="activity.type === 'connect'"
              class="text-[16px] text-[var(--color-base)]"
            >
              <b>{{ t("activityDialog.connect.title") }}</b>
            </p>
            <p
              v-if="activity.type === 'connect'"
              class="text-[16px] text-[var(--color-subtle)]"
            >
              {{ t("activityDialog.connect.description") }}
            </p>

            <p
              v-if="activity.type === 'script'"
              class="text-[16px] text-[var(--color-base)]"
            >
              <b>{{ t("activityDialog.script.title") }}</b>
            </p>
            <p
              v-if="activity.type === 'script'"
              class="text-[16px] text-[var(--color-subtle)]"
            >
              {{ t("activityDialog.script.description") }}
            </p>
          </div>
        </div>
      </div>
    </CdxDialog>
  </div>
</template>

<style>
.activities .cdx-dialog__header {
  padding: 16px;
}
</style>
