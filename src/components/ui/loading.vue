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
      : 'gap-y-[var(--spacing-75)] flex-col-reverse',
  ]">
    <CdxProgressIndicator v-if="props.variant === 'default' && !isNotUsingIndicator" class="w-[1.25] h-[1.25]" />
    <div v-else-if="props.variant !== 'default' && !isNotUsingIndicator" class="w-full max-w-[28rem]">
      <CdxProgressBar class="w-full " />
    </div>
    <span v-if="props.variant === 'default'" class="text-[1rem] text-[var(--color-subtle)]">{{ props.text }}</span>
    <h3 v-else class="text-[1.25rem] font-[700] text-[var(--color-emphasized)]">
      {{ props.text }}
    </h3>
  </div>

  <div v-else :class="[
    'flex items-center',
    props.variant === 'default'
      ? ' gap-x-[var(--spacing-50)]'
      : 'gap-y-[var(--spacing-75)] flex-col-reverse',
  ]">
    <LoadingReduce v-if="!isNotUsingIndicator" />
    <span v-if="props.variant === 'default'" class="text-[1rem] text-[var(--color-subtle)]">{{ props.text }}</span>
    <h3 v-else class="text-[1.25rem] font-[700] text-[var(--color-emphasized)]">
      {{ props.text }}
    </h3>
  </div>
</template>
