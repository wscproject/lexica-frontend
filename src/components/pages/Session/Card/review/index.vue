<script setup>
import { CdxLabel, CdxIcon, CdxButton, CdxThumbnail } from "@wikimedia/codex";
import { cdxIconInfoFilled, cdxIconLogoWikidata } from "@wikimedia/codex-icons";
import { ref } from "vue";
import { useGeneralStore } from "@/store/general";
import Logo from "@/assets/add.svg";
import LogoDark from "@/assets/adddark.svg";

import wikimedia from "@/assets/lexeme.svg";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const isInfo = ref(false);

const store = useGeneralStore();
const emit = defineEmits(["backtoItem, onDone"]);
const props = defineProps({
  headerRef: Object,
  data: Object,
  detail: Object,
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
      <CdxLabel class="text-[18px] pb-0 text-white">{{
        t("session.preview.title")
      }}</CdxLabel>
    </div>
    <div
      class="px-[16px] pt-[68px] pb-[65px] overflow-auto pb-[45px] custom-maxheight bg-white dark:bg-[#101418] h-full"
    >
      <CdxLabel
        class="text-[16px] dark:text-[#EAECF0]"
        style="padding-bottom: 16px"
        >{{ t("session.preview.lexeme") }}</CdxLabel
      >
      <div
        class="border border-[#A2A9B1] dark:border-[#72777D] rounded-[2px] p-[12px] mb-[8px]"
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
              url: props?.data?.statements?.images?.data?.[0]?.url || wikimedia,
            }"
            :class="[
              !props?.data?.statements?.images?.data?.[0]?.url &&
                'custom-thumbnail',
            ]"
          />

          <div>
            <CdxLabel
              class="text-[16px] pb-[4px] leading-[20px] dark:text-[#EAECF0]"
              >{{ props?.data?.lemma }} ({{
                props?.data?.lexemeSenseId
              }})</CdxLabel
            >
            <p
              class="text-[16px] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[22px]"
            >
              {{ props?.data?.gloss || t("session.emptyDescription") }}
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="arrow dark:border-b-[#27292D]"></div>
      </div>
      <div class="p-[12px] bg-[#eaecf0] dark:bg-[#27292D]" v-if="props?.detail">
        <div class="flex gap-x-2 items-start">
          <img :src="store.isThemeDark ? LogoDark : Logo" alt="lexica_footer" />
          <CdxLabel
            class="text-[16px] dark:text-[#EAECF0]"
            style="padding-bottom: 16px"
            >{{ t("session.preview.statement") }} (P5137)</CdxLabel
          >
        </div>
        <div
          class="border border-[#A2A9B1] dark:border-[#72777D] rounded-[2px] p-[12px] bg-white dark:bg-[#101418]"
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
                {{
                  props?.detail?.description || t("session.emptyDescription")
                }}
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
      class="fixed bottom-0 w-full h-66px border-t border-[#A2A9B1] dark:border-[#72777D] p-[16px] flex justify-between align-center bg-white dark:bg-[#101418] gap-x-[12px] rounded-b-[16px]"
    >
      <CdxButton @click="emit('backtoItem')" class="w-full">{{
        t("session.preview.button1")
      }}</CdxButton>
      <CdxButton
        weight="primary"
        action="progressive"
        class="w-full"
        @click="
          emit('onDone', {
            senseId: props?.data?.lexemeSenseId,
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
  background-size: initial;
  background-position: center;
  background-color: #f8f9fa;
}
</style>
