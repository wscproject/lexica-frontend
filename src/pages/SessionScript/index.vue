<script setup>
import Card from "@/components/pages/Session/Card/index.vue";
import CardItem from "@/components/pages/Session/Card/script-writing/index.vue";
import CardItemDetail from "@/components/pages/Session/Card/lexeme-detail/index.vue";
import CardSubItemDetail from "@/components/pages/Session/Card/subitem/index.vue";
import CardReview from "@/components/pages/Session/Card/script-review/index.vue";
import CardSplash from "@/components/pages/Session/Card/splash/index.vue";
import CardSubmitting from "@/components/pages/Session/Card/submitting/index.vue";
import CardSubmitFailed from "@/components/pages/Session/Card/submitFailed/index.vue";
import CardSuccess from "@/components/pages/Session/Card/success/index.vue";

import Lightbox from "@/components/pages/Session/Lightbox/index.vue";
import Loading from "@/components/ui/loading.vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import { useDirWatcher } from "@/helper/useDirWatcher";

import { CdxLabel, CdxIcon, CdxButton } from "@wikimedia/codex";
import {
  cdxIconHome,
  cdxIconSuccess,
  cdxIconUndo,
} from "@wikimedia/codex-icons";
import {
  computed,
  ref,
  watch,
  Transition,
  onMounted,
  reactive,
  toRaw,
  nextTick,
} from "vue";
import SkipIcon from "@/components/icons/skip/index.vue";
import SkipDarkIcon from "@/components/icons/skipdark/index.vue";

import error from "/src/assets/error.svg";
import errordark from "@/assets/errordark.svg";

import blank from "@/assets/blank_icon.svg";
import blankdark from "@/assets/blank_icon_dark.svg";

import sad from "@/assets/Sad.svg";
import happy from "@/assets/happy.svg";

import WarningDialog from "@/components/dialog/leaveWarning/index.vue";
import CompleteDialog from "@/components/dialog/complete/index.vue";
import {
  GetCards,
  SearchEntity,
  GetScriptDetail,
  GetEntityDetail,
  UpdateScriptCardDetail,
  EndContribution,
  GetLanguages,
} from "@/api/Session";
import { GetProfile } from "@/api/Home";

import { useI18n } from "vue-i18n";
import { useMediaQuery, usePreferredReducedMotion } from "@vueuse/core";
import { useStore } from "vuex";
import { cardDisableAccessibilityConnect } from "@/helper/accessibility";
import { useHtmlHasClass } from "@/helper/hasClass";

const isPreferredDark = useMediaQuery("(prefers-color-scheme: dark)");
const isReduceMotion = usePreferredReducedMotion();
const isPreferredMotion = ref(localStorage.getItem("reduceMotion") === "true");

const { t } = useI18n({ useScope: "global" });
const vuex = useStore();
const { hasClass } = useHtmlHasClass("reduced-motion");

const isThemeDark = computed(() => vuex.getters["profile/isDark"]);
const language = computed(() => vuex.getters["profile/language"]);
const { dir } = useDirWatcher();

const router = useRouter();

//Used to differentiate between skip button and skip gesture
const isSkipButton = ref(false);

const completeRef = ref(null);
const count = ref(3);
const totalData = ref(0);
const data = ref([]);
const tempData = ref(null);
const detail = ref(null);
const currMargin = ref(3); // 48px -> 3rem
const flip = ref(false);
const currMode = ref(1);
const next = ref(false);
const prev = ref(false);
const submit = ref(false);
const cardRef = ref(null);
const isMove = ref(false);
const splash = ref(true);
const submittingData = ref(false);
const undoWarn = ref(false);
const progress = reactive({ number: 0 });
const skipAll = ref(false);
const testing = ref(false);
const springBack = ref(false);
const zIndex = ref("z-[1]");
const isLoading = ref(false);
const entities = ref([]);
const params = reactive({
  page: 1,
  limit: 3,
  keyword: "",
});
const searchLoading = ref(false);
const recommendedLoading = ref(false);
const loadmoreLoading = ref(false);
const cardDetailData = ref(null);
const cardDetailLoading = ref(false);
const entityDetailData = ref(null);
const entityDetailLoading = ref(false);
const isError = ref(false);
const detailHeaderData = ref(null);
const isSubmitError = ref(false);
const subItemHeaderData = ref(null);
const shownImage = ref("");

const timeoutLoading = ref(null);
const noInternet = ref(null);
const errorLog = ref(null);
const endLoading = ref(false);
const totalCount = ref(0);

const noLoad = ref(false);
const isSuccess = ref(false);
const languages = ref(null);

const onHideCard = () => {
  tempData.value = data.value.pop();
  count.value = count.value - 1;
};

const currCount = computed(() => {
  // return 5 - count.value + 1;
  return totalCount.value + 1 - data?.value?.length;
});

const nextCard = (isButton, id, contributionId) => {
  if (isButton) {
    next.value = true;
  }

  isSkipButton.value = isButton;

  // springBack.value = true;

  // setTimeout(() => {
  //   springBack.value = false;
  // }, 1000);

  setTimeout(async () => {
    splash.value = true;

    setUndoWarn(id, contributionId);
    onHideCard();
    zIndex.value = "z-[1]";

    currMode.value = 1;
    flip.value = false;
    noLoad.value = false;
    if (isButton) {
      next.value = false;
    }
    disableSplash();
  }, 300);
};

const slideRightWithSuccess = () => {
  setTimeout(() => {
    submit.value = true;
    noLoad.value = false;
    // isSuccess.value = false;
    if (!isPreferredMotion.value) {
      setTimeout(() => {
        isSuccess.value = false;
      }, 50);
    }

    setTimeout(async () => {
      if (isPreferredMotion.value) {
        isSuccess.value = false;
      }

      onHideCard();

      splash.value = true;

      // isSuccess.value = false;

      currMode.value = 1;

      submittingData.value = false;
      // flip.value = false;
      flip.value = false;
      submit.value = false;
      // zIndex.value = "z-[1]";
      disableSplash();
    }, 400);
  }, 1000);
};

// const slideRight = () => {
//   submit.value = true;

//   submittingData.value = false;
//   noLoad.value = false;

//   setTimeout(async () => {
//     currMode.value = 1;
//     splash.value = true;

//     onHideCard();

//     // flip.value = false;
//     flip.value = false;
//     submit.value = false;
//     disableSplash();
//   }, 200);
// };

const submitCard = async (item, contributionId, id) => {
  submittingData.value = true;
  let action = "";

  action = "add";

  const response = await updateDetail({
    data: { ...item, action: action },
    contributionId,
    id,
  });

  if (response.statusCode === 200) {
    isSuccess.value = true;

    setTimeout(() => {
      slideRightWithSuccess();
    }, 1125);
  } else if (response.statusCode === 503) {
    isLoading.value = false;
    noInternet.value = true;
  } else {
    isSubmitError.value = true;
    submittingData.value = false;

    // isSuccess.value = true;

    // slideRightWithSuccess();
  }
};

let timeout = null;

const undoCard = () => {
  clearTimeout(timeout);

  // springBack.value = true;
  prev.value = true;
  splash.value = false;

  data.value = [...data.value, tempData.value];
  tempData.value = null;
  undoWarn.value = false;

  // setTimeout(() => {
  //   springBack.value = false;
  // }, 1000);

  setTimeout(() => {
    prev.value = false;
  }, 600);
};

const disableSplash = () => {
  setTimeout(() => {
    splash.value = false;
  }, 1500);
};

const reload = () => {
  window.location.reload();
};

onBeforeRouteLeave(async (to, from) => {
  if (!skipAll.value) {
    if (currCount.value > 1 && currCount.value < totalCount.value + 1) {
      const userInput = await testing?.value?.openModal();

      if (!userInput) {
        return false;
      } else {
        skipAll.value = true;

        const response = await EndContribution();

        if (response?.statusCode === 503) {
          isLoading.value = false;
          noInternet.value = true;
        }

        const completeInput = await completeRef?.value?.openModal();

        if (!completeInput) {
          return false;
        }
      }
    }
  }

  // cancel the navigation and stay on the same page
});

const endEarly = async () => {
  if (currCount.value > 1 && currCount.value < totalCount.value + 1) {
    const userInput = await testing?.value?.openModal();

    if (userInput) {
      skipAll.value = true;
      endLoading.value = true;

      const response = await EndContribution();

      if (response?.statusCode === 200) {
        endLoading.value = false;

        const userInput = await completeRef?.value?.openModal();

        if (userInput) {
          router.push("/");
        }
      }

      if (response?.statusCode === 503) {
        endLoading.value = false;
        isLoading.value = false;
        noInternet.value = true;
      }
    }
  } else {
    router.push("/");
  }
};

const setUndoWarn = async (id, contributionId) => {
  undoWarn.value = true;

  const duration = 2750; // Total duration in milliseconds
  const interval = 27.5; // Update interval in milliseconds
  const steps = duration / interval;
  let currentStep = 0;

  const increment = async () => {
    progress.number = (currentStep / steps) * 100;
    currentStep++;

    if (currentStep <= steps) {
      timeout = setTimeout(increment, interval);
    }

    if (progress.number === 100) {
      undoWarn.value = false;

      if (currCount.value <= totalCount.value)
        await updateDetail({ data: { action: "skip" }, contributionId, id });

      // if (data?.value?.length === 0) {
      //   const completeInput = await completeRef?.value?.openModal();

      //   if (!completeInput) {

      //   }
      // }
    }
  };

  timeout = setTimeout(increment, interval);
};

watch(timeoutLoading, () => {
  console.log(timeout);
});

const updateDetail = async ({ data, contributionId, id }) => {
  const response = await UpdateScriptCardDetail({
    data,
    contributionId,
    id,
  });

  return response;
};

const aa = () => {
  isMove.value = true;
  // if (flip) {
  //   flip.value = false;
  // }
};

const ab = () => {
  springBack.value = true;
  isMove.value = false;
  setTimeout(() => {
    springBack.value = false;
  }, 350);
};

const test1 = async (id, contributionId, headerData) => {
  if (!isPreferredMotion.value) {
    zIndex.value = "";
  }

  setTimeout(() => {
    if (isPreferredMotion.value) {
      zIndex.value = "";
    }
  }, 350);

  currMode.value = 1;
  detailHeaderData.value = headerData;
  flip.value = true;

  await getDetail({ contributionId, id });
};
const test2 = async (id, data) => {
  zIndex.value = "";

  subItemHeaderData.value = data;
  currMode.value = 2;
  flip.value = true;

  await getEntityDetail(id);
};
const test3 = (data) => {
  if (!isPreferredMotion.value) {
    zIndex.value = "";
  }

  setTimeout(() => {
    if (isPreferredMotion.value) {
      zIndex.value = "";
    }
  }, 350);
  currMode.value = 3;
  flip.value = true;
  detail.value = data;
};

const backtoHome = () => {
  flip.value = false;

  setTimeout(() => {
    zIndex.value = "z-[1]";
  }, 300);
};

const searchKeyword = (keyword) => {
  params.page = 1;
  params.keyword = keyword;
};

const loadMore = () => {
  params.page = params.page + 1;
};

const searchData = async () => {
  const response = await SearchEntity({
    page: params.page,
    limit: params.keyword ? 10 : 3,
    keyword:
      params.keyword ||
      data?.value?.[totalCount.value - currCount.value]?.lemma,
  });

  if (response?.statusCode) {
    if (response?.data?.entities?.length === 0) {
      noLoad.value = true;
    }

    if (params.page === 1) {
      entities.value = [...response?.data?.entities];
      searchLoading.value = false;
      loadmoreLoading.value = false;
    } else {
      entities.value = [...entities?.value, ...response?.data?.entities];
      searchLoading.value = false;
      loadmoreLoading.value = false;
    }
  }
};

const getDetail = async ({ contributionId, id }) => {
  cardDetailData.value = null;
  cardDetailLoading.value = true;
  const response = await GetScriptDetail({ contributionId, id });

  if (response.statusCode === 200) {
    cardDetailLoading.value = false;

    cardDetailData.value = response?.data;
  }
};

// const getImage = async (id) => {
//   const response = await GetScriptDetail(id);

//   if (response.statusCode === 200) {
//     img.value =
//       response?.data?.senses?.find((item) => !!item?.images?.data?.[0]?.url) ||
//       "";
//   }
// };

const getEntityDetail = async (id) => {
  entityDetailData.value = null;
  entityDetailLoading.value = true;
  const response = await GetEntityDetail(id);

  if (response.statusCode === 200) {
    entityDetailLoading.value = false;
    entityDetailData.value = response?.data;
  }
};

const getLanguages = async () => {
  const response = await GetLanguages();

  if (response.statusCode === 200) {
    console.log("response", response.data);
    languages.value = response.data;
    isLoading.value = false;
  }
};

const getProfile = async () => {
  isLoading.value = true;

  const response = await GetProfile();
  if (response?.statusCode === 200) {
    await getCardsData(
      response?.data?.languageCode,
      response?.data?.activityType
    );
  } else if (response.statusCode === 503) {
    isLoading.value = false;
    noInternet.value = true;
  } else {
    isLoading.value = false;
    isError.value = true;
  }
};

const getCardsData = async (code, type) => {
  isLoading.value = true;
  const response = await GetCards({
    languageCode: code ? code : vuex.getters["profile/language"],
    activityType: type
      ? type
      : vuex.getters["profile/activityType"]
        ? vuex.getters["profile/activityType"]
        : "script",
  });

  if (response.statusCode === 200) {
    totalCount.value = response?.data?.length;

    data.value = [...response.data.filter((item) => item.status === "pending")];
    totalData.value = [
      ...response.data.filter((item) => item.status === "pending"),
    ].length;
    currMargin.value =
      ([...response.data.filter((item) => item.status === "pending")]?.length - 1) * 0.25; // 4px -> 0.25rem

    // getImage(
    //   [...response.data.filter((item) => item.status === "pending")]?.[
    //     totalCount.value - currCount.value
    //   ]?.externalLexemeId
    // );

    await getLanguages();

    isLoading.value = false;

    disableSplash();
  } else {
    if (response.statusCode === 503) {
      isLoading.value = false;
      noInternet.value = true;
    } else {
      isLoading.value = false;
      isError.value = true;

      errorLog.value = {
        message: response?.response?.data?.message,
        code: response?.response?.status,
      };
    }
  }
};

onMounted(async () => {
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") !== "auto") {
      if (localStorage.getItem("theme") === "light") {
        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", "#EAECF0");
      } else {
        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", "#27292D");
      }
    } else {
      if (isPreferredDark.value) {
        document.documentElement.classList.add("dark");
        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", "#27292D");
      } else {
        if (document.documentElement.classList.contains("light")) {
          document.documentElement.classList.remove("light");
        } else if (document.documentElement.classList.contains("light")) {
          document.documentElement.classList.remove("dark");
        }
        document
          .querySelector('meta[name="theme-color"]')
          .setAttribute("content", "#EAECF0");
      }
    }
  } else {
    if (isPreferredDark.value) {
      document.documentElement.classList.add("dark");
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", "#27292D");
    } else {
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light");
      } else if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("dark");
      }
      document
        .querySelector('meta[name="theme-color"]')
        .setAttribute("content", "#EAECF0");
    }
  }

  if (vuex.getters["profile/language"]) {
    await getCardsData();
  } else {
    await getProfile();
  }
});

watch(
  () => [...data.value],
  (newData, oldData) => {
    // currMargin.value = currMargin.value - (count.value < 5 ? 8 : 0);

    if (newData?.length < oldData?.length) {
      currMargin.value = currMargin.value - 0.75; // 12px -> 0.75rem
    } else if (newData?.length > oldData?.length)
      currMargin.value = currMargin.value + 0.25; // 4px -> 0.25rem
  },
  { immediate: true }
);

// watch(currCount, async () => {
//   if (currCount?.value <= totalCount?.value)
//     getImage(
//       data?.value?.[totalCount.value - currCount.value]?.externalLexemeId
//     );
// });

watch([currCount, undoWarn], async () => {
  if (currCount.value > totalCount.value && !undoWarn.value) {
    endLoading.value = true;

    const response = await EndContribution();

    if (response?.statusCode === 200) {
      endLoading.value = false;
      const userInput = await completeRef?.value?.openModal();

      if (userInput) {
        router.push("/");
      }
    }

    if (response?.statusCode === 503) {
      isLoading.value = false;
      noInternet.value = true;
    }
  }
});

watch([splash, flip, currMode, entities], async () => {
  // const div = document.querySelector();

  for (let i = 1; i <= totalCount.value; i++) {
    if (currCount.value !== i && currCount.value < i) {
      const div = document?.querySelector(`.card-${i}`);
      if (div) {
        div?.setAttribute("tabindex", "-1");

        const children = div.querySelectorAll("*");
        children?.forEach((child) => {
          child.setAttribute("tabindex", "-1");
        });
      }
    } else {
      const div = document?.querySelector(`.card-${i}`);
      if (div) {
        if (!flip.value) {
          await nextTick();

          cardDisableAccessibilityConnect("inactive", div, currMode.value);

          const section = div.querySelector(".card-front");

          if (section) {
            const children = section?.querySelectorAll(".interactable");

            children?.forEach((child) => {
              if (child.className.includes("cdx-text-area")) {
                child
                  .querySelector(".cdx-text-area__textarea")
                  .setAttribute("tabindex", "");
              } else {
                child.setAttribute("tabindex", "0");
              }
            });

            nextTick(() => {
              const recBox = section?.querySelectorAll(".recommendation-box");
              console.log("asdasdasd", recBox);

              recBox?.forEach((child) => {
                child.setAttribute("tabindex", "0");
              });
            });
          }
        } else if (flip.value && currMode.value === 1) {
          await nextTick();

          cardDisableAccessibilityConnect("active", div);

          const section = div.querySelector(".card-detail");
          const children = section.querySelectorAll(".interactable");
          children?.forEach((child) => {
            child.setAttribute("tabindex", "0");
          });
        } else if (flip.value && currMode.value === 2) {
          await nextTick();

          cardDisableAccessibilityConnect("active", div);

          const section = div.querySelector(".card-item-detail");

          const children = section.querySelector(".interactable");
          children.setAttribute("tabindex", "0");
        } else if (flip.value && currMode.value === 3) {
          await nextTick();
          cardDisableAccessibilityConnect("active", div);
          const section = div.querySelector(".card-review");

          const children = section.querySelectorAll(".interactable");
          children?.forEach((child) => {
            child.setAttribute("tabindex", "0");
          });
        }
      }
    }
  }
});

const submitCardAnim = (condition) => {
  if (condition) {
    if (!isPreferredMotion.value) {
      if (dir.value === "rtl") {
        return "submit-card-rtl";
      } else {
        return "submit-card";
      }
    } else {
      if (isSkipButton.value) {
        return "card-fade";
      } else {
        if (dir.value === "rtl") {
          return "submit-card-rtl";
        } else {
          return "submit-card";
        }
      }
    }
  } else {
    return "";
  }
};

const skipAllAnim = () => {
  if (skipAll.value) {
    if (!isPreferredMotion.value) {
      if (dir.value === "rtl") {
        return "skipall-rtl";
      } else {
        return "skipall";
      }
    } else {
      return "card-fade";
    }
  } else {
    return "";
  }
};

const skipCardAnim = (condition) => {
  console.log("yes");

  if (condition) {
    if (!isPreferredMotion.value) {
      if (dir.value === "rtl") {
        return "next-card-rtl";
      } else {
        return "next-card";
      }
    } else {
      if (isSkipButton.value) {
        return "card-fade";
      } else {
        if (dir.value === "rtl") {
          return "next-card-rtl";
        } else {
          return "next-card";
        }
      }
    }
  } else {
    return "";
  }
};

const undoCardAnim = (condition) => {
  if (condition) {
    if (isPreferredMotion) {
      return "card-fade-in";
    } else {
      if (dir.value === "rtl") {
        return "prev-card-rtl";
      } else {
        return "prev-card";
      }
    }
  } else {
    return "";
  }
};

const animClass = (index) => {
  return [
    data?.value?.length === index + 1 && flip.value ? "is-flipped" : "",
    skipCardAnim(data?.value?.length === index + 1 && next.value),
    undoCardAnim(data?.value?.length === index + 1 && prev.value),
    submitCardAnim(data?.value?.length === index + 1 && submit.value),
    `card-${totalCount.value - index}`,
  ];
};
</script>

<template>
  <div class="session-container w-full flex flex-col relative">
    <div
      class="max-[639px]:h-[3.375rem] h-[4rem] w-full left-0 flex items-center top-0 py-[0.2500rem] px-[0.2500rem] min-[640px]:px-[1.25rem] shrink-0 justify-center">
      <div class="max-w-[920px] w-full h-full flex items-center relative">
        <CdxButton :aria-label="t('aria.backToHome')" v-tooltip:bottom-start="t('tooltips.home')" weight="quiet"
          class="w-[2.75rem] h-[2.75rem] px-0 absolute left-[0.1875rem] rtl:right-[0.1875rem]" @click="endEarly">
          <CdxIcon :icon="cdxIconHome" alt="home" />
        </CdxButton>
        <div class="absolute mx-auto left-0 right-0 w-fit">
          <CdxLabel v-if="data?.length !== 0 && !isLoading" class="text-[1rem] pb-0">{{ t("session.title") }} {{
            currCount }}</CdxLabel>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && noInternet" class="relative custom-height flex justify-center">
      <div class="w-full text-center max-w-[56rem] absolute top-[40%] px-[1rem]">
        <div class="w-full flex justify-center pb-[1rem]">
          <img v-if="!isThemeDark" :src="error" alt="home" />
          <img v-if="isThemeDark" :src="errordark" alt="home" />
        </div>
        <CdxLabel class="text-[1rem] p-0">{{
          t("session.noInternet.title")
        }}</CdxLabel>
        <p class="text-[1rem] pb-[1rem]">
          {{ t("session.noInternet.description") }}
        </p>
        <CdxButton weight="primary" action="progressive" class="w-full max-w-[28rem] h-[2.75rem]" @click="reload">{{
          t("session.noInternet.button") }}</CdxButton>
      </div>
    </div>

    <div v-if="!isLoading && isError && errorLog?.message !== 'Lexemes not found.'"
      class="relative custom-height flex justify-center">
      <div class="w-full text-center max-w-[56rem] absolute top-[40%] px-[1rem]">
        <div class="w-full flex justify-center pb-[1rem]">
          <img :src="sad" alt="home" />
        </div>
        <CdxLabel class="text-[1rem] p-0">{{
          t("session.error.title")
        }}</CdxLabel>
        <p class="text-[1rem] pb-[1rem]">
          {{ t("session.error.description") }}
        </p>

        <p class="text-[0.8750rem] pb-[1rem]" style="font-family: var(--font-family-monospace)">
          {{ errorLog?.code || "" }} {{ errorLog?.message || "" }}
        </p>

        <CdxButton weight="primary" action="progressive" class="w-full max-w-[28rem] h-[2.75rem]" @click="
          () => {
            getProfile();
            isError = false;
          }
        ">{{ t("session.error.button") }}</CdxButton>
      </div>
    </div>

    <div v-if="
      totalCount === 0 &&
      !isLoading &&
      isError &&
      errorLog?.message === 'Lexemes not found.'
    " class="relative custom-height flex justify-center">
      <div class="w-full text-center max-w-[56rem] absolute top-[40%] px-[1rem]">
        <div class="w-full flex justify-center pb-[1rem]">
          <img :src="happy" alt="happy" />
        </div>

        <CdxLabel class="text-[1rem] px-0 pb-[1rem]">{{
          t("session.blank.title")
        }}</CdxLabel>

        <CdxButton :aria-label="t('aria.backToHome')" weight="primary" action="progressive"
          class="w-full max-w-[28rem] h-[2.75rem]" @click="router.push('/')">{{ t("session.blank.button") }}</CdxButton>
      </div>
    </div>

    <div v-if="isLoading && !isError && !noInternet" class="relative custom-height flex justify-center px-[1rem]">
      <div class="w-full text-center absolute top-[50%] px-[1rem]">
        <Loading :text="t('session.loading')" variant="big" />
      </div>
    </div>
    <div v-else-if="!isLoading && !isError && !noInternet"
      class="w-full flex justify-center items-center pb-[3.875rem] h-full" :style="{
        backgroundImage: `url(${isThemeDark ? blankdark : blank})`,
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
      }">
      <div :class="[skipAllAnim(), 'px-[1rem] w-full']">
        <div class="flex justify-center w-full relative custom-height items-center z-[2]" :style="{
          marginTop: currMargin + 'rem',
          perspective: '1000px',
        }">
          <Card :key="value" :isFlipped="flip" v-for="(value, index) in data" :style="{
            marginTop: -12 * index + 1 + 'px',
            ...(prev && { transition: 'unset !important' }),
            ...(!isMove && { transition: 'transform 0.5s ease-out' }),
            ...(springBack && { transition: 'transform 0.35s' }),

            // transition: !isMove
            //   ? ''
            //   : springBack
            //   ? 'transform 0.35s'
            //   : 'transform 0.5s ease-out',
            transformStyle: 'preserve-3d',
            zIndex: '2',
            display:
              data?.length === 5 && index < 2
                ? 'none'
                : data?.length === 4 && index === 0
                  ? 'none'
                  : 'block',
          }" @hideCard="nextCard(false, value?.id, value?.contributionId)" @onStarting="aa" @onEnd="ab"
            :headerRef="cardRef" :preventSwipe="undoWarn" :class="[...animClass(index)]">
            <transition name="fade">
              <CardSplash :class="[
                data?.length !== index + 1
                  ? 'bg-white dark:bg-[#101418]'
                  : 'bg-[#FFA758]',
                'custom-height z-[1] text-[#361D13] rounded-[1rem] max-h-[640px]',
              ]" :data="value" v-if="splash === true || data?.length !== index + 1" :key="0" :currCount="currCount"
                :isNotCurrent="data?.length !== index + 1" :currLang="value?.language?.title"></CardSplash>
            </transition>

            <transition name="fade">
              <CardSuccess v-if="isSuccess && data?.length === index + 1"
                :class="[submit ? 'front' : 'back', 'max-h-[640px] z-[100]']">
              </CardSuccess>
            </transition>

            <transition name="fade">
              <CardSubmitFailed class="custom-height rounded-[1rem] back max-h-[640px] h-full"
                v-if="isSubmitError === true" :key="0" @back="isSubmitError = false"></CardSubmitFailed>
            </transition>

            <transition name="fade">
              <CardSubmitting class="custom-height rounded-[1rem] back max-h-[640px] h-full"
                v-if="submittingData === true" :submitAction="'add'" :key="0"></CardSubmitting>
            </transition>

            <div :class="[
              zIndex,
              'front absolute top-0 h-full w-full',
              isPreferredMotion && flip ? 'card-fade' : '',
            ]">
              <CardItem :key="0" :recommendation="entities" :data="value" :keyword="params.keyword"
                :searchLoading="searchLoading" :recommendedLoading="recommendedLoading"
                :loadmoreLoading="loadmoreLoading" :noLoadData="noLoad" :currCount="currCount" class="card-front"
                @gotoDetail="
                  test1(value?.id, value?.contributionId, {
                    category: value?.category,
                    lemma: value?.lemma,
                    gloss: value?.gloss,
                    id: value?.externalLexemeId,
                  })
                  " @gotoSubItemDetail="(value) => test2(value?.id, value)" @gotoReview="test3"
                @setSearch="searchKeyword" @loadMore="loadMore" />
            </div>

            <div :class="[
              'back absolute top-0 left-0 h-full w-full rounded-[1rem]',
              isPreferredMotion && !flip ? 'card-fade' : '',
            ]">
              <CardItemDetail v-if="currMode === 1" :isLoading="cardDetailLoading" :data="cardDetailData ?? {}"
                :headerData="detailHeaderData" :languages="languages" class="card-detail"
                :currLang="value?.language?.title" @backtoItem="backtoHome" @showImage="
                  (data) => {
                    shownImage = data;
                  }
                " />
              <CardSubItemDetail :data="entityDetailData" class="card-item-detail" :isLoading="entityDetailLoading"
                :headerData="subItemHeaderData" v-else-if="currMode === 2" @backtoItem="backtoHome" />

              <CardReview class="card-review" :data="value" :detail="detail" :img="value?.image"
                v-else-if="currMode === 3" :currLang="value?.language?.title" @backtoItem="backtoHome" @onDone="
                  (data) => {
                    submitCard(data, value?.contributionId, value?.id);
                  }
                " />
            </div>
          </Card>
        </div>
      </div>

      <Transition name="undo" mode="out-in">
        <div :key="undoWarn" v-if="undoWarn" :class="[
          'absolute bottom-[0.5rem] flex justify-center w-full left-[0] z-[3]',
        ]">
          <div
            class="w-full max-w-[448px] min-w-[18rem] bg-[var(--background-color-base)] relative mx-[0.5rem] rounded-[0.1250rem]"
            style="box-shadow: var(--box-shadow-large)">
            <v-progress-linear v-if="!isPreferredMotion" v-model="progress.number" color="#3366CC"
              class="absolute rounded-t-[0.1250rem]"></v-progress-linear>
            <div class="skip-button p-[1rem] text-[var(--color-base)] flex items-center justify-between">
              <p>{{ t("session.skip.title") }}</p>
              <CdxButton weight="quiet" :class="[
                'flex gap-x-2 items-center cursor-pointer  skip',
              ]" @click="undoCard">
                <CdxIcon class="text-[var(--color-base)]" :icon="cdxIconUndo" alt="undo" />
                <p style="padding-bottom: 0px" class="text-[1rem] font-[700] text-[var(--color-base)]">
                  {{ t("session.skip.button") }}
                </p>
              </CdxButton>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div v-if="!isLoading && !isError && !noInternet"
      class="flex bottom-0 w-full p-[0.8750rem] justify-center left-0 z-[1] absolute">
      <div class="flex max-w-[448px] gap-x-[0.75rem] w-full">
        <CdxButton weight="quiet" class="h-[2.125rem] w-full" @click="
          nextCard(
            true,
            data?.find((item) => {
              return item.order === totalCount + 1 - currCount;
            })?.id,
            data?.find((item) => {
              return item.order === totalCount + 1 - currCount;
            })?.contributionId
          )
          " :disabled="undoWarn || submittingData || data?.length === 0 || currCount > 5
            ">
          <SkipIcon v-if="!isThemeDark" :class="dir === 'rtl' ? 'rotate-180' : 'rotate-0'" :color="undoWarn || submittingData || data?.length === 0 || currCount > 5
            ? '#72777d'
            : '#202122'
            " />
          <SkipDarkIcon v-if="isThemeDark" :class="dir === 'rtl' ? 'rotate-180' : 'rotate-0'" :color="undoWarn || submittingData || data?.length === 0 || currCount > 5
            ? '#72777d'
            : '#EAECF0'
            " />

          <span class="text-[1rem] pb-0">{{ t("session.button1") }}</span>
        </CdxButton>
        <CdxButton weight="quiet" class="h-[2.125rem] w-full" @click="endEarly"
          :disabled="currCount === 1 || submittingData || data?.length === 0">
          <CdxIcon :icon="cdxIconSuccess" alt="home" />
          <span class="text-[1rem] pb-0">{{ t("session.button2") }}</span>
        </CdxButton>
      </div>
    </div>

    <WarningDialog class="session" :count="currCount - 1" ref="testing" :loading="endLoading" />
    <CompleteDialog class="session" ref="completeRef" />

    <transition name="fadebox">
      <Lightbox v-if="Boolean(shownImage)" @close="shownImage = ''" :img="shownImage" class="z-[999]">
      </Lightbox>
    </transition>
  </div>
</template>

<style lang="scss">
[dir] .skip-button .cdx-button:enabled.cdx-button--weight-quiet:hover {
  mix-blend-mode: normal !important;
}

.session-container {
  height: 100%;
  min-height: stretch;
}

.front,
.back {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.fadebox-enter-active,
.fadebox-leave-active {
  transition: opacity 250ms ease-out;
}

.fadebox-enter-from,
.fadebox-leave-to

/* .fade-leave-active in <2.1.8 */
  {
  opacity: 0;
}

.back {
  transform: rotateY(-180deg);
}

.is-flipped {
  transform: rotateY(-180deg);
}

.undo-enter-active {
  transition: all 0.5s;
}

.undo-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.undo-enter-from,
.undo-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-height: 400px) {
  .custom-height {
    height: 58vh;
  }
}

@media (max-height: 460px) and (min-height: 400px) {
  .custom-height {
    height: 68vh;
  }
}

@media (max-height: 676px) and (min-height: 460px) {
  .custom-height {
    height: 70vh;
  }
}

@media (max-height: 701px) and (min-height: 676px) {
  .custom-height {
    height: 75vh;
  }
}

@media (max-height: 916px) and (min-height: 701px) {
  .custom-height {
    height: 75vh;
  }
}

@media (min-height: 916px) {
  .custom-height {
    height: 85vh;
  }
}

.v-progress-linear {
  transition-duration: 0ms !important;
}

.skipall {
  animation: swipeCardRight 1125ms;
  transform: translateX(125rem);
}

.skipall-rtl {
  animation: swipeCardLeft 1125ms;
  transform: translateX(-125rem);
}

@keyframes swipeCardRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  80% {
    opacity: 0;
  }

  100% {
    transform: translateX(125rem);
    opacity: 0;
  }
}

@keyframes swipeCardLeft {
  0% {
    transform: translateX(0) rotate(0);
    opacity: 1;
  }

  30% {
    opacity: 1;
  }

  80% {
    opacity: 0;
  }

  100% {
    transform: translateX(-125rem) rotate(-2deg);
    opacity: 0;
  }
}


html.reduced-motion {
  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      // display: none;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
      // display: none;
    }
  }

  .back {
    transform: none !important;
  }

  .card-fade {
    animation: fadeOut 250ms ease-out forwards !important;
  }

  .card-fade-in {
    animation: fadeIn 250ms ease-out forwards !important;
  }

  .is-flipped {
    transform: none !important;
  }

  .undo-enter-active,
  .undo-leave-active {
    transform: none !important;
    transition: opacity 0.5s !important;
  }

  .undo-enter-from,
  .undo-leave-to {
    opacity: 0 !important;
  }
}

html.reduced-motion {
  @keyframes fadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
      // display: none;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
      // display: none;
    }
  }

  .back {
    transform: none !important;
  }

  .card-fade {
    animation: fadeOut 250ms ease-out forwards !important;
  }

  .card-fade-in {
    animation: fadeIn 250ms ease-out forwards !important;
  }

  .is-flipped {
    transform: none !important;
  }

  .undo-enter-active,
  .undo-leave-active {
    transform: none !important;
    transition: opacity 0.5s !important;
  }

  .undo-enter-from,
  .undo-leave-to {
    opacity: 0 !important;
  }
}
</style>
