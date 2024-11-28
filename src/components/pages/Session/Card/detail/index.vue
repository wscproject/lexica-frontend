<script setup>
import {
  CdxLabel,
  CdxIcon,
  CdxProgressBar,
  CdxThumbnail,
} from "@wikimedia/codex";
import {
  cdxIconLogoWikidata,
  cdxIconClose,
  cdxIconExpand,
  cdxIconLanguage,
} from "@wikimedia/codex-icons";
import { computed, reactive, ref, toRaw, watch } from "vue";
import placeholder from "@/assets/placeholder.svg";
import wikimedia from "@/assets/WikidataLexeme.svg";
import { useI18n } from "vue-i18n";
import expand from "@/assets/expand.svg";

const { t } = useI18n({ useScope: "global" });
const isInfo = ref(false);

const props = defineProps({
  data: Object,
  headerData: Object,
  isLoading: Boolean,
});

const emit = defineEmits(["backtoItem, onHold, onRelease, showImage"]);

const image = ref("");

const setInfo = () => {
  isInfo.value = !isInfo.value;
};

const hovered = ref(false);

const isExpand = ref(false);

const translate = (data) => {
  if (data === "images") {
    return t("session.detail.images");
  } else if (data === "antonym") {
    return t("session.detail.antonym");
  } else if (data === "synonym") {
    return t("session.detail.synonym");
  } else if (data === "locationOfSenseUsage") {
    return t("session.detail.locationOfSenseUsage");
  } else if (data === "languageStyle") {
    return t("session.detail.languageStyle");
  } else if (data === "describedAtUrl") {
    return t("session.detail.describedAtUrl");
  } else if (data === "translation") {
    return t("session.detail.translation");
  }
};

const statements = computed(() => {
  return props?.data?.statements
    ? [...Object.entries(props?.data?.statements)]?.filter(
        (item) => item?.[1]?.data?.[0]?.value
      )
    : [];
});

const isThisLexeme = computed(() => {
  return (
    props?.data?.usageExamples &&
    props?.data?.hasCharacteristics &&
    props?.data?.combineLexemes
  );
});
</script>

<template>
  <div class="relative w-full overflow-hidden flex flex-col h-full">
    <div
      class="header p-[16px] text-white flex test justify-between relative rounded-t-[15px]"
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
        <CdxLabel class="text-[18px] pb-[4px] leading-[22.5px]">{{
          props?.headerData?.lemma
        }}</CdxLabel>

        <div class="flex items-center gap-x-2 pb-[4px]">
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
        >
          {{ props.headerData.gloss }}
        </p>

        <p v-else class="text-[16px] p-0">
          <i>{{ t("session.emptyDescription") }}</i>
        </p>
      </div>
      <div>
        <CdxIcon
          :icon="cdxIconClose"
          class="text-white cursor-pointer"
          @click.stop="emit('backtoItem')"
        />
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

      <div class="h-full" v-if="!props.isLoading">
        <CdxLabel
          v-if="isThisLexeme"
          class="text-[16px] dark:text-[#EAECF0]"
          style="padding-bottom: 12px"
          >{{ t("session.detail.title1") }}</CdxLabel
        >

        <div
          v-if="data?.usageExamples"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.usageExample") }} (P5831)</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.usageExamples
          }}</span>
        </div>

        <div
          v-if="data?.hasCharacteristics"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.hasCharacteristics") }} (P1552)</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.hasCharacteristics
          }}</span>
        </div>

        <div
          v-if="data?.combinesLexemes"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.combinesLexemes") }} (P5831)</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.combinesLexemes
          }}</span>
        </div>

        <CdxLabel
          class="text-[16px] dark:text-[#EAECF0] mb-[var(--spacing-50)] p-0"
          style="padding-bottom: 12px"
          >{{ t("session.detail.title2") }}</CdxLabel
        >

        <CdxLabel
          class="text-[14px] dark:text-[#EAECF0] mb-[var(--spacing-50)]"
          >{{ t("session.detail.subtitle1") }}</CdxLabel
        >

        <div
          class="flex gap-x-[12px] mb-[var(--spacing-50)] border border-[var(--border-color-base)] p-[12px] w-full"
        >
          <div class="relative">
            <CdxThumbnail
              :thumbnail="{ url: data?.sense?.images?.data?.[0]?.url }"
              :placeholder-icon="cdxIconLogoWikidata"
            />
            <div class="w-[40px] h-[40px] absolute top-0">
              <img :src="expand" />
            </div>
          </div>
          <div>
            <CdxLabel
              class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0] pointer-events-none"
            >
              ({{ data?.sense?.images?.property }})</CdxLabel
            >
            <p
              class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
            >
              {{ data?.sense?.images?.data?.[0]?.value }}
            </p>
          </div>
        </div>

        <div
          v-if="data?.sense?.antonym"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.antonym") }} ({{
              data?.sense?.antonym?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.antonym?.data?.[0]?.value
          }}</span>
        </div>

        <div
          v-if="data?.sense?.synonym"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.synonym") }} ({{
              data?.sense?.synonym?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.synonym?.data?.[0]?.value
          }}</span>
        </div>

        <div
          v-if="data?.sense?.locationOfSenseUsage"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.locationOfSenseUsage") }} ({{
              data?.sense?.locationOfSenseUsage?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.locationOfSenseUsage?.data?.[0]?.value
          }}</span>
        </div>

        <div
          v-if="data?.sense?.languageStyle"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.languageStyle") }} ({{
              data?.sense?.languageStyle?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.languageStyle?.data?.[0]?.value
          }}</span>
        </div>

        <div
          v-if="data?.sense?.describedAtUrl"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.describedAtUrl") }} ({{
              data?.sense?.describedAtUrl?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.describedAtUrl?.data?.[0]?.value
          }}</span>
        </div>

        <div
          v-if="data?.sense?.glossQuotes"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.glossQuotes") }} ({{
              data?.sense?.glossQuotes?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.glossQuotes?.data?.[0]?.value
          }}</span>
        </div>

        <div
          v-if="data?.sense?.sematicGender"
          class="border-[1px] border-[var(--border-color-base)] bg-[var(--background-color-base)] p-[var(--spacing-75)] rounded-[2px] flex flex-col gap-y-[var(--spacing-25)] mt-[var(--spacing-50)]"
        >
          <span
            class="text-[var(--color-base)] text-[16px] font-[700] leading-[20px]"
            >{{ t("session.detail.sematicGender") }} ({{
              data?.sense?.sematicGender?.property
            }})</span
          >
          <span class="text-[var(--color-subtle)] text-[16px] leading-[22px]">{{
            data?.sense?.sematicGender?.data?.[0]?.value
          }}</span>
        </div>

        <CdxLabel
          class="text-[14px] dark:text-[#EAECF0] mb-[var(--spacing-50)]"
          >{{ t("session.detail.subtitle2") }}</CdxLabel
        >

        <!-- <v-expansion-panels theme="dark">
          <v-expansion-panel
            theme="dark"
            :title="t('session.detail.title3')"
            class="bg-[var(--background-color-neutral)] detail"
          >
            <template #title>
              <div
                class="bg-[green] text-[var(--color-base)] font-[700] text-[16px]"
              >
                {{ t("session.detail.title3") }}
              </div>
            </template>
          </v-expansion-panel>
        </v-expansion-panels> -->

        <div
          class="px-[var(--spacing-75)] pt-[var(--spacing-75)] bg-[var(--background-color-neutral)] text-[var(--color-base)] rounded-[var(--border-radius-base)] border border-[var(--border-base-color)]"
          @click="isExpand = !isExpand"
        >
          <div
            class="font-[700] text-[16px] pb-[var(--spacing-75)] flex align-center justify-between cursor-pointer"
          >
            <span>{{ t("session.detail.title3") }}</span>

            <CdxIcon
              :icon="cdxIconExpand"
              :class="`icon ${isExpand && 'open'}`"
            />
          </div>
          <v-expand-transition class="duration-[250ms] ease-out">
            <div v-show="isExpand">
              <div v-for="item in data?.otherSenses" :key="item.senseNumber">
                <div class="text-[14px] font-[700] pb-[var(--spacing-50)]">
                  {{ item?.gloss }}
                </div>
                <div
                  class="text-[16px] p-[var(--spacing-75)] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)]] rounded-[2px]"
                >
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
                  class="text-[16px] p-[var(--spacing-75)] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] rounded-[2px] flex"
                >
                  <CdxIcon :icon="cdxIconLanguage" />
                  <div class="text-[16px] pl-[var(--spacing-75)]">
                    <div class="font-[700]">
                      {{ t("session.detail.otherGlosses") }}
                    </div>
                    <div class="text-[var(--color-subtle)]">
                      {{
                        data
                          ?.map((item) => {
                            item.value;
                          })
                          .join(", ")
                      }}
                    </div>
                  </div>
                </div>

                <div
                  class="flex gap-x-[12px] mb-[var(--spacing-50)] bg-[var(--background-color-base)] border border-[var(--border-color-base)] p-[var(--spacing-75)] w-full text-[16px]"
                >
                  <div class="relative">
                    <CdxThumbnail
                      :thumbnail="{
                        url: item?.itemForThisSense?.data?.[0]?.url,
                      }"
                      :placeholder-icon="cdxIconLogoWikidata"
                    />
                    <div class="w-[40px] h-[40px] absolute top-0">
                      <img :src="expand" />
                    </div>
                  </div>
                  <div>
                    <CdxLabel
                      class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0] pointer-events-none"
                    >
                      ({{ item?.itemForThisSense?.properties }})</CdxLabel
                    >
                    <p
                      class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
                    >
                      {{ item?.itemForThisSense?.data?.[0]?.value }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </v-expand-transition>
        </div>
      </div>
      <div
        class="h-full flex justify-center items-center"
        v-else-if="statements.length === 0 && !props.isLoading"
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
