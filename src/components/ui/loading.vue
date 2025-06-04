<script setup>
import { usePreferredReducedMotion } from "@vueuse/core";
import { CdxProgressIndicator } from "@wikimedia/codex";
import LoadingReduce from "@/assets/loading-reduce.svg";
import { useHtmlHasClass } from "../../helper/hasClass";

const props = defineProps({
  variant: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
});

const isReducedMotion = usePreferredReducedMotion();
const hasClass = useHtmlHasClass("reduced-motion");
</script>

<template>
  <div
    v-if="isReducedMotion !== 'reduce' || !hasClass"
    :class="[
      'flex',
      props.variant === 'default'
        ? ' gap-x-[var(--spacing-50)]'
        : 'gap-y-[var(--spacing-50)] flex-col-reverse',
    ]"
  >
    <CdxProgressIndicator class="w-[18px] h-[18px]" />
    <span
      :class="[
        props.variant === 'default'
          ? 'text-[16px] text-[var(--color-subtle)]'
          : 'text-[18px] font-[700] text-[var(--color-emphasized)]',
      ]"
      >{{ props.text }}</span
    >
  </div>

  <div
    v-else:class="[
      'flex',
      props.variant === 'default'
        ? ' gap-x-[var(--spacing-50)]'
        : 'gap-y-[var(--spacing-50)] flex-col-reverse',
    ]"
  >
    <LoadingReduce />
    <span
      :class="[
        props.variant === 'default'
          ? 'text-[16px] text-[var(--color-subtle)]'
          : 'text-[18px] font-[700] text-[var(--color-emphasized)]',
      ]"
      >{{ props.text }}</span
    >
  </div>
</template>
