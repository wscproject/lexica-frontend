<script setup>
import { CdxDialog, CdxLabel, CdxButton, CdxIcon } from "@wikimedia/codex";
import { ref } from "vue";
import PartOne from "@/components/pages/Guide/part/one/index.vue";
import PartTwo from "@/components/pages/Guide/part/two/index.vue";
import PartThree from "@/components/pages/Guide/part/three/index.vue";
import PartFour from "@/components/pages/Guide/part/four/index.vue";
import { cdxIconNext, cdxIconClose } from "@wikimedia/codex-icons";
import ButtonPrimary from "@/components/buttons/ButtonPrimary/index.vue";
import ClientOnly from "vue-client-only";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();

const emit = defineEmits(["onPrimaryAction, toSession"]);

const close = () => {
  emit("onPrimaryAction", false);
};

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

const toSession = () => {
  close();
  emit("toSession");
};
</script>

<template>
  <div class="guide-dialog-main">
    <!-- <client-only> -->
    <CdxDialog :open="open" title="Save changes" close-button-label="Close" @update:open="close" :class="[
      curr === 2 || curr === 3 ? 'guide-dialog' : 'guide-dialog-2',
      'min-w-full min-h-full guide border-0 rounded-0 guide-main',
    ]">
      <template #header>
        <div class="w-full header-guide">
          <div class="w-full">
            <div class="flex w-full justify-between items-center">
              <CdxLabel class="text-[1.125rem]">{{ t("tutorial.title") }}</CdxLabel>
              <CdxButton :aria-label="t('aria.close')" @click="close" weight="quiet">
                <CdxIcon :icon="cdxIconClose" dir="rtl" class="cursor-pointer" />
              </CdxButton>
            </div>
            <div :class="['flex items-center gap-x-2']">
              <p class="title">{{ curr }} {{ t("tutorial.of") }} 4</p>
              <div class="flex gap-x-2">
                <div :key="n" v-for="n in 4" :class="[
                  'w-[0.5rem] h-[0.5rem] rounded-full',
                  curr >= n
                    ? 'bg-[#202122] dark:bg-[#FFFFFFA6]'
                    : 'bg-[#C8CCD1] dark:bg-[#54595D]',
                ]" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="flex items-center flex-col w-full pt-[5.3125rem] pb-[5.625rem]">
        <PartOne v-if="curr === 1" />
        <PartTwo v-if="curr === 2" />
        <PartThree v-if="curr === 3" />
        <PartFour v-if="curr === 4" />
      </div>
      <template #footer>
        <div class="flex gap-x-[0.75rem] w-full justify-end">
          <CdxButton v-if="curr !== 1" class="w-[2.125rem] h-[2.125rem]" @click="moveCurr('prev')">
            <CdxIcon :icon="cdxIconNext" dir="rtl" />
          </CdxButton>
          <CdxButton :class="['h-[2.125rem]', curr !== 4 ? 'w-[2.125rem]' : 'w-fit']"
            @click="curr !== 4 ? moveCurr('next') : toSession()" weight="primary" action="progressive">
            <CdxIcon v-if="curr !== 4" :icon="cdxIconNext" />
            <span v-else-if="curr === 4">{{ t("tutorial.start") }}</span>
          </CdxButton>
        </div>
      </template>
    </CdxDialog>
    <!-- </client-only> -->
  </div>
</template>

<style scoped>
.guide-main .cdx-dialog__footer {
  @apply bg-[#fff] dark:bg-[#101418] absolute bottom-0 w-[100%];
}

.header-guide {
  position: absolute;
  width: 100%;
  z-index: 10;

  top: 0;
  left: 0;
  padding: 1rem 1rem 1rem 0.75rem;
}

.guide-dialog .header-guide {
  @apply border-b border-[#c8ccd1] dark:border-[#54595D] bg-[#fff] dark:bg-[#101418];
}

.guide-dialog-2 .header-guide {
  @apply bg-[#fff] dark:bg-[#101418];
}

.cdx-dialog__header {
  @apply p-0;
}

.cdx-dialog-backdrop>.guide-dialog>.cdx-dialog__header {
  border: unset;
}

.cdx-dialog-backdrop>.guide-dialog-2>.cdx-dialog__header {
  border-bottom: unset;
}

.cdx-dialog-backdrop>.guide-dialog>.cdx-dialog__footer {
  border-top: unset;
}

.cdx-dialog-backdrop>.guide-dialog-2>.cdx-dialog__footer {
  border-top: unset;
}

.cdx-dialog__footer {
  padding: 0.75rem !important;
}

.guide .cdx-dialog__header {
  display: flex !important;
  align-items: center !important;
}

.guide .cdx-dialog__footer {
  padding: 1.5rem 1rem !important;
}
</style>
