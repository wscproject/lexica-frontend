<script setup>
import { CdxLabel } from "@wikimedia/codex";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  data: Object,
  currCount: Number,
  isNotCurrent: Boolean,
  currLang: String,
});
</script>

<template>
  <div
    class="absolute z-[99] w-full flex justify-center flex-col text-center p-[16px] h-full"
  >
    <div v-if="!isNotCurrent">
      <span
        :class="[
          (props?.data?.externalLexemeSenseId ||
            props?.data?.externalLexemeFormId) &&
            'text-[var(--color-inverted-fixed)]',
          'font-bold',
        ]"
        >{{ t("session.title") }} {{ props.currCount }}</span
      >
      <p
        :class="[
          (props?.data?.externalLexemeSenseId ||
            props?.data?.externalLexemeFormId) &&
            'text-[var(--color-inverted-fixed)]',
          'text-[28px] py-[var(--spacing-100)]',
        ]"
      >
        {{ props?.data?.lemma }} ({{
          props?.data?.externalLexemeSenseId ||
          props?.data?.externalLexemeFormId ||
          props?.data?.externalLexemeId ||
          ""
        }})
      </p>
      <p
        v-if="props?.data?.gloss"
        :class="[
          (props?.data?.externalLexemeSenseId ||
            props?.data?.externalLexemeFormId) &&
            'text-[var(--color-inverted-fixed)]',
          'text-[16px]',
        ]"
      >
        {{ props?.data?.gloss }}
      </p>
      <p
        v-else
        :class="[
          (props?.data?.externalLexemeSenseId ||
            props?.data?.externalLexemeFormId) &&
            'text-[var(--color-inverted-fixed)]',
          'text-[16px]',
        ]"
      >
        <i>{{ t("session.emptyDescriptionHead") }} {{ props?.currLang }}</i>
      </p>
    </div>
  </div>
</template>
