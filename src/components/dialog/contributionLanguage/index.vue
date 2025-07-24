<script setup>
import {
  CdxDialog,
  CdxButton,
  CdxIcon,
  CdxRadio,
  CdxSearchInput,
  CdxLabel,
  CdxField,
} from "@wikimedia/codex";
import { cdxIconClose } from "@wikimedia/codex-icons";
import debounce from "lodash.debounce";
import { computed, nextTick, onMounted, ref, toRef, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const { t } = useI18n();
const vuex = useStore();

const language = computed(() => vuex.getters["profile/language"]);
const languageCode = computed(() => vuex.getters["profile/language"]);
const languageName = computed(() => vuex.getters["profile/fullLang"]);
const languageId = computed(() => vuex.getters["profile/langId"]);

const search = ref("");
const isSearch = ref(false);
const selected = ref(null);

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  searchLoading: {
    type: Boolean,
    required: true,
  },
  defaultLang: {
    type: Object,
    required: true,
  },
});

const opened = toRef(props, "open");
const radioRef = ref(null);

const emit = defineEmits(["onClose", "setSearch", "applyLanguage"]);

const close = () => {
  search.value = "";
  emit("setSearch", search.value);
  emit("onClose", false);
};

const apply = () => {
  close();
  emit("applyLanguage", selected.value);
};

const onInput = debounce(() => {
  if (search.value === "") {
    isSearch.value = false;
    emit("setSearch", search.value);
  } else {
    isSearch.value = true;
    emit("setSearch", search.value);
  }
}, 500);

// watch(props, () => {
//   selected.value= props.defaultLang;
// });

watch(search, () => {
  if (search.value === '') {
    emit("setSearch", search.value);
  }
})

watch(
  () => props.open,
  async (newVal) => {
    if (newVal) {
      selected.value = props.defaultLang;
      await nextTick(); // Wait for DOM updates
      const radio = document.getElementById(`my-radio-${selected.value.full}`);
      console.log(radio.firstElementChild.firstElementChild);

      if (radio) {
        radio.firstElementChild.focus(); // Focus on the first radio button
      }
    }
  }
);

watch(language, () => {
  selected.value = {
    full: languageName.value,
    value: languageCode.value,
    id: languageId.value,
  };
  console.log(radioRef.value);
});
</script>

<template>
  <div>
    <CdxDialog :open="props.open" @update:open="close" class="contributionLang fontLang">
      <template #header>
        <div class="flex justify-between align-center pb-[0.75rem]">
          <CdxLabel class="text-[1.125rem] p-0">{{
            t("contributionLangDialog.title")
          }}</CdxLabel>
          <CdxButton :aria-label="t('aria.close')" @click="close" weight="quiet">
            <CdxIcon :icon="cdxIconClose" dir="rtl" class="cursor-pointer" />
          </CdxButton>
        </div>
        <div class="relative">
          <CdxSearchInput :placeholder="t('contributionLangDialog.placeholder')" class="relative" v-model="search"
            @input="onInput" clearable="true" />

          <div class="progress absolute top-0" v-if="props.searchLoading">
            <div class="progress-bar progress-bar-info progress-bar-striped active" style="width: 100%"></div>
          </div>
        </div>
      </template>

      <div role="radiogroup" class="px-[var(--spacing-150)] py-[0.5rem] overflow-y-auto"
        style="max-height: calc(100vh - 360px); min-height: 16rem;">
        <CdxField v-if="props.options.length > 0" :is-fieldset="true">
          <CdxRadio :id="`my-radio-${option.full}`" ref="radioRef" autofocus @keydown.enter="apply"
            v-for="option in props.options" :key="option.label" :input-value="{
              value: option?.value,
              full: option?.full,
              id: option?.id,
            }" v-model="selected" @update:modelValue="selected" name="as">
            {{ option.label }}
          </CdxRadio>
        </CdxField>


        <div v-else>
          <CdxLabel class="text-[#D73333] dark:text-[#FD7865]">{{
            t("contributionLangDialog.emptySearch1")
          }}</CdxLabel>
          <CdxLabel class="text-[#D73333] dark:text-[#FD7865]">{{
            t("contributionLangDialog.emptySearch2")
          }}</CdxLabel>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-x-[0.75rem] w-full justify-end">
          <CdxButton class="w-fit h-[2.125rem]" @click="close">{{
            t("contributionLangDialog.cancel")
          }}</CdxButton>
          <CdxButton :class="['h-[2.125rem]', 'w-fit']" weight="primary" action="progressive" @click="apply">
            {{ t("contributionLangDialog.apply") }}
          </CdxButton>
        </div>
      </template>
    </CdxDialog>
  </div>
</template>

<style>
.contributionLang .cdx-dialog__header {
  @apply pt-[1rem] pr-[0.75rem] pb-[1rem] pl-[1rem] border-b border-[#A2A9B1] dark:border-[#72777D];
}

.contributionLang .cdx-dialog__body {
  overflow: unset !important;
}

.contributionLang .cdx-dialog__footer {
  @apply p-[1rem] border-t border-[#A2A9B1] dark:border-[#72777D];
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
