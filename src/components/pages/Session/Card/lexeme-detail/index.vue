<script setup>
import { CdxLabel, CdxIcon, CdxThumbnail } from "@wikimedia/codex";
import {
  cdxIconLogoWikidata,
  cdxIconArrowPrevious,
  cdxIconLanguage,
} from "@wikimedia/codex-icons";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import wikimedia from "@/assets/WikidataLexeme.svg";
import { useI18n } from "vue-i18n";
import expand from "@/assets/expand.svg";
import Loading from "@/components/ui/loading.vue";

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
      class="header pt-[var(--spacing-100)] pl-[var(--spacing-50)] pb-[var(--spacing-75)] pr-[var(--spacing-100)]] rtl:pl-[var(--spacing-100)] rtl:pr-[var(--spacing-50)] text-white flex test justify-between relative rounded-t-[0.9375rem]"
      :style="{
        background: '#3056A9',
        alignItems: 'flex-start',
        transition: 'all 0.4s ease-in-out',
      }" @mousedown.stop="emit('onHold')" @mouseup.stop="emit('onRelease')" @touchstart.stop="emit('onHold')"
      @touchend.stop="emit('onRelease')">
      <div class="w-full break-normal">
        <div class="flex items-center gap-x-[var(--spacing-25)] pb-[var(--spacing-25)]">
          <CdxIcon :aria-label="t('aria.close')" :icon="cdxIconArrowPrevious"
            class="text-white cursor-pointer mx-[var(--spacing-25)] interactable" @click="emit('backtoItem')"
            @keydown.space="emit('backtoItem')" />
          <h4 class="font-bold text-[1.125rem] leading-[1.406rem]">
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
      <div v-if="props.isLoading" class="h-full">
        <div class="w-full h-full flex justify-center items-center">
          <Loading :text="t('session.detail.loading')" variant="default" />
        </div>
      </div>

      <div class="h-full w-full" v-if="senses.length !== 0 && !props.isLoading">
        <div v-if="props?.data?.grammaticalFeatures"
          class="rounded-[0.125rem] mb-[var(--spacing-100)] text-[var(--color-base)] p-[var(--spacing-50)] bg-[var(--background-color-neutral)] border border-[var(--border-color-base)]">
          <span class="text-[1rem]">{{ t("session.detail.grammaticalFeature") }}
            <b>{{ props?.data?.grammaticalFeatures }}</b></span>
        </div>

        <div class="pb-[var(--spacing-50)] w-full">
          <span class="text-[var(--color-base)] font-[700]">{{ t("session.detail.allSense") }}
          </span>
        </div>

        <div v-for="sense in senses" class="pb-[0.25rem] w-full">
          <div v-for="data in sense?.data?.filter((i) => i.value !== null)" class="w-full" @mouseover="
            () => {
              if (data.label === 'images' && !hovered) hovered = true;
            }
          " @mouseout="
            () => {
              if (data.label === 'images' && hovered) hovered = false;
            }
          " :style="hovered && 'cursor: pointer'" @click="
            () => {
              if (data.label === 'images' && data?.value?.data?.[0]?.url)
                emit('showImage', data?.value?.data?.[0]?.url);

              // console.log('sdasd');
            }
          ">
            <div v-if="data.label === 'gloss'" class="pb-[var(--spacing-50)] w-full">
              <span class="text-[var(--color-base)] font-[700] text-[0.875rem]">{{ t("session.detail.sense") }} {{
                sense.number }}:
                {{ data.value }}</span>
            </div>

            <div v-else-if="
              data.label === 'otherGlosses' && data?.value?.length !== 0
            "
              class="text-[1rem] p-[var(--spacing-75)] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[0.125rem] flex">
              <CdxIcon :icon="cdxIconLanguage" />
              <div class="text-[1rem] pl-[var(--spacing-75)]">
                <div class="font-[700] text-[var(--color-base)]">
                  {{ t("session.detail.otherGlosses") }}
                </div>
                <div class="text-[var(--color-subtle)]">
                  {{
                    data?.value
                      ?.map(
                        (item) =>
                          `${item.value} (${props?.languages?.[item?.language]?.autonym
                          })`
                      )
                      ?.join(", ") || ""
                  }}
                </div>
              </div>
            </div>

            <div v-else-if="data.label === 'combinesLexemes'"
              class="text-[1rem] p-[var(--spacing-75)] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[0.125rem] flex">
              <CdxIcon :icon="cdxIconLanguage" />
              <div class="text-[1rem] pl-[var(--spacing-75)]">
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

            <div v-else-if="data.label === 'images'"
              class="flex gap-x-[0.75rem] mb-[var(--spacing-50)] border border-[var(--border-color-base)] rounded-[0.125rem] p-[0.75rem] w-full">
              <div class="relative">
                <CdxThumbnail :thumbnail="{ url: data?.value?.data?.[0]?.url }"
                  :placeholder-icon="cdxIconLogoWikidata" />
                <div class="w-[2.5rem] h-[2.5rem] absolute top-0">
                  <img :src="expand" />
                </div>
              </div>
              <div>
                <CdxLabel class="text-[1rem] pb-[0.25rem] leading-[1.25rem] dark:text-[#EAECF0] pointer-events-none">{{
                  t("session.detail.images") }} ({{
                    data?.value?.property
                  }})</CdxLabel>
                <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[1.375rem]">
                  {{ data?.value?.data?.[0]?.value }}
                </p>
              </div>
            </div>

            <div v-else-if="
              data.label !== 'images' &&
              data.label !== 'gloss' &&
              data.label !== 'senseNumber' &&
              data.label !== 'externalLexemeSenseId' &&
              data.label !== 'combinesLexemes' &&
              data.label !== 'otherGlosses'
              // data.label !== 'otherGlosses'
            "
              class="mb-[var(--spacing-50)] border border-[var(--border-color-base)] p-[0.75rem] rounded-[0.125rem] flex flex-col w-full">
              <span class="text-[var(--color-base)] font-[700]">{{ t(`session.detail.${data.label}`) }} ({{
                data?.value?.property
              }})</span>
              <span v-if="data.label === 'describedAtUrl'" class="text-[var(--color-subtle)]">{{
                data?.value?.data
                  ?.map((item) => {
                    return `${item.value}`;
                  })
                  .join(", ")
              }}
              </span>
              <span v-else class="text-[var(--color-subtle)]">{{
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
      <div class="h-full flex justify-center items-center" v-else-if="senses?.length === 0 && !props.isLoading">
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
  transform: translateY(-1.25rem);
  opacity: 0;
}
</style>
