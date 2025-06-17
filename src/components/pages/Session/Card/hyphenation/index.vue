<script setup>
import { CdxButton, CdxIcon } from "@wikimedia/codex";
import { cdxIconInfoFilled, cdxIconPrevious } from "@wikimedia/codex-icons";
import {
  ref,
  onMounted,
  nextTick,
  toRaw,
  computed,
  reactive,
  watch,
  toRef,
} from "vue";
import Divide from "@/assets/divide.svg";
import DivideDark from "@/assets/divide_dark.svg";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useDirWatcher } from "@/helper/useDirWatcher";

const vuex = useStore();
const { t } = useI18n({ useScope: "global" });
const { dir } = useDirWatcher();

const emit = defineEmits(["gotoDetail", "gotoReview"]);

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

const allData = toRef(props, "data");

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const containerRef = ref(null);
const itemsRef = ref([]);
const currentIndex = ref(1);
const selectedIndexes = ref([]);

const word = ref("asdasdasd");
const editedWord = ref("asdasdasd");

function splitWithEmptySlots(word) {
  return word
    .split("")
    .flatMap((char) => [char, ""])
    .slice(0, -1);
}

const splitWord = () => {
  const split = splitWithEmptySlots(word.value);

  for (let i = 0; i < selectedIndexes.value.length; i++) {
    split.splice(selectedIndexes.value[i], 1, ",");
  }

  editedWord.value = split.join("");
};

const scrollToItem = (index) => {
  const container = containerRef.value;
  const item = itemsRef.value[index];
  console.log(item);

  if (container && item) {
    container.scrollTo({
      left: item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2,
      behavior: "smooth",
    });
  }
};

const scrollPrev = () => {
  const container = containerRef.value;
  const tempIndex = itemsRef.value.findIndex(
    (item) =>
      item.offsetLeft >= container.scrollLeft + container.offsetWidth / 2
  );

  let targetIndex = tempIndex - 2;

  if (targetIndex < 0) {
    targetIndex = 0;
    currentIndex.value = 0;
  } else {
    if (tempIndex % 2 !== 0) {
      currentIndex.value = targetIndex;
    } else {
      currentIndex.value = targetIndex - 1;
    }
  }

  if (tempIndex % 2 !== 0) {
    scrollToItem(targetIndex);
  } else {
    scrollToItem(targetIndex - 1);
  }
};

const scrollNext = () => {
  const container = containerRef.value;
  const tempIndex = itemsRef.value.findIndex((item) => {
    return item.offsetLeft >= container.scrollLeft + container.offsetWidth / 2;
  });

  let targetIndex = (tempIndex % 2 !== 0 ? tempIndex : tempIndex - 1) + 2;
  console.log("tempIndex", targetIndex);

  currentIndex.value = targetIndex;

  if (targetIndex >= itemsRef.value.length) {
    targetIndex = itemsRef.value.length - 1;
    currentIndex.value = itemsRef.value.length - 1;
  }

  scrollToItem(targetIndex);
};

const updateCurrentIndex = () => {
  const container = containerRef.value;
  const tempIndex = itemsRef.value.findIndex((item) => {
    return item.offsetLeft >= container.scrollLeft + container.offsetWidth / 2;
  });

  if (tempIndex % 2 !== 0) {
    currentIndex.value = tempIndex;
  } else {
    currentIndex.value = tempIndex - 1;
  }
};

watch(
  () => currentIndex.value,
  (value) => {
    console.log(value);
  }
);

const tagHyphenation = async () => {
  selectedIndexes.value.push(currentIndex.value);

  await nextTick();

  splitWord();
};

const untagHyphenation = async () => {
  selectedIndexes.value = selectedIndexes.value.filter(
    (item) => item !== currentIndex.value
  );

  await nextTick();

  splitWord();
};

onMounted(async () => {
  // Ensure itemsRef is populated with the correct elements
  editedWord.value = props?.data?.lemma;
  word.value = props?.data?.lemma;

  await nextTick();

  itemsRef.value = Array.from(containerRef.value.querySelectorAll(".item"));

  // Add scroll event listener to update currentIndex
  containerRef.value.addEventListener("scroll", updateCurrentIndex);
});
</script>

<template>
  <div class="relative w-full flex flex-col overflow-hidden flex flex-col h-full dark:bg-black rounded-[0.9375rem]">
    <div
      class="relative pt-[var(--spacing-100)] pl-[var(--spacing-100)] pb-[var(--spacing-75)] pr-[var(--spacing-50)] bg-[#9F3526] header">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex gap-x-[var(--spacing-25)] relative" dir="ltr" :style="{
            justifyContent: dir === 'rtl' ? 'flex-end' : 'flex-start',
          }">
            <div v-for="item in editedWord.split(',')" class="bg-white p-[var(--spacing-25)] w-fit rounded-[0.5rem]">
              <h4 class="text-[1.125rem] font-bold text-[#9F3526]">{{ item }}</h4>
            </div>
          </div>
          <span v-if="props?.data?.gloss" class="text-white text-[1rem] flex"><span
              class="overflow-hidden text-ellipsis" style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: initial;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              ">{{ props?.data?.gloss }}</span></span>
          <span class="text-white text-[1rem]" v-else>
            <i>
              {{ t("session.emptyDescriptionHead") }}
              {{ data?.language?.title }}
            </i>
          </span>
        </div>
        <div class="w-[2.125rem] h-[2.125rem] flex justify-center items-center cursor-pointer interactable"
          @click.stop="(e) => emit('gotoDetail', e)" @keydown.space="(e) => emit('gotoDetail', e)">
          <CdxIcon :aria-label="t('aria.showLexemeDetail')" :icon="cdxIconInfoFilled" :tabindex="props.isCurrent && '0'"
            class="text-white m-[var(--spacing-25)]" />
        </div>
      </div>
    </div>
    <div class="max-h-[40.625rem] h-100 flex items-center relative py-[1.5rem] bg-[var(--background-color-base)]"
      style="white-space: nowrap">
      <div class="triangle" />

      <div class="w-full max-w-[28.125rem] relative" dir="ltr">
        <div :class="['flex x mandatory-scroll-snapping h-[6.75rem] interactable']" id="content" ref="containerRef">
          <div v-for="(slide, index) in splitWithEmptySlots(word)" :class="[
            'min-w-[3.25rem] text-[6rem] item h-full font-bold leading-[6.75rem] flex justify-center items-center',
          ]" :style="{
            scrollSnapAlign: index % 2 !== 0 ? 'start' : 'none',
            scrollSnapStop: index % 2 !== 0 ? 'always' : 'normal',
            flex: 'none',
          }" :key="index">
            <span v-if="slide" class="select-none text-[var(--color-base)]">{{
              slide
            }}</span>
            <div v-else :class="[
              'no-slide h-full flex justify-center items-center ',
              selectedIndexes?.find((item) => item === index) &&
              'letter-divider',
            ]">
              <div v-if="!selectedIndexes?.find((item) => item === index)"
                class="border-r-[0.1250rem] h-full border-[#C8CCD1] ml-[-1px]"></div>
            </div>
          </div>
        </div>
        <div v-if="isThemeDark" class="gradient h-full w-full absolute"></div>
        <div v-if="!isThemeDark" class="gradient-light h-full w-full absolute"></div>
      </div>
      <div class="h-[100%] max-h-[31.25rem] bg-[#9F3526] w-[0.1250rem] absolute left-[49.75%] top-[1.25rem]"></div>
    </div>
    <div dir="ltr"
      class="hyphenation-footer relative p-[var(--spacing-100)] border-y border-y-[var(--border-color-base)] bg-[var(--background-color-neutral)] flex gap-x-[var(--spacing-75)]">
      <CdxButton aria-label="Back" @click="scrollPrev" :disabled="currentIndex === 1" class="interactable">
        <CdxIcon :icon="cdxIconPrevious" dir="ltr" />
      </CdxButton>

      <CdxButton :dir="dir" class="flex gap-x-[var(--spacing-25)] w-full interactable" @click="
        selectedIndexes.find((item) => item === currentIndex)
          ? untagHyphenation()
          : tagHyphenation()
        ">
        <img :src="isThemeDark ? DivideDark : Divide" alt="divide" />
        <span>{{ t("session.hyphenation.button1") }}</span>
      </CdxButton>

      <CdxButton class="interactable" aria-label="Next" @click="scrollNext" :disabled="currentIndex < 0 ||
        currentIndex >= splitWithEmptySlots(word).length - 2
        ">
        <CdxIcon :icon="cdxIconPrevious" dir="rtl" />
      </CdxButton>
    </div>
    <div class="p-[var(--spacing-100)] bg-[var(--background-color-base)]">
      <CdxButton weight="primary" action="progressive" class="w-full interactable"
        @click="emit('gotoReview', editedWord)">
        {{ t("session.hyphenation.button2") }}
      </CdxButton>
    </div>
  </div>
</template>

<style>
.triangle {
  /* z-index: 1; */
  content: "";
  position: absolute;
  /* bottom: -22.5px; */
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 1.5rem solid transparent;
  border-right: 1.5rem solid transparent;
  border-top: 1.5rem solid #9f3526;
  transform: translateX(-50%);
}

.hyphenation-footer::after {
  content: "";
  position: absolute;
  top: -1.5rem;
  /* Adjust this to control the cutout position */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 25px solid var(--background-color-neutral);
  /* Same as the background color */
}

.hyphenation-footer::before {
  content: "";
  position: absolute;
  top: -1.625rem;
  /* Slightly higher than `::after` */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 25px solid transparent;
  border-right: 25px solid transparent;
  border-bottom: 25px solid var(--border-color-base);
  /* Same as border */
}

.x.mandatory-scroll-snapping {
  scroll-snap-type: x mandatory;
  scroll-padding-left: calc(50% - 26px);
  padding-left: calc(50% - 26px);
  padding-right: calc(50% - 26px);
  /* scroll-behavior: smooth; */
  position: relative;

  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.gradient {
  position: absolute;
  background: url("@/assets/gradient.svg");
  /* z-index: 20; */
  top: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: center;
  pointer-events: none;
}

.gradient-light {
  position: absolute;
  background: url("@/assets/gradient-light.svg");
  /* z-index: 20; */
  top: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position-y: center;
  pointer-events: none;
}

.x.mandatory-scroll-snapping::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}

.x {
  flex-flow: row nowrap;
  overflow-y: hidden;
  width: 100%;
  height: 128px;
}

.no-slide {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.letter-divider::after {
  content: url("/src/assets/letter_divider.svg");
  position: absolute;
  top: 0;
  width: 1.6875rem;
  height: auto;
  /* z-index: 2; */
}
</style>
