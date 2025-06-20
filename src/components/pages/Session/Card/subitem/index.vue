<script setup>
import { CdxLabel, CdxIcon, CdxThumbnail } from "@wikimedia/codex";
import {
  cdxIconClose,
  cdxIconLogoWikidata,
  cdxIconArrowPrevious,
} from "@wikimedia/codex-icons";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import expand from "@/assets/expand.svg";
import Loading from "@/components/ui/loading.vue";

const { t } = useI18n({ useScope: "global" });
const emit = defineEmits(["backtoItem, onHold, onRelease, showImage"]);

const props = defineProps({
  data: Object,
  isLoading: Boolean,
  headerData: Object,
  isCurrent: Boolean,
  isFlip: Boolean,
});

const translate = (data) => {
  if (data === "images") {
    return t("session.item.images");
  } else if (data === "instanceOf") {
    return t("session.item.instanceOf");
  } else if (data === "partOf") {
    return t("session.item.partOf");
  } else if (data === "subclass") {
    return t("session.item.subclass");
  } else if (data === "taxonName") {
    return t("session.item.taxonName");
  } else if (data === "hasParts") {
    return t("session.item.hasParts");
  } else if (data === "translation") {
    return t("session.item.translation");
  }
};

const hovered = ref(false);

const statements = computed(() => {
  return props?.data?.statements
    ? [...Object.entries(props?.data?.statements)].filter(
        (item) => item?.[1]?.data?.[0]?.value
      )
    : [];
});

const handleKeyPress = (event) => {
  if (event.key === "Escape") {
    emit("backtoItem");
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header pt-[var(--spacing-100)] pl-[var(--spacing-50)] pb-[var(--spacing-75)] pr-[var(--spacing-100)]] rtl:pl-[var(--spacing-100)] rtl:pr-[var(--spacing-50)] text-white flex test justify-between gap-x-2 relative rounded-t-[14px]"
      :style="{
        background: '#196551',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }"
      @mousedown="emit('onHold')"
      @mouseup="emit('onRelease')"
      @touchstart="emit('onHold')"
      @touchend="emit('onRelease')"
    >
      <div>
        <div
          class="flex items-center gap-x-[var(--spacing-25)] pb-[var(--spacing-25)]"
        >
          <CdxIcon
            :aria-label="t('aria.close')"
            :icon="cdxIconArrowPrevious"
            class="text-white cursor-pointer mx-[var(--spacing-25)] interactable"
            :tabindex="props.isCurrent && props.isFlip && '0'"
            @click="emit('backtoItem')"
            @keydown.space="emit('backtoItem')"
          />
          <h4 class="font-bold text-[18px] pb-0">
            {{ props?.headerData?.label }}
            <span v-if="props?.headerData?.id">
              ({{ props?.headerData?.id }})</span
            >
          </h4>
        </div>

        <div
          class="flex items-center gap-x-2 pb-[var(--spacing-25)] pl-[var(--spacing-50)] rtl:pl-0 rtl:pr-[var(--spacing-50)]"
        >
          <CdxIcon :icon="cdxIconLogoWikidata" class="text-white" />
          <p>
            <b>{{ t("session.item.wikidata") }}</b>
          </p>
        </div>

        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p
          v-if="props?.headerData?.description"
          :key="2"
          class="overflow-hidden text-ellipsis pl-[var(--spacing-50)] rtl:pl-0 rtl:pr-[var(--spacing-50)]"
          :style="{
            whiteSpace: 'wrap',
          }"
        >
          {{ props?.headerData?.description }}
        </p>
        <p v-else class="text-[16px] pb-0 pl-[var(--spacing-50)]">
          <i>{{ t("session.emptyDescription") }}</i>
        </p>
      </div>
    </div>
    <div
      class="p-[16px] overflow-auto bg-white dark:bg-[#101418] h-full rounded-b-[16px]"
    >
      <div v-if="props.isLoading" class="h-full flex flex-col">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <Loading :text="t('session.item.loading')" variant="default" />
        </div>
      </div>

      <div
        v-if="props?.data?.aliases"
        class="rounded-[2px] mb-[var(--spacing-100)] text-[var(--color-base)] p-[var(--spacing-50)] bg-[var(--background-color-neutral)] border border-[var(--border-color-base)]"
      >
        <span class="text-[16px]"
          >{{ t("session.item.aliases") }}
          <b>{{ props?.data?.aliases }}</b></span
        >
      </div>

      <div
        class="h-full"
        v-if="
          statements?.filter((item) => item?.[0] !== 'translation')?.length >
            0 && !props.isLoading
        "
      >
        <CdxLabel
          class="text-[16px] dark:text-[#EAECF0]"
          style="padding-bottom: 12px"
          >{{ t("session.item.statements") }}</CdxLabel
        >
        <div
          v-for="(value, index) in statements.filter(
            (item) => item?.[0] !== 'translation'
          )"
          :key="index"
          class="border border-[var(--border-color-base)] rounded-[2px] p-[12px] mb-[12px]"
          @mouseover="
            () => {
              if (value?.[0] === 'images') hovered = true;
            }
          "
          @mouseout="
            () => {
              if (value?.[0] === 'images') hovered = false;
            }
          "
          :style="hovered && 'cursor: pointer'"
          @click="
            () => {
              if (value?.[0] === 'images' && value?.[1]?.data?.[0]?.url)
                emit('showImage', value?.[1]?.data?.[0]?.url);
            }
          "
        >
          <div class="flex gap-x-[12px] items-center">
            <!-- <div
              v-if="value[0] === 'images'"
              class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
            >
              <img
                :src="value?.[1]?.data?.[0]?.url || placeholder"
                :alt="value?.[1]?.data?.[0]?.value"
                class="object-cover w-full h-full"
              />
            </div> -->

            <div class="relative" v-if="value?.[0] === 'images'">
              <CdxThumbnail
                v-if="value?.[1]?.data?.[0]?.url"
                :thumbnail="{ url: value?.[1]?.data?.[0]?.url }"
                :placeholder-icon="cdxIconLogoWikidata"
              />

              <div class="w-[40px] h-[40px] absolute top-0">
                <img :src="expand" />
              </div>
            </div>

            <div>
              <CdxLabel
                class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0] pointer-events-none"
                >{{ translate(value[0]) }} ({{
                  value?.[1]?.property
                }})</CdxLabel
              >
              <p
                class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
              >
                {{ value?.[1]?.data?.[0]?.value }}
                {{
                  value?.[1]?.data?.[0]?.id && `(${value?.[1]?.data?.[0]?.id})`
                }}
              </p>
            </div>
          </div>
        </div>

        <CdxLabel
          v-if="statements.find((item) => item?.[0] === 'translation')"
          class="text-[16px] pt-[4px]"
          style="padding-bottom: 12px"
          >{{ t("session.item.translation") }} (P5972)</CdxLabel
        >

        <div
          v-for="(value, index) in statements.filter(
            (item) => item?.[0] === 'translation'
          )"
          :key="index"
          class="border border-[var(--border-color-base)] rounded-[2px] p-[12px] mb-[12px]"
        >
          <div class="flex gap-x-[12px]">
            <div>
              <CdxLabel class="text-[16px] pb-[4px] leading-[20px]"
                >{{ value?.[1]?.data?.[0]?.language }} ({{
                  value?.[1]?.data?.[0]?.code
                }})</CdxLabel
              >
              <p
                class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
              >
                {{ value?.[1]?.data?.[0]?.value }}
                ({{ value?.[1]?.data?.[0]?.id }})
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="h-full flex justify-center items-center"
        v-else-if="statements.length === 0 && !props.isLoading"
      >
        <p class="text-[16px] text-[#54595D] dark:text-[#A2A9B1]">
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
