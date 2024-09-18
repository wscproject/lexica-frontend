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

const emit = defineEmits(["onPrimaryAction"]);

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
  router.push("/session");
};
</script>

<template>
  <div>
    <!-- <client-only> -->
    <CdxDialog
      :open="open"
      title="Save changes"
      close-button-label="Close"
      @update:open="close"
      :class="[
        curr === 2 || curr === 3 ? 'guide-dialog' : 'guide-dialog-2',
        'min-w-full min-h-full guide border-0 rounded-0',
      ]"
    >
      <template #header>
        <div class="w-full">
          <div class="w-full">
            <div class="flex w-full justify-between items-center">
              <CdxLabel class="text-[18px]">{{ t("tutorial.title") }}</CdxLabel>
              <CdxButton @click="close" weight="quiet">
                <CdxIcon
                  :icon="cdxIconClose"
                  dir="rtl"
                  class="cursor-pointer"
                />
              </CdxButton>
            </div>
            <div :class="['flex items-center gap-x-2']">
              <p class="title">{{ curr }} {{ t("tutorial.of") }} 4</p>
              <div class="flex gap-x-2">
                <div
                  :key="n"
                  v-for="n in 4"
                  :class="[
                    'w-[8px] h-[8px] rounded-full',
                    curr >= n
                      ? 'bg-[#202122] dark:bg-[#FFFFFFA6]'
                      : 'bg-[#C8CCD1] dark:bg-[#54595D]',
                  ]"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <div class="flex items-center flex-col w-full">
        <PartOne v-if="curr === 1" />
        <PartTwo v-if="curr === 2" />
        <PartThree v-if="curr === 3" />
        <PartFour v-if="curr === 4" />
      </div>
      <template #footer>
        <div class="flex gap-x-[12px] w-full justify-end">
          <CdxButton
            v-if="curr !== 1"
            class="w-[34px] h-[34px]"
            @click="moveCurr('prev')"
          >
            <CdxIcon :icon="cdxIconNext" dir="rtl" />
          </CdxButton>
          <CdxButton
            :class="['h-[34px]', curr !== 4 ? 'w-[34px]' : 'w-fit']"
            @click="curr !== 4 ? moveCurr('next') : toSession()"
            weight="primary"
            action="progressive"
          >
            <CdxIcon v-if="curr !== 4" :icon="cdxIconNext" />
            <span v-else-if="curr === 4">{{ t("tutorial.start") }}</span>
          </CdxButton>
        </div>
      </template>
    </CdxDialog>
    <!-- </client-only> -->
  </div>
</template>

<style>
.cdx-dialog-backdrop > .guide-dialog > .cdx-dialog__header {
  @apply border-b border-[#c8ccd1] dark:border-[#54595D];
}

.cdx-dialog-backdrop > .guide-dialog-2 > .cdx-dialog__header {
  border-bottom: unset;
}

.cdx-dialog-backdrop > .guide-dialog > .cdx-dialog__footer {
  border-top: unset;
}

.cdx-dialog-backdrop > .guide-dialog-2 > .cdx-dialog__footer {
  border-top: unset;
}

.cdx-dialog__footer {
  padding: 12px !important;
}

.guide .cdx-dialog__header {
  display: flex !important;
  align-items: center !important;
  padding: 16px 16px 12px !important;
}

.guide .cdx-dialog__footer {
  padding: 24px 16px !important;
}
</style>
