import { ref, onMounted, onBeforeUnmount } from "vue";

export function useDirWatcher() {
  const dir = ref(document.documentElement.getAttribute("dir") || "ltr");
  let observer = null;

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

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    dir,
  };
}
