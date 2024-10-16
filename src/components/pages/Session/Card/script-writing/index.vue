<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxButton,
  CdxTextArea,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import { cdxIconInfoFilled, cdxIconLogoWikidata } from "@wikimedia/codex-icons";
import { computed, ref, watch } from "vue";
import debounce from "lodash.debounce";
import { useI18n } from "vue-i18n";
import noData from "@/assets/endofresult.svg";
import noDataDark from "@/assets/endofresult-dark.svg";
import { useStore } from "vuex";

const vuex = useStore();

const { t } = useI18n({ useScope: "global" });

const refText = ref(null);
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const isInfo = ref(false);
const selectedItem = ref(null);
const detailData = ref(null);
const isLoading = ref(false);

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
});

const recommendationSearch = ref([]);

const setInfo = () => {
  isInfo.value = !isInfo.value;
};

const selectItem = (n, value) => {
  selectedItem.value = n;
  detailData.value = value;
  emit("selectItem");
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

watch(refText, () => {
  console.log(refText.value);
});
</script>

<template>
  <div
    class="relative w-full flex flex-col overflow-hidden flex flex-col h-full dark:bg-black rounded-[15px]"
  >
    <div
      class="p-[16px] text-white flex test justify-between gap-x-1 header w-full"
      :style="{
        alignItems: 'center',
      }"
    >
      <div
        :style="{
          minWidth: '200px',
        }"
      >
        <CdxLabel class="text-[18px] pb-0">{{
          t("session.scriptWriting.title1")
        }}</CdxLabel>
        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->
      </div>
    </div>
    <div
      class="px-[16px] bg-white pt-[12px] pb-[12px] dark:bg-[#101418] flex align-center gap-x-[16px] justify-between"
    >
      <div
        class="overflow-auto h-[18.3vh] text-white text-[28px] w-full max-w-[380px] flex align-center"
        lang="de"
        style="
          -webkit-hyphens: auto;
          -moz-hyphens: auto;
          -ms-hyphens: auto;
          hyphens: auto;
          word-wrap: break-word;
          width: 100%;
        "
      >
        <span :ref="refText">
          Pseudopseudohypoparathyroidism Pseudopseudohypoparathyroidism
          hypothetically hypothetically
        </span>
      </div>
      <div>
        <CdxIcon
          :icon="cdxIconInfoFilled"
          class="text-white cursor-pointer"
          @click.stop="(e) => emit('gotoDetail', e)"
        />
      </div>
    </div>
    <div
      class="px-[16px] bg-white h-full pt-[12px] pb-[12px] dark:bg-[#101418]"
    ></div>
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
.heighted {
  height: 100%;
}
.cdx-text-input__input {
  height: 34px;
}

.script .cdx-text-area__textarea {
  height: 100%;
}

.script .cdx-text-area__textarea {
  resize: none;
  height: 100%;
  max-height: 183px;
  font-size: 28px;
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
