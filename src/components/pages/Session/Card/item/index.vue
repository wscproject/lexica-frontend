<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxButton,
  CdxSearchInput,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import { cdxIconInfoFilled, cdxIconLogoWikidata } from "@wikimedia/codex-icons";
import { computed, nextTick, ref, toRaw, toRef, watch } from "vue";
import debounce from "lodash.debounce";
import { useI18n } from "vue-i18n";
import noData from "@/assets/endofresult.svg";
import noDataDark from "@/assets/endofresult-dark.svg";
import { useStore } from "vuex";

const vuex = useStore();

const { t } = useI18n({ useScope: "global" });
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

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

const isScrollBar = ref(false);

const recommendationSearch = ref([]);

const setInfo = () => {
  isInfo.value = !isInfo.value;
};

const moveSelectionRec = (newIndex) => {
  if (
    isSearch.value &&
    (newIndex < 0 ||
      newIndex >= props?.recommendation?.filter((item, i) => i <= 2)?.length)
  )
    return;

  // Move focus to the newly selected element
  nextTick(() => {
    radioButtons.value[newIndex]?.focus();
  });
};

const moveSelectionSearch = (newIndex) => {
  if (
    !isSearch.value &&
    (newIndex < 0 || newIndex >= props?.recommendation?.length)
  )
    return;

  // Move focus to the newly selected element
  nextTick(() => {
    radioButtons2.value[newIndex]?.focus();
  });
};

const selectItem = (n, value) => {
  selectedItem.value = n;
  detailData.value = value;
  emit("selectItem");
};

const highlightText = (text, searchTerm) => {
  if (!searchTerm) return [text];
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return text.split(regex);
};

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
}, 500);

watch(recs, async () => {
  await nextTick();

  // const div = document.getElementById("rec-container");
  // isScrollBar.value = div.scrollHeight > div.clientHeight;

  // console.log(div.scrollHeight > div.clientHeight);

  if (radioButtons2.value) {
    const test = toRaw(radioButtons2?.value);
    test?.[recs?.value?.length - 10]?.focus();

    // radioButtons2?.value
  }
});
</script>

<template>
  <div
    class="relative w-full flex flex-col overflow-hidden flex flex-col h-full dark:bg-black rounded-[15px]"
  >
    <div
      class="p-[16px] text-white flex test justify-between gap-x-1 header w-full"
      :style="{
        background: '#3056A9',
        alignItems: 'center',
      }"
      @mousedown="emit('onHold')"
      @mouseup="emit('onRelease')"
      @touchstart="emit('onHold')"
      @touchend="emit('onRelease')"
    >
      <div
        :style="{
          minWidth: '200px',
        }"
      >
        <h4
          class="font-bold text-[18px] pb-0 text-[var(--color-inverted-fixed)]"
        >
          {{ props?.data?.lemma }} ({{ props?.data?.externalLexemeSenseId }})
        </h4>
        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->

        <p
          v-if="props?.data?.gloss"
          class="overflow-hidden text-ellipsis"
          :style="{
            whiteSpace: 'nowrap',
          }"
        >
          {{ props.data.gloss }}
        </p>

        <p v-else class="text-[16px] p-0">
          <i>
            {{ t("session.emptyDescriptionHead") }}
            {{ data?.language?.title }}
          </i>
        </p>
      </div>
      <div>
        <CdxIcon
          :aria-label="t('aria.showLexemeDetail')"
          :icon="cdxIconInfoFilled"
          :tabindex="props.isCurrent && '0'"
          class="text-white cursor-pointer interactable"
          @click.stop="(e) => emit('gotoDetail', e)"
          @keydown.space="(e) => emit('gotoDetail', e)"
        />
      </div>
    </div>
    <div
      :class="[
        'px-[16px] overflow-auto bg-white h-full pt-[12px] pb-[12px] dark:bg-[#101418] ',
        props.isCurrent ? '' : 'hidden',
        // isScrollBar && 'interactable',
      ]"
    >
      <CdxLabel
        class="text-[16px] dark:text-[#EAECF0]"
        style="padding-bottom: 16px"
        >{{ t("session.main.title") }}</CdxLabel
      >
      <div class="relative">
        <CdxSearchInput
          aria-label="SearchInput default demo"
          :placeholder="t('session.main.search')"
          class="pb-[16px] relative interactable"
          v-model="search"
          @input="onInput"
        />

        <div class="progress absolute top-0" v-if="props.searchLoading">
          <div
            class="progress-bar progress-bar-info progress-bar-striped active"
            style="width: 100%"
          ></div>
        </div>
      </div>

      <div v-if="props.recommendedLoading">
        <div class="w-full max-w-[896px]">
          <span
            class="mb-[8px] text-[#54595D] text-[16px] dark:text-[#A2A9B1]"
            >{{ t("session.recLoading") }}</span
          >
          <CdxProgressBar class="w-full mt-[8px]"></CdxProgressBar>
        </div>
      </div>

      <div
        v-if="
          !isSearch &&
          props?.recommendation?.length === 0 &&
          !props.searchLoading &&
          !props.recommendedLoading
        "
      >
        <p class="text-[16px] text-[#54595D]">
          <i>{{ t("session.main.emptySuggestion1") }}</i>
        </p>
        <p class="text-[16px] text-[#54595D]">
          <i>{{ t("session.main.emptySuggestion2") }}</i>
        </p>
      </div>
      <div
        v-if="
          !isSearch &&
          props?.recommendation?.length > 0 &&
          !props.searchLoading &&
          !props.recommendedLoading
        "
        class="container"
      >
        <h6
          class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[8px]"
          style="padding-bottom: 16px"
        >
          {{ t("session.main.recommendation") }}
        </h6>
        <div role="radiogroup">
          <div
            v-for="(value, index) in props?.recommendation?.filter(
              (item, i) => i <= 2
            )"
            ref="radioButtons"
            tabindex="0"
            role="radio"
            :key="index"
            :class="[
              value.id === selectedItem
                ? 'border-[2px] border-[#3366CC] bg-[#EAF3FF] dark:bg-[#1C2940]'
                : 'border border-[var(--border-color-base)] ',
              'rounded-[2px] p-[12px] flex items-center gap-x-2 mb-[8px] cursor-pointer justify-between',
              !isSearch && 'recommendation-box',
            ]"
            @click.prevent="selectItem(value.id, value)"
            @keydown.space="selectItem(value.id, value)"
            @keydown.enter="selectItem(value.id, value)"
            @keydown.left="moveSelectionRec(index - 1)"
            @keydown.right="moveSelectionRec(index + 1)"
            @keydown.up="moveSelectionRec(index - 1)"
            @keydown.down="moveSelectionRec(index + 1)"
          >
            <div class="flex gap-x-[12px]">
              <!-- <div
              class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
            >
              <img
                :src="value?.image || placeholder"
                class="object-cover h-full w-full"
              />
            </div> -->
              <CdxThumbnail
                :thumbnail="{ url: value?.image }"
                :placeholder-icon="cdxIconLogoWikidata"
              />

              <div>
                <CdxLabel
                  class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0]"
                  >{{ value?.label }} ({{ value?.id }})</CdxLabel
                >
                <div
                  v-if="value?.description"
                  :lang="value?.language"
                  style="
                    hyphens: auto;
                    -moz-hyphens: auto;
                    word-wrap: break-word;
                  "
                >
                  <p
                    class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0 leading-[22px]"
                  >
                    {{ value?.description }}
                  </p>
                </div>

                <p
                  v-else
                  class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0"
                  style="padding-bottom: 16px"
                >
                  <i>{{ t("session.emptyDescription") }}</i>
                </p>
              </div>
            </div>
            <CdxIcon
              :aria-label="t('aria.showItemDetail')"
              :icon="cdxIconInfoFilled"
              class="cursor-pointer"
              @click.stop="emit('gotoSubItemDetail', value)"
            />
          </div>
        </div>
      </div>

      <div v-else-if="isSearch">
        <div
          v-if="
            props?.recommendation?.length !== 0 &&
            !props.searchLoading &&
            !props.recommendedLoading
          "
          class="container"
        >
          <h6
            class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[8px]"
            style="padding-bottom: 16px"
          >
            {{ t("session.main.result") }}
          </h6>
          <div
            v-for="(value, index) in props?.recommendation"
            tabindex="0"
            :key="index"
            :class="[
              value.id === selectedItem
                ? 'border-[2px] border-[#3366CC] bg-[#EAF3FF] dark:bg-[#1C2940]'
                : 'border border-[var(--border-color-base)]',
              'rounded-[2px] p-[12px] flex items-center gap-x-2 mb-[8px] cursor-pointer justify-between',
              'recommendation-box',
            ]"
            ref="radioButtons2"
            @click.prevent="selectItem(value.id, value)"
            @keydown.space="selectItem(value.id, value)"
            @keydown.enter="selectItem(value.id, value)"
            @keydown.left="moveSelectionSearch(index - 1)"
            @keydown.right="moveSelectionSearch(index + 1)"
            @keydown.up="moveSelectionSearch(index - 1)"
            @keydown.down="moveSelectionSearch(index + 1)"
          >
            <div class="flex gap-x-[12px]">
              <!-- <div
                class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
              >
                <img
                  :src="value?.image || placeholder"
                  class="object-cover h-full w-full"
                />
              </div> -->
              <CdxThumbnail
                :thumbnail="{ url: value?.image }"
                :placeholder-icon="cdxIconLogoWikidata"
              />
              <div>
                <CdxLabel class="text-[16px] dark:text-[#EAECF0]">
                  <span
                    v-for="(part, index) in highlightText(value?.label, search)"
                    :key="index"
                  >
                    <span
                      v-if="part.toLowerCase() === search.toLowerCase()"
                      class="font-[400]"
                      >{{ part }}</span
                    >
                    <span v-else>{{ part }}</span>
                  </span>
                  ({{ value?.id }})</CdxLabel
                >
                <div
                  :lang="value?.language"
                  v-if="value?.description"
                  style="
                    hyphens: auto;
                    -moz-hyphens: auto;
                    word-wrap: break-word;
                  "
                >
                  <p
                    class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0"
                    style="padding-bottom: 16px"
                  >
                    {{ value?.description }}
                  </p>
                </div>
                <p
                  v-else
                  class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-0"
                  style="padding-bottom: 16px"
                >
                  <i>{{ t("session.emptyDescription") }}</i>
                </p>
              </div>
            </div>
            <CdxIcon
              :aria-label="t('aria.showItemDetail')"
              :icon="cdxIconInfoFilled"
              class="cursor-pointer"
              @click.stop="emit('gotoSubItemDetail', value)"
            />
          </div>

          <div class="w-full">
            <CdxButton
              v-if="!props.noLoadData"
              class="w-full h-[34px]"
              @click="emit('loadMore', radioButtons2?.[0])"
              :disabled="props.loadmoreLoading"
              >{{
                props.loadmoreLoading
                  ? t("session.main.loading")
                  : t("session.main.loadmore")
              }}</CdxButton
            >

            <div
              v-else-if="props.noLoadData"
              class="flex justify-center flex-col align-center gap-y-[4px] pt-[8px]"
            >
              <img :src="isThemeDark ? noDataDark : noData" alt="logo" />
              <span
                class="text-[#54595D] dark:text-[#A2A9B1] text-[16px] text-center"
              >
                <i>{{ t("session.main.emptyLoad") }}</i>
              </span>
            </div>
          </div>
        </div>

        <div
          v-else-if="
            props?.recommendation?.length === 0 && !props.searchLoading
          "
        >
          <CdxLabel class="text-[16px] text-[#D73333]">{{
            t("session.main.emptySearch1")
          }}</CdxLabel>
          <CdxLabel class="text-[16px] text-[#D73333]">{{
            t("session.main.emptySearch2")
          }}</CdxLabel>
        </div>
      </div>
    </div>
    <div
      class="w-full h-66px border-t border-[#A2A9B1] dark:border-[#72777D] p-[16px] flex align-center bg-white gap-x-[12px] rounded-b-[16px] dark:bg-[#101418]"
    >
      <CdxButton
        class="w-full"
        @click="
          () => {
            selectedItem = null;
            emit('gotoReview');
          }
        "
        >{{ t("session.main.button1") }}</CdxButton
      >
      <CdxButton
        :disabled="!selectedItem"
        weight="primary"
        action="progressive"
        class="w-full"
        @click="emit('gotoReview', detailData)"
        >{{ t("session.main.button2") }}</CdxButton
      >
    </div>
  </div>
</template>

<style>
.cdx-text-input__input {
  height: 34px;
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
  height: 34px;
  border-radius: 2px;
  width: 100%;
  opacity: 0.3;
}

.progress-bar {
  height: 100%;
}

.progress-bar-striped,
.progress-striped .progress-bar {
  background-image: linear-gradient(
    -45deg,
    hsla(0, 0%, 95%, 0.8) 25%,
    transparent 0,
    transparent 50%,
    hsla(0, 0%, 95%, 0.8) 0,
    hsla(0, 0%, 95%, 0.8) 75%,
    transparent 0,
    transparent
  );
  background-size: 75px 75px;
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
  background-image: linear-gradient(
    45deg,
    hsla(0, 0%, 95%, 0.8) 25%,
    transparent 0,
    transparent 50%,
    hsla(0, 0%, 95%, 0.8) 0,
    hsla(0, 0%, 95%, 0.8) 75%,
    transparent 0,
    transparent
  );
}

@-webkit-keyframes f {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 75px 0;
  }
}

@keyframes f {
  0% {
    background-position: 0 0;
  }

  to {
    background-position: 75px 0;
  }
}
</style>
