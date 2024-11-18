<script setup>
import { CdxButton, CdxIcon, CdxProgressBar } from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const newImage = ref("");
const loading = ref(true);

console.log(props.img);

onMounted(async () => {
  console.log(loading.value);

  if (props.img) {
    let img = new Image();

    img.onload = () => {
      console.log("img loaded");
      newImage.value = img.src;
      loading.value = false;
    };

    img.src = props.img;
  }
});
</script>

<template>
  <div
    class="absolute w-100 h-100 bg-[#101418] z-[99] flex justify-center items-center py-[var(--spacing-100)]"
  >
    <div class="absolute right-[4px] top-[4px] z-[999]">
      <CdxButton
        @click="emit('close')"
        weight="quiet"
        class="w-[var(--size-275)] h-[var(--size-275)]"
      >
        <CdxIcon
          :icon="cdxIconClose"
          dir="rtl"
          class="cursor-pointer text-[#EAECF0]"
        />
      </CdxButton>
    </div>

    <img v-if="!loading" :src="newImage" />
    <CdxProgressBar
      v-else
      class="w-full mt-[8px] max-w-[448px]"
    ></CdxProgressBar>
  </div>
</template>
