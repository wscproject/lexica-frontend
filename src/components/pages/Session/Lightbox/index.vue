<script setup>
import { CdxButton, CdxIcon, CdxProgressBar } from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const newImage = ref("");
const loading = ref(true);
const refs = ref(null);
const { t } = useI18n({ useScope: "global" });

console.log(props.img);

onMounted(async () => {
  console.log(loading.value);

  refs.value.focus();

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
    ref="refs"
    class="absolute w-100 h-100 bg-[#101418] z-[99] flex justify-center items-center py-[var(--spacing-100)]"
    tabindex="0"
    @keydown.esc="emit('close')"
  >
    <div class="absolute right-[4px] top-[4px] z-[999]">
      <CdxButton
        :aria-label="t('aria.close')"
        @click="emit('close')"
        weight="quiet"
        class="w-[var(--size-275)] h-[var(--size-275)] bg-[#101418]"
      >
        <CdxIcon
          :icon="cdxIconClose"
          dir="rtl"
          class="cursor-pointer text-[#EAECF0]"
        />
      </CdxButton>
    </div>

    <img
      v-if="!loading"
      :src="newImage"
      @keydown="console.log('asdasd')"
      class="object-contain w-100 h-100"
    />
    <CdxProgressBar
      v-else
      class="w-full mt-[8px] px-[16px] max-w-[448px] darking"
    ></CdxProgressBar>
  </div>
</template>

<style>
.darking {
  background-color: #101418 !important;
}
</style>
