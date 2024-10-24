<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import { cdxIconLogoWikidata, cdxIconClose } from "@wikimedia/codex-icons";
import { computed, ref, watch } from "vue";
import placeholder from "@/assets/placeholder.svg";
import wikimedia from "@/assets/WikidataLexeme.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const isInfo = ref(false);

const props = defineProps({
  data: Object,
  headerData: Object,
  isLoading: Boolean,
});

const emit = defineEmits(["backtoItem, onHold, onRelease"]);

const senses = computed(() => {
  const data = props?.data?.senses?.map((item, idx) => {
    const inside = Object.keys(item).map((key) => ({
      label: key,
      value: item[key],
    }));

    return {
      number: idx + 1,
      data: inside,
    };
  });

  console.log(props?.data);

  return data;
});

watch(props, () => {
  console.log(senses?.value);
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header p-[16px] text-white flex test justify-between relative rounded-t-[15px]"
      :style="{
        background: '#3056A9',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }"
      @mousedown.stop="emit('onHold')"
      @mouseup.stop="emit('onRelease')"
      @touchstart.stop="emit('onHold')"
      @touchend.stop="emit('onRelease')"
    >
      <div class="w-full break-normal">
        <CdxLabel class="text-[18px] pb-[4px] leading-[22.5px]">{{
          props?.headerData?.lemma
        }}</CdxLabel>

        <div class="flex items-center gap-x-2 pb-[4px]">
          <img :src="wikimedia" alt="WikidataLexeme" />
          <p>
            <b
              >{{ t("session.detail.lexeme") }} —
              {{ props?.headerData?.category }}</b
            >
          </p>
        </div>

        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p
          :key="2"
          v-if="props?.headerData?.gloss"
          :style="{
            wordWrap: 'break-word',
          }"
        >
          {{ props.headerData.gloss }}
        </p>

        <p v-else class="text-[16px] p-0">
          <i>{{ t("session.emptyDescription") }}</i>
        </p>
      </div>
      <div>
        <CdxIcon
          :icon="cdxIconClose"
          class="text-white cursor-pointer"
          @click.stop="emit('backtoItem')"
        />
      </div>
    </div>
    <div
      class="p-[16px] overflow-auto bg-white dark:bg-[#101418] rounded-b-[16px] h-full"
    >
      <div v-if="props.isLoading">
        <div class="w-full max-w-[896px]">
          <span class="text-[#54595D] text-[16px] dark:text-[#A2A9B1]">{{
            t("session.detail.loading")
          }}</span>
          <CdxProgressBar class="w-full mt-[8px]"></CdxProgressBar>
        </div>
      </div>

      <div class="h-full">
        <div v-for="sense in senses">
          <div v-for="data in sense?.data?.filter((i) => i.value !== null)">
            <div v-if="data.label === 'gloss'" class="pb-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] font-[700]"
                >Makna {{ sense.number }}: {{ data.value }}</span
              >
            </div>

            <div
              v-else
              class="mb-[var(--spacing-50)] border border-[var(--border-color-base)] p-[12px]"
            >
              <span class="text-[var(--color-base)] font-[700]"
                >{{ data.label }} ({{ data?.value?.property }})</span
              >
              <span class="text-[var(--color-base)] font-[700]"
                >{{
                  data?.value?.data
                    ?.map((item) => {
                      return `${item.value} (${item.id})`;
                    })
                    .join(", ")
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div
        class="h-full flex justify-center items-center"
        v-else-if="statements.length === 0 && !props.isLoading"
      >
        <p class="text-[16px] text-[#54595D] dark:text-[#A2A9B1]">
          <i>{{ t("session.emptyStatement") }}</i>
        </p>
      </div> -->
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
