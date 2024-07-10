<script setup></script>

<template>
  <div class="min-h-[100vh] w-full bg-[#FF0000]">
    <slot v-if="test === true" />
  </div>
</template>
