<script setup>
import ButtonPrimary from "@/components/buttons/ButtonPrimary/index.vue";
import Logo from "@/assets/home_logo.svg";

import { CdxIcon, CdxLabel, CdxSelect, CdxButton } from "@wikimedia/codex";
import {
  cdxIconLogIn,
  cdxIconInfoFilled,
  cdxIconPlay,
} from "@wikimedia/codex-icons";

import Lightbulb from "@/assets/lightbulb.svg";
import { useRouter } from "vue-router";
import { useGeneralStore } from "@/store/general";

const store = useGeneralStore();

const router = useRouter();
const emit = defineEmits(["onHint"]);
const props = defineProps({
  data: Object,
});
</script>

<template>
  <div>
    <div
      class="flex flex-col items-center border-b-[1px] border-[#C8CCD1] mb-[12px]"
    >
      <div class="mt-[12.5px]">
        <img
          :src="Logo"
          alt="home_logo"
          class="shrink-0 w-[48px] h-[48px] mb-[8px]"
        />
      </div>
      <CdxLabel class="] mb-[12px] text-[18px] p-0"> {{ store.name }}</CdxLabel>
    </div>

    <div class="text-[16px] pb-[12px]">
      <span>Kontribusi untuk leksem berbahasa:</span>
    </div>
    <div class="text-[16px] pb-[12px]">
      <CdxSelect
        class="w-full"
        disabled
        default-label="Bahasa Indonesia (id)"
        :menuItems="[{ value: id, label: 'Bahasa Indonesia (id)' }]"
        selected="id"
      />
    </div>

    <div class="flex gap-x-2 pb-[24px]">
      <CdxIcon :icon="cdxIconInfoFilled" />
      <CdxLabel
        >Untuk sementara, Lexica hanya tersedia untuk leksem Bahasa
        Indonesia.</CdxLabel
      >
    </div>

    <div
      class="w-full flex flex-col min-[616px]:flex-row min-[616px]:gap-x-[8px] gap-y-[8px] items-center justify-center"
    >
      <CdxButton
        weight="primary"
        action="progressive"
        class="w-full max-w-[384px] py-[5px] rounded-[2px]"
        @click="router.push('/session')"
      >
        <CdxIcon :icon="cdxIconPlay" /> Mulai kontribusi</CdxButton
      >
      <CdxButton
        class="w-full max-w-[384px] py-[5px] rounded-[2px]"
        @click="emit('onHint')"
      >
        <img :src="Lightbulb" alt="Lightbulb" /> Lihat panduan</CdxButton
      >
    </div>
  </div>
</template>
