// composables/useHtmlHasClass.js
import { ref, onMounted, onBeforeUnmount } from "vue";

export function useHtmlHasClass(targetClass = "reduce") {
  const hasClass = ref(false);
  let observer = null;

  const updateClassState = () => {
    hasClass.value = document.documentElement.classList.contains(targetClass);
  };

  const observeHtmlClass = () => {
    observer = new MutationObserver(() => {
      updateClassState();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  };

  onMounted(() => {
    updateClassState();
    observeHtmlClass();
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    hasClass,
    updateClassState,
  };
}
