<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxButton,
  CdxTextArea,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import { cdxIconInfoFilled } from "@wikimedia/codex-icons";
import { computed, ref, toRaw, toRef, watch } from "vue";
import debounce from "lodash.debounce";
import { useI18n } from "vue-i18n";
import noData from "@/assets/endofresult.svg";
import noDataDark from "@/assets/endofresult-dark.svg";
import { useStore } from "vuex";
import { onMounted } from "vue";

const vuex = useStore();

const { t } = useI18n({ useScope: "global" });

const scrollRef = ref(null);
const textAreaRef = ref(null);
const script = ref("");

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const isScrollbar = ref(false);

const emit = defineEmits([
  "gotoDetail, onHold, onRelease, gotoReview, selectItem, setSearch, loadMore",
]);

const props = defineProps({
  data: Object,
  recommendation: Array,
  keyword: String,
  searchLoading: Boolean,
  recommendedLoading: Boolean,
  loadmoreLoading: Boolean,
  noLoadData: Boolean,
  currCount: Number,
});

const changing = toRef(props, "currCount");

onMounted(() => {
  setTimeout(() => {
    textAreaRef.value.textarea.focus();
  }, 1500);
});

watch(changing, () => {
  setTimeout(() => {
    textAreaRef.value.textarea.focus();
  }, 1500);
});

// watch(textareaREf);

watch(scrollRef, () => {
  const hasVerticalScrollbar =
    scrollRef?.value?.scrollHeight > scrollRef?.value?.clientHeight;

  if (hasVerticalScrollbar) {
    isScrollbar.value = true;
  } else {
    isScrollbar.value = false;
  }
});

watch(script, () => {
  console.log(script.value);
});
</script>

<template>
  <div
    class="relative w-full flex flex-col overflow-hidden flex flex-col h-full dark:bg-black rounded-[15px]"
  >
    <div
      class="bg-white px-[16px] dark:bg-[#101418] h-full flex flex-col justify-between header"
    >
      <div class="py-[16px] header">
        <CdxLabel class="text-[18px] pb-0 text-[var(--color-base)]">{{
          t("session.scriptWriting.title1")
        }}</CdxLabel>
        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->
      </div>
      <div class="flex align-center gap-x-[16px] justify-between">
        <div
          ref="scrollRef"
          id="yes"
          :class="[
            'overflow-auto h-[10vh] text-[var(--color-base)] text-[28px] w-full ',
            !isScrollbar && 'flex items-center',
          ]"
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
          <p>
            {{ props?.data?.lemma }}
          </p>
        </div>
        <div>
          <CdxIcon
            :aria-label="t('aria.showLexemeDetail')"
            :icon="cdxIconInfoFilled"
            class="cursor-pointer"
            @click.stop="(e) => emit('gotoDetail', e)"
          />
        </div>
      </div>

      <div class="pt-[16px] pb-[12px] text-[16px] leading-[25.6px]">
        <span
          v-if="props?.data?.gloss"
          class="text-[var(--color-subtle)] elipsis"
          >{{ props?.data?.gloss }}</span
        >

        <span v-else class="text-[var(--color-subtle)]">
          ><i
            >{{ t("session.emptyDescriptionHead") }}
            {{ props?.data?.language?.title }}</i
          ></span
        >
      </div>
    </div>

    <div class="relative px-[16px] bg-[#FFA758] h-full flex flex-col">
      <div class="py-[16px] top-[16px]">
        <span class="text-[#361D13] text-[18px] font-[700]">
          {{
            t("session.scriptWriting.title2", {
              lang: props?.data?.language?.languageVariant?.title,
            })
          }}
          ({{ props?.data?.language?.languageVariant?.codePreview }})</span
        >
      </div>

      <div
        class="relative flex items-center justify-start grow"
        :dir="props?.data?.language?.languageVariant?.isRtl ? 'rtl' : 'ltr'"
      >
        <CdxTextArea
          ref="textAreaRef"
          autofocus
          :placeholder="t('session.scriptWriting.placeholder')"
          class="leading-[35px] text-[28px] textarea-script"
          v-model="script"
        />
      </div>
    </div>
    <div
      class="w-full bottom-0 left-0 h-[66px] p-[16px] bg-[#FFA758] flex items-center"
    >
      <CdxButton
        weight="primary"
        action="progressive"
        class="w-full"
        :disabled="!script"
        @click="emit('gotoReview', script)"
        >{{ t("session.main.button2") }}</CdxButton
      >
    </div>
  </div>
</template>

<style>
.elipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block;
}
.textarea-script .cdx-text-area__textarea:enabled {
  background-color: #ffa758 !important;
  color: #361d13 !important;
  resize: none;
  min-height: 0 !important;
  flex: 1;
  max-height: 128px;
  height: auto;
  overflow: auto;
  border: none;
}

.textarea-script .cdx-text-area__textarea:enabled {
}

.textarea-script.cdx-text-area {
  width: 100%;

  /* temporary */
  display: flex;
  align-items: center;
}

.textarea-script .cdx-text-area__textarea {
  height: 100%;
}
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
  font-size: 28px;
}

@media (max-height: 575px) {
  .textarea-script .cdx-text-area__textarea:enabled {
    font-size: 16px !important ;
    height: 30px;
  }
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
