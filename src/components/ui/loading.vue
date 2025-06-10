<script setup>
import { usePreferredReducedMotion } from "@vueuse/core";
import { CdxProgressIndicator, CdxProgressBar } from "@wikimedia/codex";
import LoadingReduce from "@/components/icons/loading-reduce/index.vue";
import { ref } from "vue";

const props = defineProps({
  variant: {
    type: String,
  },
  text: {
    type: String,
    required: true,
  },
});

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
    <CdxProgressIndicator v-if="props.variant === 'default'" class="w-[18px] h-[18px]" />
    <div v-else class="w-full max-w-[448px]">
      <CdxProgressBar />
    </div>
    <span :class="[
      props.variant === 'default'
        ? 'text-[16px] text-[var(--color-subtle)]'
        : 'text-[18px] font-[700] text-[var(--color-emphasized)]',
    ]">{{ props.text }}</span>
  </div>

  <div v-else :class="[
    'flex items-center',
    props.variant === 'default'
      ? ' gap-x-[var(--spacing-50)]'
      : 'gap-y-[var(--spacing-50)] flex-col-reverse',
  ]">
    <LoadingReduce />
    <span :class="[
      props.variant === 'default'
        ? 'text-[16px] text-[var(--color-subtle)]'
        : 'text-[18px] font-[700] text-[var(--color-emphasized)]',
    ]">{{ props.text }}</span>
  </div>
</template>
