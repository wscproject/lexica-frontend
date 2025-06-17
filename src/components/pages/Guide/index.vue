<script setup>
import { CdxLabel, CdxIcon, CdxButton } from "@wikimedia/codex";
import PartOne from "@/components/pages/Guide/part/one/index.vue";
import PartTwo from "@/components/pages/Guide/part/two/index.vue";
import PartThree from "@/components/pages/Guide/part/three/index.vue";
import PartFour from "@/components/pages/Guide/part/four/index.vue";

import { ref } from "vue";
import { cdxIconNext } from "@wikimedia/codex-icons";
import ButtonPrimary from "@/components/buttons/ButtonPrimary/index.vue";

const curr = ref(1);

const moveCurr = (action) => {
  switch (action) {
    case "prev":
      curr.value = curr.value - 1;
      break;
    case "next":
      curr.value = curr.value + 1;
      break;
    default:
      break;
  }
};
</script>

<template>
  <div class="relative">
    <div class="fixed bg-white w-full">
      <div class="px-[1rem] pt-[1.375rem]">
        <CdxLabel class="text-[1.125rem]">Panduan</CdxLabel>
      </div>
      <div :class="[
        (curr === 2 || curr === 3) && 'border-b border-[#C8CCD1]',
        'flex items-center gap-x-2 px-[1rem] pb-[0.75rem] ',
      ]">
        <p class="title">{{ curr }} dari 4</p>
        <div class="flex gap-x-2">
          <div :key="n" v-for="n in 4" @click="moveCurr('next')" :class="[
            'w-[0.5rem] h-[0.5rem] rounded-full',
            curr >= n ? 'bg-[#202122]' : 'bg-[#C8CCD1]',
          ]" />
        </div>
      </div>
    </div>
    <div class="pt-[4.875rem] pb-[4.125rem]">
      <PartOne v-if="curr === 1" />
      <PartTwo v-if="curr === 2" />
      <PartThree v-if="curr === 3" />
      <PartFour v-if="curr === 4" />
    </div>
    <div :class="[
      (curr === 2 || curr === 3) && 'border-t border-[#C8CCD1]',
      'fixed bottom-0 bg-white w-full h-[4.125rem]',
    ]"></div>

    <div class="px-[1rem] flex gap-x-[0.75rem] bottom-[1rem] right-0 fixed">
      <CdxButton v-if="curr !== 1" class="w-[2.125rem] h-[2.125rem]" @click="moveCurr('prev')">
        <CdxIcon :icon="cdxIconNext" dir="rtl" />
      </CdxButton>
      <ButtonPrimary :class="['h-[2.125rem]', curr !== 4 ? 'w-[2.125rem]' : 'w-fit']" @click="moveCurr('next')">
        <CdxIcon v-if="curr !== 4" :icon="cdxIconNext" />
        <span v-else-if="curr === 4">Mulai kontribusi</span>
      </ButtonPrimary>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.375rem;
  letter-spacing: -0.042px;
}
</style>
