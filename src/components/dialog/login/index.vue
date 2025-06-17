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

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

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
</script>

<template>
  <div>
    <!-- <client-only> -->
    <CdxDialog :open="open" close-button-label="Close" @update:open="close" :class="['min-w-full min-h-full']">
      <template #header>
        <div>
          <div class="w-full">
            <div class="flex w-full justify-between items-center">
              <CdxLabel class="text-[1.125rem]">Masuk</CdxLabel>
              <CdxIcon :aria-label="t('aria.close')" :icon="cdxIconClose" dir="rtl" class="cursor-pointer"
                @click="close" />
            </div>
          </div>
        </div>
      </template>
      <div>
        <iframe class="h-[80vh] w-full"
          src="https://www.mediawiki.org/w/rest.php/oauth2/authorize?client_id=d804e6e8527faede6443d8add46084d8&response_type=code"
          title="Login"></iframe>
      </div>
    </CdxDialog>
    <!-- </client-only> -->
  </div>
</template>

<style>
.cdx-dialog-backdrop>.guide-dialog>.cdx-dialog__header {
  border-bottom: 0.0625rem solid #c8ccd1;
}

.cdx-dialog-backdrop>.guide-dialog-2>.cdx-dialog__header {
  border-bottom: unset;
}

.cdx-dialog-backdrop>.guide-dialog>.cdx-dialog__footer {
  border-top: 0.0625rem solid #c8ccd1;
}

.cdx-dialog-backdrop>.guide-dialog-2>.cdx-dialog__footer {
  border-top: unset;
}

.cdx-dialog__footer {
  padding: 0.75rem !important;
}
</style>
