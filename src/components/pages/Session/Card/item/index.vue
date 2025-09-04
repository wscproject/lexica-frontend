<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxButton,
  CdxSearchInput,
  CdxThumbnail,
} from "@wikimedia/codex";
import { cdxIconInfoFilled, cdxIconLogoWikidata } from "@wikimedia/codex-icons";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  toRaw,
  toRef,
  watch,
} from "vue";
import debounce from "lodash.debounce";
import { useI18n } from "vue-i18n";
import noData from "@/assets/endofresult.svg";
import noDataDark from "@/assets/endofresult-dark.svg";
import { useStore } from "vuex";
import { useDirWatcher } from "@/helper/useDirWatcher";
import Loading from "@/components/ui/loading.vue";

const vuex = useStore();
const { dir } = useDirWatcher();

const { t } = useI18n({ useScope: "global" });
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
const searchRef = ref(null)
const isInfo = ref(false);
const selectedItem = ref(null);
const detailData = ref(null);
const isLoading = ref(false);
const radioButtons = ref([]);
const radioButtons2 = ref([]);

const search = ref("");

const isSearch = ref(false);

const emit = defineEmits([
  "gotoDetail, gotoSubItemDetail, onHold, onRelease, gotoReview, selectItem, setSearch, loadMore",
]);
const props = defineProps({
  data: Object,
  recommendation: Array,
  keyword: String,
  searchLoading: Boolean,
  recommendedLoading: Boolean,
  loadmoreLoading: Boolean,
  noLoadData: Boolean,
  isCurrent: Boolean,
});
const recs = toRef(props, "recommendation");

const recommendation = toRef(props, "recommendation");

const isScrollBar = ref(false);

const recommendationSearch = ref([]);

/**
 * Toggles the info display state
 * @see {@link ./DOCS.md#setInfo} For detailed documentation
 */
const setInfo = () => {
  isInfo.value = !isInfo.value;
};

/**
 * Moves focus to the specified recommendation item
 * @param {number} newIndex - Index of the recommendation item to focus on
 * @see {@link ./DOCS.md#moveSelectionRec} For detailed documentation
 */
const moveSelectionRec = (newIndex) => {
  if (
    isSearch.value &&
    (newIndex < 0 ||
      newIndex >= recommendation?.filter((item, i) => i <= 2)?.length)
  )
    return;

  // Move focus to the newly selected element
  nextTick(() => {
    radioButtons.value[newIndex]?.focus();
  });
};

/**
 * Moves focus to the specified search result item
 * @param {number} newIndex - Index of the search result item to focus on
 * @see {@link ./DOCS.md#moveSelectionSearch} For detailed documentation
 */
const moveSelectionSearch = (newIndex) => {
  if (
    !isSearch.value &&
    (newIndex < 0 || newIndex >= recommendation?.length)
  )
    return;

  // Move focus to the newly selected element
  nextTick(() => {
    radioButtons2.value[newIndex]?.focus();
  });
};

/**
 * Selects an item and stores its details
 * @param {string|number} n - ID of the selected item
 * @param {Object} value - Complete item data object
 * @see {@link ./DOCS.md#selectItem} For detailed documentation
 */
const selectItem = (n, value) => {
  selectedItem.value = n;
  detailData.value = value;
  emit("selectItem");
};

/**
 * Splits text into segments for highlighting search matches
 * @param {string} text - Text to be highlighted
 * @param {string} searchTerm - Search term to highlight
 * @returns {Array<string>} Array of text segments
 * @see {@link ./DOCS.md#highlightText} For detailed documentation
 */
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return [text];
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex);
};

/**
 * Handles search input with debounced processing
 * @see {@link ./DOCS.md#onInput} For detailed documentation
 */
const onInput = debounce(() => {
  if (search.value === "") {
    isSearch.value = false;
    selectedItem.value = null;
    emit("setSearch", search.value);

    recommendationSearch.value = [];
  } else {
    isSearch.value = true;
    emit("setSearch", search.value);
  }

  searchRef.value.focus()

}, 500);

watch(search, () => {
  if (search.value === '') {
    isSearch.value = false;
    emit("setSearch", search.value);
  }
})

// watch(recs, async () => {
//   await nextTick();

//   // const div = document.getElementById("rec-container");
//   // isScrollBar.value = div.scrollHeight > div.clientHeight;

//   // console.log(div.scrollHeight > div.clientHeight);

//   if (radioButtons2.value) {
//     const test = toRaw(radioButtons2?.value);
//     test?.[recs?.value?.length - 10]?.focus();

//     // radioButtons2?.value
//   }
// });


/**
 * Computes text alignment for gloss based on language direction
 * @returns {string} CSS text alignment value ("left" or "right")
 * @see {@link ./DOCS.md#glossAlign} For detailed documentation
 */
const glossAlign = computed(() => {
  if (dir.value === "rtl") {
    if (props?.data?.language?.isRtl === "ltr") {
      return "right";
    } else {
      return "right";
    }
  } else {
    return "left";
  }
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full dark:bg-black rounded-[0.9375rem]">
    <div class="p-[1rem] text-white test flex header gap-x-2 w-full" :style="{
      background: '#3056A9',
      alignItems: 'center',
    }" @mousedown="emit('onHold')" @mouseup="emit('onRelease')" @touchstart="emit('onHold')"
      @touchend="emit('onRelease')">
      <div :style="{
        minWidth: '200px',
        width: '100%',
        position: 'relative',
      }">
        <h4 class="font-bold text-[1.125rem] pb-0 text-[var(--color-inverted-fixed)]">
          {{ props?.data?.lemma }} ({{ props?.data?.externalLexemeSenseId }})
        </h4>
        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p v-if="props?.data?.gloss" :dir="data?.language?.isRtl ? 'rtl' : 'ltr'"
          :class="['overflow-hidden text-ellipsis']" :style="{
            whiteSpace: 'nowrap',
            textAlign: glossAlign,
          }">
          {{ props.data.gloss }}
        </p>

        <p v-else class="text-[1rem] p-0">
          <i>
            {{ t("session.emptyDescriptionHead") }}
            {{ data?.language?.title }}
          </i>
        </p>
      </div>
      <div>
        <CdxIcon :aria-label="t('aria.showLexemeDetail')" :icon="cdxIconInfoFilled" :tabindex="props.isCurrent && '0'"
          class="text-white cursor-pointer interactable" @click.stop="(e) => emit('gotoDetail', e)"
          @keydown.space="(e) => emit('gotoDetail', e)" />
      </div>
    </div>
    <div :class="[
      'px-[1rem] overflow-auto bg-white h-full pt-[0.75rem] pb-[0.75rem] dark:bg-[#101418] flex flex-col',
      props.isCurrent ? '' : 'hidden',
      // isScrollBar && 'interactable',
    ]">
      <h5 style="padding-bottom: 1rem">{{ t("session.main.title") }}
      </h5>
      <div class="relative">
        <CdxSearchInput :dir="dir" aria-label="SearchInput default demo" :placeholder="t('session.main.search')"
          ref="searchRef" class="pb-[1rem] relative interactable" v-model="search" @input="onInput" clearable="true" />

        <div class="progress absolute top-0" v-if="props.searchLoading">
          <div class="progress-bar progress-bar-info progress-bar-striped active" style="width: 100%"></div>
        </div>
      </div>

      <div v-if="props.recommendedLoading" class="h-full">
        <div class="w-full h-full flex flex-col justify-center items-center">
          <Loading :text="t('session.recLoading')" variant="default" />
        </div>
      </div>

      <div v-if="
        !isSearch &&
        recommendation?.length === 0 &&
        !props.searchLoading &&
        !props.recommendedLoading
      ">
        <p class="text-[1rem] text-[var(--color-subtle)]">
          <i>{{ t("session.main.emptySuggestion1") }}</i>
        </p>
        <p class="text-[1rem] text-[var(--color-subtle)]">
          <i>{{ t("session.main.emptySuggestion2") }}</i>
        </p>
      </div>
      <div v-if="
        !isSearch &&
        recommendation?.length > 0 &&
        !props.searchLoading &&
        !props.recommendedLoading
      " class="container">
        <h6 class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0.5rem]" style="padding-bottom: 1rem">
          <b>{{ t("session.main.recommendation") }}</b>
        </h6>
        <div role="radiogroup">
          <div v-for="(value, index) in recommendation?.filter(
            (item, i) => i <= 2
          )" ref="radioButtons" tabindex="0" role="radio" :key="index" :class="[
            value.id === selectedItem
              ? 'border-[0.1250rem] border-[var(--border-color-progressive--focus)] bg-[#EAF3FF] dark:bg-[#1C2940]'
              : 'border border-[var(--border-color-base)] ',
            'rounded-[0.1250rem] p-[0.75rem] flex items-center gap-x-2 mb-[0.5rem] cursor-pointer justify-between',
            !isSearch && 'recommendation-box',
          ]" @click.prevent="selectItem(value.id, value)" @keydown.space="selectItem(value.id, value)"
            @keydown.enter="selectItem(value.id, value)" @keydown.left="moveSelectionRec(index - 1)"
            @keydown.right="moveSelectionRec(index + 1)" @keydown.up="moveSelectionRec(index - 1)"
            @keydown.down="moveSelectionRec(index + 1)">
            <div class="flex gap-x-[0.75rem]">
              <!-- <div
              class="border border-[#C8CCD1] rounded-[0.1250rem] overflow-hidden w-[3rem] h-[3rem] shrink-0"
            >
              <img
                :src="value?.image || placeholder"
                class="object-cover h-full w-full"
              />
            </div> -->
              <CdxThumbnail :thumbnail="{ url: value?.image }" :placeholder-icon="cdxIconLogoWikidata" />

              <div>
                <CdxLabel class="text-[1rem] pb-[0.2500rem] leading-[1.25rem] dark:text-[#EAECF0]">{{ value?.label }}
                  ({{
                    value?.id }})</CdxLabel>
                <div v-if="value?.description" :lang="value?.language" style="
                    hyphens: auto;
                    -moz-hyphens: auto;
                    word-wrap: break-word;
                  ">
                  <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0 leading-[1.375rem]">
                    {{ value?.description }}
                  </p>
                </div>

                <p v-else class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0"
                  style="padding-bottom: 1rem">
                  <i>{{ t("session.emptyDescription") }}</i>
                </p>
              </div>
            </div>
            <CdxIcon :aria-label="t('aria.showItemDetail')" :icon="cdxIconInfoFilled" class="cursor-pointer"
              @click.stop="emit('gotoSubItemDetail', value)" />
          </div>
        </div>
      </div>

      <div v-else-if="isSearch">
        <div v-if="
          recommendation?.length !== 0 &&
          !props.searchLoading &&
          !props.recommendedLoading
        " class="container">
          <h6 class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0.5rem]"
            style="padding-bottom: 1rem">
            <b>{{ t("session.main.result") }}</b>
          </h6>
          <div v-for="(value, index) in recommendation" tabindex="0" :key="index" :class="[
            value.id === selectedItem
              ? 'border-[0.1250rem] border-[var(--border-color-progressive--focus)] bg-[#EAF3FF] dark:bg-[#1C2940]'
              : 'border border-[var(--border-color-base)]',
            'rounded-[0.1250rem] p-[0.75rem] flex items-center gap-x-2 mb-[0.5rem] cursor-pointer justify-between',
            'recommendation-box',
          ]" ref="radioButtons2" @click.prevent="selectItem(value.id, value)"
            @keydown.space="selectItem(value.id, value)" @keydown.enter="selectItem(value.id, value)"
            @keydown.left="moveSelectionSearch(index - 1)" @keydown.right="moveSelectionSearch(index + 1)"
            @keydown.up="moveSelectionSearch(index - 1)" @keydown.down="moveSelectionSearch(index + 1)">
            <div class="flex gap-x-[0.75rem]">
              <!-- <div
                class="border border-[#C8CCD1] rounded-[0.1250rem] overflow-hidden w-[3rem] h-[3rem] shrink-0"
              >
                <img
                  :src="value?.image || placeholder"
                  class="object-cover h-full w-full"
                />
              </div> -->
              <CdxThumbnail :thumbnail="{ url: value?.image }" :placeholder-icon="cdxIconLogoWikidata" />
              <div>
                <CdxLabel class="text-[1rem] dark:text-[#EAECF0]">
                  <span v-for="(part, index) in highlightText(value?.label, search)" :key="index">
                    <span v-if="part.toLowerCase() === search.toLowerCase()" class="font-[400]">{{ part }}</span>
                    <span v-else>{{ part }}</span>
                  </span>
                  ({{ value?.id }})
                </CdxLabel>
                <div :lang="value?.language" v-if="value?.description" style="
                    hyphens: auto;
                    -moz-hyphens: auto;
                    word-wrap: break-word;
                  ">
                  <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0"
                    style="padding-bottom: 1rem">
                    {{ value?.description }}
                  </p>
                </div>
                <p v-else class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0"
                  style="padding-bottom: 1rem">
                  <i>{{ t("session.emptyDescription") }}</i>
                </p>
              </div>
            </div>
            <CdxIcon :aria-label="t('aria.showItemDetail')" :icon="cdxIconInfoFilled" class="cursor-pointer"
              @click.stop="emit('gotoSubItemDetail', value)" />
          </div>

          <div class="w-full">
            <CdxButton v-if="!props.noLoadData" class="w-full h-[2.125rem]"
              @click="emit('loadMore', radioButtons2?.[0])" :disabled="props.loadmoreLoading">{{
                props.loadmoreLoading
                  ? t("session.main.loading")
                  : t("session.main.loadmore")
              }}</CdxButton>

            <div v-else-if="props.noLoadData"
              class="flex justify-center flex-col align-center gap-y-[0.2500rem] pt-[0.5rem]">
              <img :src="isThemeDark ? noDataDark : noData" alt="logo" />
              <span class="text-[#54595D] dark:text-[#A2A9B1] text-[1rem] text-center">
                <i>{{ t("session.main.emptyLoad") }}</i>
              </span>
            </div>
          </div>
        </div>

        <div v-else-if="
          recommendation?.length === 0 && !props.searchLoading
        ">
          <CdxLabel class="text-[1rem] text-[var(--color-error)]">{{
            t("session.main.emptySearch1")
          }}</CdxLabel>
          <CdxLabel class="text-[1rem] text-[var(--color-error)]">{{
            t("session.main.emptySearch2")
          }}</CdxLabel>
        </div>
      </div>
    </div>
    <div
      class="w-full h-66px border-t border-[#A2A9B1] dark:border-[#72777D] p-[1rem] flex align-center bg-white gap-x-[0.75rem] rounded-b-[1rem] dark:bg-[#101418]">
      <CdxButton class="w-full" @click="
        () => {
          selectedItem = null;
          emit('gotoReview');
        }
      ">{{ t("session.main.button1") }}</CdxButton>
      <CdxButton :disabled="!selectedItem" weight="primary" action="progressive" class="w-full"
        @click="emit('gotoReview', detailData)">{{ t("session.main.button2") }}</CdxButton>
    </div>
  </div>
</template>

<style>
.cdx-text-input__input {
  height: 2.125rem;
}

@media (max-height: 600px) {
  .custom-maxheight {
    max-height: 75vh;
  }
}

@media (max-height: 700px) and (min-height: 601px) {
  .custom-maxheight {
    max-height: 75vh;
  }
}

@media (max-height: 915px) and (min-height: 701px) {
  .custom-maxheight {
    max-height: 80vh;
  }
}

@media (min-height: 916px) {
  .custom-maxheight {
    max-height: 85vh;
  }
}

.progress {
  overflow: hidden;
  height: 2.125rem;
  border-radius: 0.125rem;
  width: 100%;
  opacity: 0.3;
}

.progress-bar {
  height: 100%;
}

.progress-bar-striped,
.progress-striped .progress-bar {
  background-image: linear-gradient(-45deg,
      hsla(0, 0%, 95%, 0.8) 25%,
      transparent 0,
      transparent 50%,
      hsla(0, 0%, 95%, 0.8) 0,
      hsla(0, 0%, 95%, 0.8) 75%,
      transparent 0,
      transparent);
  background-size: 4.6875rem 4.6875rem;
  background-repeat: repeat-x;
}

.progress-bar.active,
.progress.active .progress-bar {
  -webkit-animation: f 2s linear infinite;
  animation: f 2s linear infinite;
}

.progress-bar-info {
  background-color: #999;
}

.progress-striped .progress-bar-info {
  background-image: linear-gradient(45deg,
      hsla(0, 0%, 95%, 0.8) 25%,
      transparent 0,
      transparent 50%,
      hsla(0, 0%, 95%, 0.8) 0,
      hsla(0, 0%, 95%, 0.8) 75%,
      transparent 0,
      transparent);
}

@-webkit-keyframes f {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 4.6875rem 0;
  }
}

@keyframes f {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 4.6875rem 0;
  }
}
</style>
