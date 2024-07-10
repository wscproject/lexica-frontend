<script setup>
import { CdxLabel, CdxIcon, CdxButton, CdxSearchInput } from "@wikimedia/codex";
import { cdxIconInfoFilled } from "@wikimedia/codex-icons";
import { ref } from "vue";
import { useGeneralStore } from "@/store/general";
import Logo from "@/assets/add.svg";
import wikimedia from "@/assets/lexica_footer.svg";
import placeholder from "@/assets/placeholder.svg";

const isInfo = ref(false);

const store = useGeneralStore();
const emit = defineEmits(["backtoItem, onDone"]);
const props = defineProps({
  headerRef: Object,
  data: Object,
  detail: Object,
});
</script>

<template>
  <div
    class="relative w-full flex flex-col overflow-hidden rounded-[16px] flex flex-col h-full"
  >
    <div
      class="p-[16px] text-white flex test justify-between gap-x-2 header fixed w-full rounded-t-[16px]"
      :style="{
        background: '#54595D',
        alignItems: 'center',
      }"
      :ref="props.headerRef"
    >
      <CdxLabel class="text-[18px] pb-0 text-white">Pratinjau</CdxLabel>
    </div>
    <div
      class="px-[16px] pt-[68px] pb-[65px] overflow-auto pb-[45px] custom-maxheight bg-white h-full"
    >
      <CdxLabel class="text-[16px]" style="padding-bottom: 16px"
        >Leksem</CdxLabel
      >
      <div class="border border-[#A2A9B1] rounded-[2px] p-[12px] mb-[8px]">
        <div class="flex gap-x-[12px]">
          <div
            class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
          >
            <img
              :src="
                props?.data?.statements?.images?.data?.[0]?.url || placeholder
              "
              class="object-cover w-full h-full"
            />
          </div>

          <div>
            <CdxLabel class="text-[16px] pb-[4px] leading-[20px]"
              >{{ props?.data?.lemma }} ({{
                props?.data?.lexemeSenseId
              }})</CdxLabel
            >
            <p
              class="text-[16px] font-normal text-[#54595D] pb-[0] leading-[22px]"
            >
              {{ props?.data?.gloss }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="arrow"></div>
      </div>
      <div class="p-[12px] bg-[#eaecf0]" v-if="props?.detail">
        <div class="flex gap-x-2 items-start">
          <img :src="Logo" alt="lexica_footer" />
          <CdxLabel class="text-[16px]" style="padding-bottom: 16px"
            >Pernyataan baru: butir untuk makna ini (P5137)</CdxLabel
          >
        </div>
        <div class="border border-[#A2A9B1] rounded-[2px] p-[12px] bg-white">
          <div class="flex gap-x-[12px]">
            <div
              class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
            >
              <img
                :src="props?.detail?.image || placeholder"
                class="object-cover w-full h-full"
              />
            </div>
            <div>
              <CdxLabel class="text-[16px] pb-[4px] leading-[20px]"
                >{{ props?.detail?.label }} ({{ props?.detail?.id }})</CdxLabel
              >
              <p
                class="text-[16px] font-normal text-[#54595D] pb-[0] leading-[22px]"
              >
                {{ props?.detail?.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="p-[12px] bg-[#eaecf0]" v-if="!props?.detail">
        <div class="flex gap-x-2">
          <CdxIcon :icon="cdxIconInfoFilled" />
          <div>
            <CdxLabel class="text-[16px] p-0">Tidak ada perubahan</CdxLabel>
            <p class="text-[16px] text-[#54595D] pt-[5px]">
              <i>Alasan: Butir tidak ada</i>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed bottom-0 w-full h-66px border-t border-[#A2A9B1] p-[16px] flex justify-between align-center bg-white gap-x-[8px] rounded-b-[16px]"
    >
      <CdxButton @click="emit('backtoItem')" class="w-full"
        >Sunting lagi</CdxButton
      >
      <CdxButton
        weight="primary"
        action="progressive"
        class="w-full"
        @click="
          emit('onDone', {
            senseId: props?.data?.lexemeSenseId,
            itemId: props?.detail?.id || '',
          })
        "
        >Selanjutnya</CdxButton
      >
    </div>
  </div>
</template>

<style>
.arrow {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #eaecf0;
}
</style>
