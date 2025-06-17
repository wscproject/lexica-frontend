<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxButton,
  CdxTextArea,
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
  <div class="relative w-full flex flex-col overflow-hidden flex flex-col h-full dark:bg-black rounded-[0.9375rem]">
    <div class="bg-white px-[1rem] dark:bg-[#101418] h-full flex flex-col justify-between header">
      <div class="py-[1rem] header">
        <CdxLabel class="text-[1.125rem] pb-0 text-[var(--color-base)]">{{
          t("session.scriptWriting.title1")
        }}</CdxLabel>
        <!-- This is for header Expand animation helper. Sudden change on header's height will screw with the animation, so we need to delay the text changes so the height can adapt  -->
      </div>
      <div class="flex align-center gap-x-[1rem] justify-between">
        <div ref="scrollRef" id="yes" :class="[
          'overflow-auto h-[10vh] text-[var(--color-base)] text-[1.75rem] w-full ',
          !isScrollbar && 'flex items-center',
        ]" lang="de" style="
            -webkit-hyphens: auto;
            -moz-hyphens: auto;
            -ms-hyphens: auto;
            hyphens: auto;
            word-wrap: break-word;
            width: 100%;
          ">
          <p>
            {{ props?.data?.lemma }}
          </p>
        </div>
        <div>
          <CdxIcon :aria-label="t('aria.showLexemeDetail')" :icon="cdxIconInfoFilled"
            class="cursor-pointer interactable" @click.stop="(e) => emit('gotoDetail', e)"
            @keydown.space="(e) => emit('gotoDetail', e)" />
        </div>
      </div>

      <div class="pt-[1rem] pb-[0.75rem] text-[1rem] leading-[1.6rem]">
        <span v-if="props?.data?.gloss" class="text-[var(--color-subtle)] elipsis">{{ props?.data?.gloss }}</span>

        <span v-else class="text-[var(--color-subtle)]">
          <i>{{ t("session.emptyDescriptionHead") }}
            {{ props?.data?.language?.title }}</i></span>
      </div>
    </div>

    <div class="relative px-[1rem] bg-[#FFA758] h-full flex flex-col">
      <div class="py-[1rem] top-[1rem]">
        <span class="text-[#361D13] text-[1.125rem] font-[700]">
          {{
            t("session.scriptWriting.title2", {
              lang: props?.data?.language?.languageVariant?.title,
            })
          }}
          ({{ props?.data?.language?.languageVariant?.codePreview }})</span>
      </div>

      <div class="relative flex items-center justify-start grow"
        :dir="props?.data?.language?.languageVariant?.isRtl ? 'rtl' : 'ltr'">
        <CdxTextArea ref="textAreaRef" autofocus :placeholder="t('session.scriptWriting.placeholder')"
          class="leading-[2.1875rem] text-[1.75rem] textarea-script interactable" v-model="script" />
      </div>
    </div>
    <div class="w-full bottom-0 left-0 h-[4.125rem] p-[1rem] bg-[#FFA758] flex items-center">
      <CdxButton weight="primary" action="progressive" class="w-full interactable" :disabled="!script"
        @click="emit('gotoReview', script)">{{ t("session.main.button2") }}</CdxButton>
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

.textarea-script .cdx-text-area__textarea:enabled {}

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
  height: 2.125rem;
}

.script .cdx-text-area__textarea {
  height: 100%;
}

.script .cdx-text-area__textarea {
  resize: none;
  height: 100%;
  font-size: 1.75rem;
}

@media (max-height: 575px) {
  .textarea-script .cdx-text-area__textarea:enabled {
    font-size: 1rem !important;
    height: 1.875rem;
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
