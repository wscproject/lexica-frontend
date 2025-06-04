<script setup>
import { CdxLabel, CdxIcon, CdxButton, CdxThumbnail } from "@wikimedia/codex";
import { cdxIconInfoFilled, cdxIconLogoWikidata } from "@wikimedia/codex-icons";
import { computed, ref } from "vue";
import Logo from "@/assets/add.svg";
import LogoDark from "@/assets/adddark.svg";

import wikimedia from "@/assets/lexeme.svg";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const { t } = useI18n({ useScope: "global" });
const isInfo = ref(false);

const vuex = useStore();
const isThemeDark = computed(() => vuex.getters["profile/isDark"]);

const emit = defineEmits(["backtoItem, onDone"]);
const props = defineProps({
  headerRef: Object,
  data: Object,
  detail: Object,
  img: String,
  currLang: String,
});
</script>

<template>
  <div
    class="relative w-full flex flex-col overflow-hidden rounded-[15px] flex flex-col h-full"
  >
    <div
      class="p-[16px] text-white flex test justify-between gap-x-2 header fixed w-full rounded-t-[16px]"
      :style="{
        background: '#54595D',
        alignItems: 'center',
      }"
      :ref="props.headerRef"
    >
      <h4 class="text-[18px] pb-0 text-white font-bold leading-[22px]">
        {{ t("session.preview.title") }}
      </h4>
    </div>
    <div
      class="px-[16px] pt-[70px] pb-[65px] overflow-auto pb-[45px] custom-maxheight bg-white dark:bg-[#101418] h-full"
    >
      <CdxLabel
        class="text-[16px] dark:text-[#EAECF0]"
        style="padding-bottom: 16px"
        >{{ t("session.preview.lexeme") }}</CdxLabel
      >
      <div
        class="border border-[var(--border-color-base)] rounded-[2px] p-[12px] mb-[8px]"
      >
        <div class="flex gap-x-[12px]">
          <!-- <div
            class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
          >
            <img
              :src="
                props?.data?.statements?.images?.data?.[0]?.url || placeholder
              "
              class="object-cover w-full h-full"
            />
          </div> -->

          <CdxThumbnail
            :thumbnail="{
              url: props?.img || wikimedia,
            }"
            :class="[!props?.img && 'custom-thumbnail']"
          />

          <div>
            <CdxLabel
              class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0]"
              >{{ props?.data?.lemma }} ({{
                props?.data?.externalLexemeSenseId
              }})</CdxLabel
            >
            <p
              class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
            >
              <span v-if="props?.data?.gloss">
                {{ props?.data?.gloss }}
              </span>
              <span v-else
                ><i>
                  {{
                    `${t("session.emptyDescriptionHead")} ${props?.currLang}`
                  }}
                </i></span
              >
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="arrow dark:border-b-[#27292D]"></div>
      </div>
      <div class="p-[12px] bg-[#eaecf0] dark:bg-[#27292D]" v-if="props?.detail">
        <div class="flex gap-x-2 items-start">
          <img :src="isThemeDark ? LogoDark : Logo" alt="lexica_footer" />
          <CdxLabel
            class="text-[16px] dark:text-[#EAECF0]"
            style="padding-bottom: 16px"
          >
            <I18nT
              keypath="session.preview.newStatement"
              tag="p"
              class="p-0 text-[16px] dark:text-[#EAECF0] font-bold"
            >
              <template #statement>
                <span>{{ t("session.preview.statement") }} (P5137)</span>
              </template>
            </I18nT>
          </CdxLabel>
        </div>
        <div
          class="border border-[var(--border-color-base)] rounded-[2px] p-[12px] bg-white dark:bg-[#101418]"
        >
          <div class="flex gap-x-[12px]">
            <!-- <div
              class="border border-[#C8CCD1] rounded-[2px] overflow-hidden w-[48px] h-[48px] shrink-0"
            >
              <img
                :src="props?.detail?.image || placeholder"
                class="object-cover w-full h-full"
              />
            </div> -->
            <CdxThumbnail
              :thumbnail="{ url: props?.detail?.image }"
              :placeholder-icon="cdxIconLogoWikidata"
            />

            <div>
              <CdxLabel
                class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0]"
                >{{ props?.detail?.label }} ({{ props?.detail?.id }})</CdxLabel
              >
              <p
                class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
              >
                <span v-if="props?.detail?.description">
                  {{ props?.detail?.description }}</span
                >

                <span v-else
                  ><i> {{ t("session.emptyDescription") }}</i>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="p-[12px] bg-[#eaecf0] dark:bg-[#27292D]"
        v-if="!props?.detail"
      >
        <div class="flex gap-x-2">
          <CdxIcon :icon="cdxIconInfoFilled" />
          <div>
            <CdxLabel class="text-[16px] dark:text-[#EAECF0] p-0">{{
              t("session.preview.empty")
            }}</CdxLabel>
            <p class="text-[16px] text-[#54595D] dark:text-[#A2A9B1] pt-[5px]">
              <i>{{ t("session.preview.reason") }}</i>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed bottom-0 w-full h-66px border-t border-[var(--border-color-base)] p-[16px] flex justify-between align-center bg-white dark:bg-[#101418] gap-x-[12px] rounded-b-[16px]"
    >
      <CdxButton @click="emit('backtoItem')" class="w-full interactable">{{
        t("session.preview.button1")
      }}</CdxButton>
      <CdxButton
        weight="primary"
        action="progressive"
        class="w-full interactable"
        @click="
          emit('onDone', {
            contributionDetailId: props?.data?.id,
            itemId: props?.detail?.id || '',
          })
        "
        >{{ t("session.preview.button2") }}</CdxButton
      >
    </div>
  </div>
</template>

<style>
.arrow {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #eaecf0;
}

.custom-thumbnail .cdx-thumbnail__image {
  background-size: auto !important;
  background-position: center !important;
  background-color: transparent !important;
}
</style>
