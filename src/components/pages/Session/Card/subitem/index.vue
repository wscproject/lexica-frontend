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

/**
 * Translates statement property keys to localized display text
 * @param {string} data - Property key to translate (e.g., "images", "instanceOf")
 * @returns {string} Localized translation string
 * @see {@link ./DOCS.md#translate} For detailed documentation
 */
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

/**
 * Computes filtered and processed statement data from entity information
 * @returns {Array<[string, Object]>} Array of statement entries with valid data
 * @see {@link ./DOCS.md#statements} For detailed documentation
 */
const statements = computed(() => {
  return props?.data?.statements
    ? [...Object.entries(props?.data?.statements)].filter(
      (item) => item?.[1]?.data?.[0]?.value
    )
    : [];
});

/**
 * Handles global keyboard events for component navigation
 * @param {KeyboardEvent} event - Keyboard event object
 * @see {@link ./DOCS.md#handleKeyPress} For detailed documentation
 */
const handleKeyPress = (event) => {
  if (event.key === "Escape") {
    emit("backtoItem");
  }
};

/**
 * Sets up global keyboard event listeners on component mount
 * @see {@link ./DOCS.md#onMounted} For detailed documentation
 */
onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

/**
 * Cleans up global keyboard event listeners on component unmount
 * @see {@link ./DOCS.md#onUnmounted} For detailed documentation
 */
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header pt-[var(--spacing-100)] pl-[var(--spacing-50)] pb-[var(--spacing-75)] pr-[var(--spacing-100)]] rtl:pl-[var(--spacing-100)] rtl:pr-[var(--spacing-50)] text-white flex test justify-between gap-x-2 relative rounded-t-[0.8750rem]"
      :style="{
        background: '#196551',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }" @mousedown="emit('onHold')" @mouseup="emit('onRelease')" @touchstart="emit('onHold')"
      @touchend="emit('onRelease')">
      <div>
        <div class="flex items-center gap-x-[var(--spacing-25)] pb-[var(--spacing-25)]">
          <CdxIcon :aria-label="t('aria.close')" :icon="cdxIconArrowPrevious"
            class="text-white cursor-pointer mx-[var(--spacing-25)] interactable"
            :tabindex="props.isCurrent && props.isFlip && '0'" @click="emit('backtoItem')"
            @keydown.space="emit('backtoItem')" />
          <h4 class="font-bold text-[1.125rem] pb-0">
            {{ props?.headerData?.label }}
            <span v-if="props?.headerData?.id">
              ({{ props?.headerData?.id }})</span>
          </h4>
        </div>

        <div
          class="flex items-center gap-x-2 pb-[var(--spacing-25)] pl-[var(--spacing-50)] rtl:pl-0 rtl:pr-[var(--spacing-50)]">
          <CdxIcon :icon="cdxIconLogoWikidata" class="text-white" />
          <p>
            <b>{{ t("session.item.wikidata") }}</b>
          </p>
        </div>

        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p v-if="props?.headerData?.description" :key="2"
          class="overflow-hidden text-ellipsis pl-[var(--spacing-50)] rtl:pl-0 rtl:pr-[var(--spacing-50)]" :style="{
            whiteSpace: 'wrap',
          }">
          {{ props?.headerData?.description }}
        </p>
        <p v-else class="text-[1rem] pb-0 pl-[var(--spacing-50)]">
          <i>{{ t("session.emptyDescription") }}</i>
        </p>
      </div>
    </div>
    <div class="p-[1rem] overflow-auto bg-white dark:bg-[#101418] h-full rounded-b-[1rem]">
      <div v-if="props.isLoading" class="h-full flex flex-col">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <Loading :text="t('session.item.loading')" variant="default" />
        </div>
      </div>

      <div v-if="props?.data?.aliases"
        class="rounded-[0.1250rem] mb-[var(--spacing-100)] text-[var(--color-base)] p-[var(--spacing-50)] bg-[var(--background-color-neutral)] border border-[var(--border-color-base)]">
        <span class="text-[1rem]">{{ t("session.item.aliases") }}
          <b>{{ props?.data?.aliases }}</b></span>
      </div>

      <div v-if="
        statements?.filter((item) => item?.[0] !== 'translation')?.length >
        0 && !props.isLoading
      ">
        <h5 style="padding-bottom: var(--spacing-50)">{{
          t("session.item.statements")
        }}</h5>
        <div v-for="(value, index) in statements.filter(
          (item) => item?.[0] !== 'translation'
        )" :key="index" :class="['border border-[var(--border-color-base)] rounded-[0.1250rem] p-[0.75rem]',
          index !== statements.length - 1 ? 'mb-[0.75rem]' : ''
        ]" @mouseover="
          () => {
            if (value?.[0] === 'images') hovered = true;
          }
        " @mouseout="
          () => {
            if (value?.[0] === 'images') hovered = false;
          }
        " :style="hovered && 'cursor: pointer'" @click="
            () => {
              if (value?.[0] === 'images' && value?.[1]?.data?.[0]?.url)
                emit('showImage', value?.[1]?.data?.[0]?.url);
            }
          ">
          <div class="flex gap-x-[0.75rem] items-center">
            <!-- <div
              v-if="value[0] === 'images'"
              class="border border-[#C8CCD1] rounded-[0.1250rem] overflow-hidden w-[3rem] h-[3rem] shrink-0"
            >
              <img
                :src="value?.[1]?.data?.[0]?.url || placeholder"
                :alt="value?.[1]?.data?.[0]?.value"
                class="object-cover w-full h-full"
              />
            </div> -->

            <div class="relative" v-if="value?.[0] === 'images'">
              <CdxThumbnail v-if="value?.[1]?.data?.[0]?.url" :thumbnail="{ url: value?.[1]?.data?.[0]?.url }"
                :placeholder-icon="cdxIconLogoWikidata" />

              <div class="w-[2.5rem] h-[2.5rem] absolute top-0">
                <img :src="expand" />
              </div>
            </div>

            <div>
              <CdxLabel class="text-[1rem] pb-[0.2500rem] leading-[1.25rem] dark:text-[#EAECF0] pointer-events-none">{{
                translate(value[0]) }} ({{
                  value?.[1]?.property
                }})</CdxLabel>
              <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[1.375rem]">
                {{ value?.[1]?.data?.[0]?.value }}
                {{
                  value?.[1]?.data?.[0]?.id && `(${value?.[1]?.data?.[0]?.id})`
                }}
              </p>
            </div>
          </div>
        </div>

        <h5 v-if="statements.find((item) => item?.[0] === 'translation')" style="padding-bottom: var(--spacing-50)">{{
          t("session.item.translation") }} (P5972)</h5>

        <div v-for="(value, index) in statements.filter(
          (item) => item?.[0] === 'translation'
        )" :key="index"
          :class="['border border-[var(--border-color-base)] rounded-[0.1250rem] p-[0.75rem]', index !== statements.length - 1 ? 'mb-[0.75rem]' : '']">
          <div class="flex gap-x-[0.75rem]">
            <div>
              <CdxLabel class="text-[1rem] pb-[0.2500rem] leading-[1.25rem]">{{ value?.[1]?.data?.[0]?.language }} ({{
                value?.[1]?.data?.[0]?.code
              }})</CdxLabel>
              <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[1.375rem]">
                {{ value?.[1]?.data?.[0]?.value }}
                ({{ value?.[1]?.data?.[0]?.id }})
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full flex justify-center items-center" v-else-if="statements.length === 0 && !props.isLoading">
        <p class="text-[1rem] text-[#54595D] dark:text-[#A2A9B1]">
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
