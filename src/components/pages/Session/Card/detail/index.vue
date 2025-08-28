<script setup>
/**
 * Detail Component - Comprehensive view of lexeme connection information
 * 
 * Displays detailed linguistic data organized into structured sections including
 * lexeme properties, sense-specific information, and related senses with
 * expandable interface for exploring additional language variants.
 * 
 * @component
 */
import { CdxLabel, CdxIcon, CdxThumbnail } from "@wikimedia/codex";
import {
  cdxIconLogoWikidata,
  cdxIconClose,
  cdxIconExpand,
  cdxIconLanguage,
  cdxIconArrowPrevious,
} from "@wikimedia/codex-icons";
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
  toRaw,
  toRef,
  watch,
} from "vue";
import placeholder from "@/assets/placeholder.svg";
import wikimedia from "@/assets/WikidataLexeme.svg";
import { useI18n } from "vue-i18n";
import expand from "@/assets/expand.svg";
import Loading from "@/components/ui/loading.vue";

const { t } = useI18n({ useScope: "global" });
const isInfo = ref(false);

/**
 * Component props definition
 * @prop {Object} data - Complete lexeme connection information
 * @prop {Object} headerData - Header information for display
 * @prop {Boolean} isLoading - Loading state indicator
 * @prop {Object} languages - Language lookup table
 * @prop {String} currLang - Current language code
 * @prop {Boolean} isCurrent - Whether this is the active card
 * @prop {Boolean} isFlip - Whether card is in flipped state
 */
const props = defineProps({
  data: Object,
  headerData: Object,
  isLoading: Boolean,
  languages: Object,
  currLang: String,
  isCurrent: Boolean,
  isFlip: Boolean,
});

/**
 * Component event emitters
 * @emits backtoItem - Navigate back to main card interface
 * @emits onHold - Start of header interaction for drag operations
 * @emits onRelease - End of header interaction
 * @emits showImage - Request image display in lightbox with URL payload
 */
const emit = defineEmits(["backtoItem, onHold, onRelease, showImage"]);

/**
 * Controls expansion state of "Other Senses" section
 * @type {import('vue').Ref<boolean>}
 */
const isExpand = ref(false);

/**
 * Reactive reference to props data for computed properties
 * @type {import('vue').Ref<Object>}
 */
const data = toRef(props, "data");

/**
 * Determines if lexeme-level properties are available for display
 * @returns {boolean} True if any lexeme-level properties exist
 * @see {@link ./DOCS.md#isThisLexeme-computed} For detailed documentation
 */
const isThisLexeme = computed(() => {
  return (
    data?.value?.usageExamples ||
    data?.value?.hasCharacteristics ||
    data?.value?.combinesLexemes
  );
});

/**
 * Checks if current sense has any properties to display
 * @returns {boolean} True if no sense properties are available
 * @see {@link ./DOCS.md#isNoStatement-computed} For detailed documentation
 */
const isNoStatement = computed(() => {
  return (
    !data?.value?.sense?.images &&
    !data?.value?.sense?.languageStyle &&
    !data?.value?.sense?.fieldOfUsage &&
    !data?.value?.sense?.locationOfSenseUsage &&
    !data?.value?.sense?.sematicGender &&
    !data?.value?.sense?.antonym &&
    !data?.value?.sense?.synonym &&
    !data?.value?.sense?.glossQuotes
  );
});

/**
 * Determines if alternative glosses are available
 * @returns {boolean} True if no alternative glosses exist
 * @see {@link ./DOCS.md#noGlosses-computed} For detailed documentation
 */
const noGlosses = computed(() => {
  return data?.value?.sense?.otherGlosses?.length === 0;
});

/**
 * Processes other senses data with formatted language names
 * @returns {Array<Object>} Processed senses with formatted alternative glosses
 * @see {@link ./DOCS.md#langs-computed} For detailed documentation
 */
const langs = computed(() => {
  return data?.value?.otherSenses?.map((item) => {
    return {
      ...item,
      otherGlosses: item?.otherGlosses?.map((x) => {
        return `${x?.value} (${props?.languages?.[x?.language]?.autonym})`;
      }),
    };
  });
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
 * Sets up global keyboard event listeners when component mounts
 * @see {@link ./DOCS.md#onMounted} For detailed documentation
 */
onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
});

/**
 * Cleans up global keyboard event listeners when component unmounts
 * @see {@link ./DOCS.md#onUnmounted} For detailed documentation
 */
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header pt-[var(--spacing-100)] pl-[var(--spacing-50)] pb-[var(--spacing-75)] pr-[var(--spacing-100)] rtl:pl-[var(--spacing-100)] rtl:pr-[var(--spacing-50)] text-white flex test justify-between relative rounded-t-[0.9375rem]"
      :style="{
        background: '#3056A9',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }" @mousedown.stop="emit('onHold')" @mouseup.stop="emit('onRelease')" @touchstart.stop="emit('onHold')"
      @touchend.stop="emit('onRelease')">
      <div class="w-full break-normal">
        <div class="flex items-center gap-x-[var(--spacing-25)] pb-[var(--spacing-25)]">
          <CdxIcon :aria-label="t('aria.close')" :icon="cdxIconArrowPrevious"
            class="text-white cursor-pointer mx-[var(--spacing-25)] interactableeee"
            :tabindex="props.isCurrent && props.isFlip && '0'" @click="emit('backtoItem')"
            @keydown.space="emit('backtoItem')" />
          <h4 class="font-bold text-[1.125rem] leading-[22.5px]">
            {{ props?.headerData?.lemma }}
            <span v-if="props?.headerData?.id">
              ({{ props?.headerData?.id }})</span>
          </h4>
        </div>

        <div
          class="flex items-center gap-x-2 pb-[var(--spacing-25)] pl-[var(--spacing-50)] rtl:pl-0 rtl:pr-[var(--spacing-50)]">
          <img :src="wikimedia" alt="WikidataLexeme" />
          <p>
            <b>{{ t("session.detail.lexeme") }} —
              {{ props?.headerData?.category }}</b>
          </p>
        </div>

        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p :key="2" v-if="props?.headerData?.gloss" :style="{
          wordWrap: 'break-word',
        }" class="pl-[var(--spacing-50)] rtl:pl-0 rtl:pr-[var(--spacing-50)]">
          {{ props.headerData.gloss }}
        </p>

        <p v-else class="text-[1rem] pb-0 pl-[var(--spacing-50)]">
          <i> {{ t("session.emptyDescriptionHead") }} {{ props?.currLang }} </i>
        </p>
      </div>
    </div>
    <div class="p-[1rem] overflow-auto bg-white dark:bg-[#101418] rounded-b-[1rem] h-full">
      <div v-if="props.isLoading" class="h-full flex flex-col">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <Loading :text="t('session.detail.loading')" variant="default" />
        </div>
      </div>

      <div class="h-full" v-if="
        !props.isLoading &&
        (!isNoStatement ||
          isThisLexeme ||
          data?.otherSenses?.length > 0 ||
          !noGlosses)
      ">
        <div v-if="!props.isLoading && isThisLexeme" class="mb-[var(--spacing-100)]">
          <h5 style="padding-bottom: var(---spacing-50)">{{
            t("session.detail.title1") }}</h5>

          <div v-if="data?.usageExamples"
            class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
            <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
              t("session.detail.usageExample") }} ({{
                data?.usageExamples?.property
              }})</span>
            <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
              data?.usageExamples?.data?.[0]?.value
            }}</span>
          </div>

          <div v-if="data?.hasCharacteristics"
            class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
            <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
              t("session.detail.hasCharacteristics") }} ({{
                data?.hasCharacteristics?.property
              }})</span>
            <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
              data?.hasCharacteristics?.data?.[0]?.value }}</span>
          </div>

          <div v-if="data?.combinesLexemes"
            class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
            <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
              t("session.detail.combinesLexemes") }} ({{
                data?.combinesLexemes?.property
              }})</span>
            <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
              data?.combinesLexemes?.data
                ?.map((item) => {
                  return `${item.value} (${item.id})`;
                })
                ?.join(" + ")
            }}</span>
          </div>
        </div>

        <div v-if="!isNoStatement || !noGlosses" class="mb-[var(--spacing-100)]">
          <h5 style="padding-bottom: var(--spacing-50)">
            {{
              t("session.detail.title2") }}</h5>
          <div class="mb-[var(--spacing-50)]" v-if="!isNoStatement">
            <h6 class="mb-[var(--spacing-50)]">{{
              t("session.detail.subtitle1") }}</h6>

            <div v-if="data?.sense?.images"
              class="flex gap-x-[0.75rem] mb-[var(--spacing-50)] border border-[var(--border-color-base)] p-[0.75rem] w-full cursor-pointer"
              @click="
                () => {
                  emit('showImage', data?.sense?.images?.data?.[0]?.url);
                }
              ">
              <div class="relative">
                <CdxThumbnail :thumbnail="{
                  url: data?.sense?.images?.data?.[0]?.url,
                }" :placeholder-icon="cdxIconLogoWikidata" />
                <div class="w-[2.5rem] h-[2.5rem] absolute top-0">
                  <img :src="expand" />
                </div>
              </div>
              <div>
                <CdxLabel class="text-[1rem] pb-[0.2500rem] leading-[1.25rem] dark:text-[#EAECF0] pointer-events-none">
                  {{ t("session.detail.images") }} ({{
                    data?.sense?.images?.property
                  }})</CdxLabel>
                <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[1.375rem]">
                  {{ data?.sense?.images?.data?.[0]?.value }}
                </p>
              </div>
            </div>

            <div v-if="data?.sense?.antonym"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.antonym") }} ({{
                  data?.sense?.antonym?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.antonym?.data?.[0]?.value }}</span>
            </div>

            <div v-if="data?.sense?.synonym"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.synonym") }} ({{
                  data?.sense?.synonym?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.synonym?.data?.[0]?.value }}</span>
            </div>

            <div v-if="data?.sense?.locationOfSenseUsage"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.locationOfSenseUsage") }} ({{
                  data?.sense?.locationOfSenseUsage?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.locationOfSenseUsage?.data?.[0]?.value }}</span>
            </div>

            <div v-if="data?.sense?.languageStyle"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.languageStyle") }} ({{
                  data?.sense?.languageStyle?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.languageStyle?.data?.[0]?.value }}</span>
            </div>

            <div v-if="data?.sense?.describedAtUrl"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.describedAtUrl") }} ({{
                  data?.sense?.describedAtUrl?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.describedAtUrl?.data?.[0]?.value }}</span>
            </div>

            <div v-if="data?.sense?.glossQuotes"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.glossQuotes") }} ({{
                  data?.sense?.glossQuotes?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.glossQuotes?.data?.[0]?.value }}</span>
            </div>

            <div v-if="data?.sense?.sematicGender"
              class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
              <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                t("session.detail.sematicGender") }} ({{
                  data?.sense?.sematicGender?.property
                }})</span>
              <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{
                data?.sense?.sematicGender?.data?.[0]?.value }}</span>
            </div>
          </div>

          <div v-if="!props.isLoading && !noGlosses">
            <h6 class="mb-[var(--spacing-50)]">{{
              t("session.detail.subtitle2") }}</h6>

            <div v-for="item in data?.sense?.otherGlosses">
              <div
                class="border-[0.0625rem] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[0.1250rem] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]">
                <span class="text-[var(--color-base)] text-[1rem] font-[700] leading-[1.25rem]">{{
                  props?.languages?.[item?.language]?.autonym }} ({{
                    item?.language
                  }})</span>
                <span class="text-[var(--color-subtle)] text-[1rem] leading-[1.375rem]">{{ item?.value }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- <v-expansion-panels theme="dark">
          <v-expansion-panel
            theme="dark"
            :title="t('session.detail.title3')"
            class="bg-[var(--background-color-neutral)] detail"
          >
            <template #title>
              <div
                class="bg-[green] text-[var(--color-base)] font-[700] text-[1rem]"
              >
                {{ t("session.detail.title3") }}
              </div>
            </template>
</v-expansion-panel>
</v-expansion-panels> -->

        <div
          class="px-[var(--spacing-75)] pt-[var(--spacing-75)] bg-[var(--background-color-neutral)] text-[var(--color-base)] rounded-[var(--border-radius-base)] border border-[var(--border-color-base)] mb-[var(--spacing-100)]"
          v-if="data?.otherSenses?.length > 0">
          <div class="pb-[var(--spacing-75)] flex align-center justify-between cursor-pointer"
            @click="isExpand = !isExpand">
            <h5>{{ t("session.detail.title3") }}</h5>

            <CdxIcon :icon="cdxIconExpand" :class="`icon ${isExpand && 'open'}`" />
          </div>
          <v-expand-transition class="duration-[250ms] ease-out pb-[var(--spacing-75)] interactable">
            <div v-show="isExpand">
              <div v-for="(item, i) in langs" :key="item.senseNumber">
                <h6 :class="[
                  i !== 0 && 'mt-[var(--spacing-50)]',
                ]">
                  {{ t("session.detail.sense") }} {{ item?.senseNumber }}:
                  {{ item?.gloss }}
                </h6>
                <div
                  class="text-[1rem] p-[var(--spacing-75)] mt-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[0.1250rem]"
                  v-if="item?.itemForThisSense?.data?.[0]?.value">
                  <div class="font-[700]">
                    {{ t("session.detail.itemForThisSense") }} ({{
                      item?.itemForThisSense?.property
                    }})
                  </div>
                  <div class="text-[var(--color-subtle)]">
                    {{ item?.itemForThisSense?.data?.[0]?.value }}
                  </div>
                </div>

                <div
                  class="text-[1rem] p-[var(--spacing-75)] mt-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[0.1250rem] flex"
                  v-if="item?.otherGlosses?.length > 0">
                  <CdxIcon :icon="cdxIconLanguage" />
                  <div class="text-[1rem] pl-[var(--spacing-75)]">
                    <div class="font-[700]">
                      {{ t("session.detail.otherGlosses") }}
                    </div>
                    <div class="text-[var(--color-subtle)]">
                      {{ item?.otherGlosses?.join(", ") || "" }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex gap-x-[0.75rem] mt-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] p-[var(--spacing-75)] w-full text-[1rem] cursor-pointer"
                  v-if="item.images" @click="
                    () => {
                      emit('showImage', item?.images?.data?.[0]?.url);
                    }
                  ">
                  <div class="relative">
                    <CdxThumbnail :thumbnail="{
                      url: item?.images?.data?.[0]?.url,
                    }" :placeholder-icon="cdxIconLogoWikidata" />
                    <div class="w-[2.5rem] h-[2.5rem] absolute top-0">
                      <img :src="expand" />
                    </div>
                  </div>
                  <div>
                    <CdxLabel
                      class="text-[1rem] pb-[0.2500rem] leading-[1.25rem] dark:text-[#EAECF0] pointer-events-none">
                      {{ t("session.detail.images") }} ({{
                        item?.images?.property
                      }})</CdxLabel>
                    <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[1.375rem]">
                      {{ item?.images?.data?.[0]?.value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>
      </div>
      <div class="h-full flex justify-center items-center" v-else-if="
        !props.isLoading &&
        isNoStatement &&
        !isThisLexeme &&
        data?.otherSenses?.length === 0 &&
        noGlosses
      ">
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

.icon {
  transition: transform 250ms ease-out;
}

.open {
  -ms-transform: rotate(-180deg);
  transform: rotate(-180deg);
}

.smooth-enter-active,
.smooth-leave-active {
  transition: height 0.25s;
  overflow: hidden;
}

.smooth-enter,
.smooth-leave-to {
  height: 0;
}
</style>
