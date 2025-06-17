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
  <div class="relative w-full flex flex-col overflow-hidden rounded-[0.9375rem] flex flex-col h-full">
    <div class="p-[1rem] text-white flex test justify-between gap-x-2 header fixed w-full rounded-t-[1rem]" :style="{
      background: '#54595D',
      alignItems: 'center',
    }" :ref="props.headerRef">
      <h4 class="text-[1.125rem] pb-0 text-white font-bold leading-[1.375rem]">
        {{ t("session.preview.title") }}
      </h4>
    </div>
    <div
      class="px-[1rem] pt-[4.375rem] pb-[4.0625rem] overflow-auto pb-[2.8125rem] custom-maxheight bg-white dark:bg-[#101418] h-full">
      <CdxLabel class="text-[1rem] dark:text-[#EAECF0]" style="padding-bottom: 1rem">{{ t("session.preview.lexeme") }}
      </CdxLabel>
      <div class="border border-[var(--border-color-base)] rounded-[0.125rem] p-[0.75rem] mb-[0.5rem]">
        <div class="flex gap-x-[0.75rem]">
          <!-- <div
            class="border border-[#C8CCD1] rounded-[0.125rem] overflow-hidden w-[3rem] h-[3rem] shrink-0"
          >
            <img
              :src="
                props?.data?.statements?.images?.data?.[0]?.url || placeholder
              "
              class="object-cover w-full h-full"
            />
          </div> -->

          <CdxThumbnail :thumbnail="{
            url: props.img || wikimedia,
          }" :class="[!img && 'custom-thumbnail']" />

          <div>
            <CdxLabel class="text-[1rem] pb-[0.25rem] leading-[1.25rem] dark:text-[#EAECF0]">{{ props?.data?.lemma }}
              ({{
                props?.data?.externalLexemeFormId
              }})</CdxLabel>
            <p class="text-[1rem] font-normal text-[#54595D] dark:text-[#A2A9B1] pb-[0] leading-[1.375rem]">
              <span v-if="props?.data?.gloss">{{ props?.data?.gloss }}</span>

              <span v-else>
                <i>{{ t("session.emptyDescriptionHead") }}
                  {{ props?.currLang }}</i></span>
            </p>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <div class="arrow dark:border-b-[#27292D]"></div>
      </div>
      <div class="p-[0.75rem] bg-[#eaecf0] dark:bg-[#27292D]">
        <div class="flex gap-x-2 items-start">
          <img :src="isThemeDark ? LogoDark : Logo" alt="lexica_footer" />
          <div class="">
            <CdxLabel class="text-[1rem] dark:text-[#EAECF0] pb-0" style="padding-bottom: 1rem">
              {{ t("session.hyphenationPreview.newStatement") }}
            </CdxLabel>

            <span class="text-[1rem] text-[var(--color-subtle)]" style="letter-spacing: 0.031rem">{{
              props?.detail?.split(",").join("‧") }}</span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed bottom-0 w-full h-4.125rem border-t border-[var(--border-color-base)] p-[1rem] flex justify-between align-center bg-white dark:bg-[#101418] gap-x-[0.75rem] rounded-b-[1rem]">
      <CdxButton @click="emit('backtoItem')" class="w-full">{{
        t("session.preview.button1")
      }}</CdxButton>
      <CdxButton weight="primary" action="progressive" class="w-full" @click="
        emit('onDone', {
          hyphenation: props?.detail?.split(',') || '',
        })
        ">{{ t("session.preview.button2") }}</CdxButton>
    </div>
  </div>
</template>

<style>
.arrow {
  width: 0;
  height: 0;
  border-left: 0.75rem solid transparent;
  border-right: 0.75rem solid transparent;
  border-bottom: 0.75rem solid #eaecf0;
}

.custom-thumbnail .cdx-thumbnail__image {
  background-size: auto !important;
  background-position: center !important;
  background-color: transparent !important;
}
</style>
