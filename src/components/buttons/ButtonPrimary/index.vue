<script setup>
import { CdxButton } from "@wikimedia/codex";
</script>

<template>
  <CdxButton
    weight="primary"
    action="progressive"
    :ripple="false"
    class="w-full p-[12px]"
  >
    <slot />
  </CdxButton>
</template>

<style scoped>
/* .primary {
  color: white;
  background-color: #3366cc;
  border-radius: 2px;
  box-shadow: unset !important;
}

.primary:hover {
  background-color: #447ff5;
  box-shadow: unset;
}

.primary:active {
  background-color: #2a4b8d;
  box-shadow: unset;
}

.primary:focus {
  background-color: white;
  box-shadow: unset;
} */
</style>
