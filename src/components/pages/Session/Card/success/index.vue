<script setup>
import { CdxLabel } from "@wikimedia/codex";
import { useI18n } from "vue-i18n";
import { LottieAnimation } from "lottie-web-vue";
import Anim from "@/assets/animation/success-animation.json";
import { onMounted, ref } from "vue";

const { t } = useI18n({ useScope: "global" });
const emit = defineEmits(["complete"]);

const anim = ref(null);

const props = defineProps({
  data: Object,
  currCount: Number,
  isNotCurrent: Boolean,
});

onMounted(() => {
  anim?.value?.play();
});
</script>

<template>
  <div
    class="absolute z-[99] bg-[#14876B] w-full flex justify-center align-center text-center p-[16px] h-full rounded-[16px]"
  >
    <LottieAnimation
      class="w-[128px] h-[128px]"
      :animation-data="Anim"
      :auto-play="false"
      :loop="false"
      :speed="1"
      ref="anim"
      @complete="emit('complete')"
    />
  </div>
</template>
