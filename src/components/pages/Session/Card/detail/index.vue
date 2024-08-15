<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import { cdxIconLogoWikidata, cdxIconClose } from "@wikimedia/codex-icons";
import { computed, reactive, ref, toRaw, watch } from "vue";
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

const setInfo = () => {
  isInfo.value = !isInfo.value;
};

const translate = (data) => {
  if (data === "images") {
    return t("session.detail.images");
  } else if (data === "antonym") {
    return t("session.detail.antonym");
  } else if (data === "synonym") {
    return t("session.detail.synonym");
  } else if (data === "locationOfSenseUsage") {
    return t("session.detail.locationOfSenseUsage");
  } else if (data === "languageStyle") {
    return t("session.detail.languageStyle");
  } else if (data === "describedAtUrl") {
    return t("session.detail.describedAtUrl");
  } else if (data === "translation") {
    return t("session.detail.translation");
  }
};

const statements = computed(() => {
  return props?.data?.statements
    ? [...Object.entries(props?.data?.statements)]?.filter(
        (item) => item?.[1]?.data?.[0]?.value
      )
    : [];
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header p-[16px] text-white flex test justify-between relative rounded-t-[16px]"
      :style="{
        background: '#2A4B8D',
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
    <div class="p-[16px] overflow-auto bg-white rounded-b-[16px] h-full">
      <div v-if="props.isLoading">
        <div class="w-full max-w-[896px]">
          <span class="text-[#54595D] text-[16px]">{{
            t("session.detail.loading")
          }}</span>
          <CdxProgressBar class="w-full mt-[8px]"></CdxProgressBar>
        </div>
      </div>

      <div class="h-full" v-if="statements.length > 0 && !props.isLoading">
        <CdxLabel class="text-[16px]" style="padding-bottom: 12px">{{
          t("session.detail.statements")
        }}</CdxLabel>
        <div
          v-for="(value, index) in statements.filter(
            (item) => item?.[0] !== 'translation'
          )"
          :key="index"
          class="border border-[#A2A9B1] rounded-[2px] p-[12px] mb-[12px]"
        >
          <div class="flex gap-x-[12px]">
            <!-- <div
              v-if="value?.[0] === 'images'"
              class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
            >
              <img
                :src="value?.[1]?.data?.[0]?.url || placeholder"
                :alt="value?.[1]?.data?.[0]?.value"
                class="object-cover w-full h-full"
              />
            </div> -->
            <CdxThumbnail
              v-if="value?.[0] === 'images'"
              :thumbnail="{ url: value?.[1]?.data?.[0]?.url }"
              :placeholder-icon="cdxIconLogoWikidata"
            />
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
          >{{ t("session.detail.translation") }}</CdxLabel
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
        <p class="text-[16px] text-[#54595D]">
          <i>{{ t("session.emptyStatement") }}</i>
        </p>
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
