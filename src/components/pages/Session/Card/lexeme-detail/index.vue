<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import {
  cdxIconLogoWikidata,
  cdxIconArrowPrevious,
  cdxIconLanguage,
} from "@wikimedia/codex-icons";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import wikimedia from "@/assets/WikidataLexeme.svg";
import { useI18n } from "vue-i18n";
import expand from "@/assets/expand.svg";

const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  data: Object,
  headerData: Object,
  isLoading: Boolean,
  languages: Object,
  currLang: String,
});

const emit = defineEmits(["backtoItem, onHold, onRelease, showImage"]);
const hovered = ref(false);

const senses = computed(() => {
  const data =
    props?.data?.senses?.map((item, idx) => {
      const inside = Object.keys(item).map((key) => ({
        label: key,
        value: item[key],
      }));

      return {
        number: item.senseNumber,
        data: inside,
      };
    }) || [];

  return data;
});

watch(senses, () => {
  console.log(senses.value);
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
      class="header pt-[var(--spacing-100)] pl-[var(--spacing-50)] pb-[var(--spacing-75)] pr-[var(--spacing-100)]] text-white flex test justify-between relative rounded-t-[15px]"
      :style="{
        background: '#3056A9',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }"
      @mousedown.stop="emit('onHold')"
      @mouseup.stop="emit('onRelease')"
      @touchstart.stop="emit('onHold')"
      @touchend.stop="emit('onRelease')"
    >
      <div class="w-full break-normal">
        <div
          class="flex items-center gap-x-[var(--spacing-25)] pb-[var(--spacing-25)]"
        >
          <CdxIcon
            :aria-label="t('aria.close')"
            :icon="cdxIconArrowPrevious"
            class="text-white cursor-pointer mx-[var(--spacing-25)] interactable"
            @click="emit('backtoItem')"
            @keydown.space="emit('backtoItem')"
          />
          <h4 class="font-bold text-[18px] leading-[22.5px]">
            {{ props?.headerData?.lemma }}
            <span v-if="props?.headerData?.id">
              ({{ props?.headerData?.id }})</span
            >
          </h4>
        </div>

        <div
          class="flex items-center gap-x-2 pb-[var(--spacing-25)] pl-[var(--spacing-50)]"
        >
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
          class="pl-[var(--spacing-50)]"
        >
          {{ props.headerData.gloss }}
        </p>

        <p v-else class="text-[16px] pb-0 pl-[var(--spacing-50)]">
          <i> {{ t("session.emptyDescriptionHead") }} {{ props?.currLang }} </i>
        </p>
      </div>
    </div>
    <div
      class="p-[16px] overflow-auto bg-white dark:bg-[#101418] rounded-b-[16px] h-full"
    >
      <div v-if="props.isLoading">
        <div class="w-full max-w-[896px]">
          <span class="text-[#54595D] text-[16px] dark:text-[#A2A9B1]">{{
            t("session.detail.loading")
          }}</span>
          <CdxProgressBar class="w-full mt-[8px]"></CdxProgressBar>
        </div>
      </div>

      <div class="h-full w-full" v-if="senses.length !== 0 && !props.isLoading">
        <div
          v-if="props?.data?.grammaticalFeatures"
          class="rounded-[2px] mb-[var(--spacing-100)] p-[var(--spacing-50)] bg-[var(--background-color-neutral)] border border-[var(--border-color-base)]"
        >
          <span class="text-[16px]"
            >{{ t("session.detail.grammaticalFeature") }}
            <b>{{ props?.data?.grammaticalFeatures }}</b></span
          >
        </div>

        <div class="pb-[var(--spacing-50)] w-full">
          <span class="text-[var(--color-base)] font-[700]"
            >{{ t("session.detail.allSense") }}
          </span>
        </div>

        <div v-for="sense in senses" class="pb-[4px] w-full">
          <div
            v-for="data in sense?.data?.filter((i) => i.value !== null)"
            class="w-full"
            @mouseover="
              () => {
                if (data.label === 'images' && !hovered) hovered = true;
              }
            "
            @mouseout="
              () => {
                if (data.label === 'images' && hovered) hovered = false;
              }
            "
            :style="hovered && 'cursor: pointer'"
            @click="
              () => {
                if (data.label === 'images' && data?.value?.data?.[0]?.url)
                  emit('showImage', data?.value?.data?.[0]?.url);

                // console.log('sdasd');
              }
            "
          >
            <div
              v-if="data.label === 'gloss'"
              class="pb-[var(--spacing-50)] w-full"
            >
              <span class="text-[var(--color-base)] font-[700] text-[14px]"
                >{{ t("session.detail.sense") }} {{ sense.number }}:
                {{ data.value }}</span
              >
            </div>

            <div
              v-else-if="
                data.label === 'otherGlosses' && data?.value?.length !== 0
              "
              class="text-[16px] p-[var(--spacing-75)] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[2px] flex"
            >
              <CdxIcon :icon="cdxIconLanguage" />
              <div class="text-[16px] pl-[var(--spacing-75)]">
                <div class="font-[700] text-[var(--color-base)]">
                  {{ t("session.detail.otherGlosses") }}
                </div>
                <div class="text-[var(--color-subtle)]">
                  {{
                    data?.value
                      ?.map(
                        (item) =>
                          `${item.value} (${
                            props?.languages?.[item?.language]?.autonym
                          })`
                      )
                      ?.join(", ") || ""
                  }}
                </div>
              </div>
            </div>

            <div
              v-else-if="data.label === 'combinesLexemes'"
              class="text-[16px] p-[var(--spacing-75)] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[2px] flex"
            >
              <CdxIcon :icon="cdxIconLanguage" />
              <div class="text-[16px] pl-[var(--spacing-75)]">
                <div class="font-[700]">
                  {{ t("session.detail.combinesLexemes") }} ({{
                    data?.value?.property
                  }})
                </div>
                <div class="text-[var(--color-subtle)]">
                  {{
                    data?.value?.data
                      ?.map((item) => {
                        return `${item.value} (${item.id})`;
                      })
                      ?.join(" + ")
                  }}
                </div>
              </div>
            </div>

            <div
              v-else-if="data.label === 'images'"
              class="flex gap-x-[12px] mb-[var(--spacing-50)] border border-[var(--border-color-base)] rounded-[2px] p-[12px] w-full"
            >
              <div class="relative">
                <CdxThumbnail
                  :thumbnail="{ url: data?.value?.data?.[0]?.url }"
                  :placeholder-icon="cdxIconLogoWikidata"
                />
                <div class="w-[40px] h-[40px] absolute top-0">
                  <img :src="expand" />
                </div>
              </div>
              <div>
                <CdxLabel
                  class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0] pointer-events-none"
                  >{{ t("session.detail.images") }} ({{
                    data?.value?.property
                  }})</CdxLabel
                >
                <p
                  class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
                >
                  {{ data?.value?.data?.[0]?.value }}
                </p>
              </div>
            </div>

            <div
              v-else-if="
                data.label !== 'images' &&
                data.label !== 'gloss' &&
                data.label !== 'senseNumber' &&
                data.label !== 'externalLexemeSenseId' &&
                data.label !== 'combinesLexemes' &&
                data.label !== 'otherGlosses'
                // data.label !== 'otherGlosses'
              "
              class="mb-[var(--spacing-50)] border border-[var(--border-color-base)] p-[12px] rounded-[2px] flex flex-col w-full"
            >
              <span class="text-[var(--color-base)] font-[700]"
                >{{ t(`session.detail.${data.label}`) }} ({{
                  data?.value?.property
                }})</span
              >
              <span
                v-if="data.label === 'describedAtUrl'"
                class="text-[var(--color-subtle)]"
                >{{
                  data?.value?.data
                    ?.map((item) => {
                      return `${item.value}`;
                    })
                    .join(", ")
                }}
              </span>
              <span v-else class="text-[var(--color-subtle)]"
                >{{
                  data?.value?.data
                    ?.map((item) => {
                      return `${item.value} (${item.id})`;
                    })
                    .join(", ")
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="h-full flex justify-center items-center"
        v-else-if="senses?.length === 0 && !props.isLoading"
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
