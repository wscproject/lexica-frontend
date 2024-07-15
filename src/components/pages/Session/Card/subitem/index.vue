<script setup>
import { CdxLabel, CdxIcon, CdxProgressBar } from "@wikimedia/codex";
import {
  cdxIconInfoFilled,
  cdxIconClose,
  cdxIconLogoWikidata,
} from "@wikimedia/codex-icons";
import { computed, ref, watch } from "vue";
import Logo from "@/assets/lexica_footer.svg";
import placeholder from "@/assets/placeholder.svg";

const isInfo = ref(false);

const emit = defineEmits(["backtoItem, onHold, onRelease"]);

const props = defineProps({
  data: Object,
  isLoading: Boolean,
});

const translate = (data) => {
  if (data === "images") {
    return "gambar";
  } else if (data === "instanceOf") {
    return "adalah";
  } else if (data === "partOf") {
    return "bagian dari";
  } else if (data === "subclass") {
    return "subkelas";
  } else if (data === "follows") {
    return "didahului oleh";
  } else if (data === "textAudio") {
    return "suara teks ucapan";
  } else if (data === "translation") {
    return "terjemahan";
  }
};

const statements = computed(() => {
  return props?.data?.statements
    ? [...Object.entries(props?.data?.statements)].filter((item) => item?.[1])
    : [];
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header p-[16px] text-white flex test justify-between gap-x-2 relative rounded-t-[16px]"
      :style="{
        background: '#096450',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }"
      @mousedown="emit('onHold')"
      @mouseup="emit('onRelease')"
      @touchstart="emit('onHold')"
      @touchend="emit('onRelease')"
    >
      <div>
        <CdxLabel class="text-[18px] pb-0">{{ props?.data?.label }}</CdxLabel>

        <div class="flex items-center gap-x-2">
          <CdxIcon :icon="cdxIconLogoWikidata" class="text-white" />
          <p><b>butir Wikidata</b></p>
        </div>

        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p
          :key="2"
          class="overflow-hidden text-ellipsis"
          :style="{
            whiteSpace: 'wrap',
          }"
        >
          {{ props?.data?.description }}
        </p>
      </div>
      <div>
        <CdxIcon
          :icon="cdxIconClose"
          class="text-white cursor-pointer"
          @click="emit('backtoItem')"
        />
      </div>
    </div>
    <div class="p-[16px] overflow-auto bg-white h-full rounded-b-[16px]">
      <div v-if="props.isLoading">
        <div class="w-full max-w-[896px]">
          <span class="text-[#54595D] text-[16px]">Memuat...</span>
          <CdxProgressBar class="w-full mt-[8px]"></CdxProgressBar>
        </div>
      </div>

      <div class="h-full" v-if="statements.length > 0 && !props.isLoading">
        <CdxLabel class="text-[16px]" style="padding-bottom: 12px"
          >Pernyataan</CdxLabel
        >
        <div
          v-for="(value, index) in statements.filter(
            (item) => item?.[0] !== 'translation'
          )"
          :key="index"
          class="border border-[#A2A9B1] rounded-[2px] p-[12px] mb-[12px]"
        >
          <div class="flex gap-x-[12px]">
            <div
              v-if="value[0] === 'images'"
              class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
            >
              <img
                :src="value?.[1]?.data?.[0]?.url || placeholder"
                :alt="value?.[1]?.data?.[0]?.value"
                class="object-cover w-full h-full"
              />
            </div>

            <div>
              <CdxLabel class="text-[16px] pb-[4px] leading-[20px]"
                >{{ translate(value[0]) }} ({{
                  value?.[1]?.property
                }})</CdxLabel
              >
              <p
                class="text-[16px] font-normal text-[#54595D] pb-[0] leading-[22px]"
              >
                {{ value?.[1]?.data?.[0]?.value }}
              </p>
            </div>
          </div>
        </div>

        <CdxLabel
          v-if="statements.find((item) => item?.[0] === 'translation')"
          class="text-[16px] pt-[4px]"
          style="padding-bottom: 12px"
          >Terjemahan</CdxLabel
        >

        <div
          v-for="(value, index) in statements.filter(
            (item) => item?.[0] === 'translation'
          )"
          :key="index"
          class="border border-[#A2A9B1] rounded-[2px] p-[12px] mb-[12px]"
        >
          <div class="flex gap-x-[12px]">
            <div>
              <CdxLabel class="text-[16px] pb-[4px] leading-[20px]"
                >{{ value?.[1]?.data?.[0]?.language }} ({{
                  value?.[1]?.property
                }})</CdxLabel
              >
              <p
                class="text-[16px] font-normal text-[#54595D] pb-[0] leading-[22px]"
              >
                {{ value?.[1]?.data?.[0]?.value }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="h-full flex justify-center items-center"
        v-else-if="statements.length === 0 && !props.isLoading"
      >
        <p class="text-[16px] text-[#54595D]"><i>Tidak ada pernyataan</i></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.fade-detail-enter-active {
  transition: all 0.5s ease-out;
}

.fade-detail-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-detail-enter-from,
.fade-detail-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
