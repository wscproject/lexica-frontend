import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * Vue composable that watches for changes to the document's dir attribute
 * @returns {Object} Object containing reactive dir value
 * @description Monitors the HTML document's dir attribute for RTL/LTR text direction changes
 * and provides a reactive reference that updates automatically when the direction changes
 */
export function useDirWatcher() {
  const dir = ref(document.documentElement.getAttribute("dir") || "ltr");
  let observer = null;

  /**
   * Sets up MutationObserver to watch for dir attribute changes
   * @description Creates observer that listens for changes to the dir attribute on document element
   */
  onMounted(() => {
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "dir") {
          dir.value = document.documentElement.getAttribute("dir");
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
  });

  /**
   * Cleanup function that disconnects the MutationObserver
   * @description Prevents memory leaks by disconnecting observer before component unmount
   */
  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    dir,
  };
}
