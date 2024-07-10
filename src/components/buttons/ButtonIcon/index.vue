<script setup>
const props = defineProps({
  imgSrc: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: "",
  },
  customClass: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <v-btn
    :class="props.customClass + ' rounded-full p-0 min-w-0'"
    variant="plain"
  >
    <img :src="props.imgSrc" :alt="props.alt" />
  </v-btn>
</template>
