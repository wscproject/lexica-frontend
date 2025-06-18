<script setup>
import { usePreferredReducedMotion } from "@vueuse/core";
import { CdxProgressIndicator, CdxProgressBar } from "@wikimedia/codex";
import LoadingReduce from "@/components/icons/loading-reduce/index.vue";
import { ref, toRef } from "vue";

const props = defineProps({
  variant: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
  isNotUsingIndicator: {
    type: Boolean,
    default: false,
  },
});

const isNotUsingIndicator = toRef(props, "isNotUsingIndicator");

const isPreferredMotion = ref(localStorage.getItem("reduceMotion") === "true");

const isReducedMotion = usePreferredReducedMotion();

</script>

<template>
  <div v-if="!isPreferredMotion" :class="[
    'flex items-center w-full justify-center',
    props.variant === 'default'
      ? ' gap-x-[var(--spacing-50)]'
      : 'gap-y-[var(--spacing-50)] flex-col-reverse',
  ]">
    <CdxProgressIndicator v-if="props.variant === 'default' && !isNotUsingIndicator"
      class="w-[1.125rem] h-[1.125rem]" />
    <div v-else-if="props.variant !== 'default' && !isNotUsingIndicator" class="w-full max-w-[28rem]">
      <CdxProgressBar />
    </div>
    <span :class="[
      props.variant === 'default'
        ? 'text-[1rem] text-[var(--color-subtle)]'
        : 'text-[1.125rem] font-[700] text-[var(--color-emphasized)]',
    ]">{{ props.text }}</span>
  </div>

  <div v-else :class="[
    'flex items-center',
    props.variant === 'default'
      ? ' gap-x-[var(--spacing-50)]'
      : 'gap-y-[var(--spacing-50)] flex-col-reverse',
  ]">
    <LoadingReduce v-if="!isNotUsingIndicator" />
    <span :class="[
      props.variant === 'default'
        ? 'text-[1rem] text-[var(--color-subtle)]'
        : 'text-[1.125rem] font-[700] text-[var(--color-emphasized)]',
    ]">{{ props.text }}</span>
  </div>
</template>
