<script setup>
import { CdxDialog } from "@wikimedia/codex";
import { useI18n } from "vue-i18n";
import { nextTick, onMounted, ref, watch } from "vue";
import SelectedImage from "@/assets/selected.svg";

const { t } = useI18n();
const selectedType = ref(null);
const focusedIndex = ref(0);

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
  label: t("activityDialog.apply"),
  actionType: "progressive",
};

const defaultAction = {
  label: t("activityDialog.cancel"),
};

const emit = defineEmits(["onClose", "applyActivity"]);

const apply = () => {
  emit("applyActivity", selectedType.value);
};

const setFocusedIndex = (index) => {
  focusedIndex.value = index;
};

const keydown = (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    event.preventDefault();
    focusedIndex.value = (focusedIndex.value + 1) % props?.options?.length;
  } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    event.preventDefault();
    focusedIndex.value =
      (focusedIndex.value - 1 + props?.options?.length) %
      props?.options?.length;
  }
  // Focus the new item

  nextTick(() => {
    const element = document.querySelectorAll(".focused")[focusedIndex.value];
    element.focus();
    selectedType.value = props?.options[focusedIndex.value]?.type;

    console.log(focusedIndex.value);
  });
};

watch(props, () => {
  if (props.defaultValue) {
    selectedType.value = props.defaultValue;
  }
});
</script>

<template>
  <div>
    <CdxDialog :open="props.open" @update:open="emit('onClose')" :use-close-button="true" class="activities"
      :title="t('activityDialog.title')" :primary-action="primaryAction" :default-action="defaultAction"
      @primary="apply" @default="emit('onClose')" @keydown.enter="apply">
      <div class="px-[var(--spacing-150)]" role="radiogroup" @keydown="keydown" tabindex="0">
        <div v-for="(activity, index) in props.options" :key="activity.type" @click="
          () => {
            selectedType = activity?.type;
            focusedIndex = index;
          }
        " @focus="setFocusedIndex(index)" :tabindex="focusedIndex === index ? 0 : -1" name="activity" :class="[
          'border border-[var(--border-color-base)] rounded-[0.1250rem] p-[0.75rem] flex gap-x-[0.75rem] focused',
          selectedType === activity.type &&
          'border-[0.1250rem] border-[var(--border-color-progressive--focus)] bg-[var(--background-color-progressive-subtle)] ',
          index !== props.options.length - 1 && 'mb-[var(--spacing-50)]',
        ]">
          <div :class="[
            selectedType === activity.type &&
            'border-[var(--border-color-progressive--focus)]',
            selectedType !== activity.type &&
            'border-[var(--border-color-subtle)]',
            'w-[2.5rem] h-[2.5rem] border rounded-[0.1250rem] overflow-hidden shrink-0',
          ]">
            <img v-if="selectedType !== activity.type" :src="activity.imageUrl" :alt="activity.type" />
            <img v-else :src="SelectedImage" alt="selected" class="overflow-hidden" />
          </div>
          <div>
            <p v-if="activity.type === 'connect'" class="text-[1rem] text-[var(--color-base)]">
              <b>{{ t("activityDialog.connect.title") }}</b>
            </p>
            <p v-if="activity.type === 'connect'" class="text-[1rem] text-[var(--color-subtle)]">
              {{ t("activityDialog.connect.description") }}
            </p>

            <p v-if="activity.type === 'script'" class="text-[1rem] text-[var(--color-base)]">
              <b>{{ t("activityDialog.script.title") }}</b>
            </p>
            <p v-if="activity.type === 'script'" class="text-[1rem] text-[var(--color-subtle)]">
              {{ t("activityDialog.script.description") }}
            </p>

            <p v-if="activity.type === 'hyphenation'" class="text-[1rem] text-[var(--color-base)]">
              <b>{{ t("activityDialog.hyphenation.title") }}</b>
            </p>
            <p v-if="activity.type === 'hyphenation'" class="text-[1rem] text-[var(--color-subtle)]">
              {{ t("activityDialog.hyphenation.description") }}
            </p>
          </div>
        </div>
      </div>
    </CdxDialog>
  </div>
</template>
