<script setup>
import { ref, onMounted, nextTick, toRaw } from "vue";

const containerRef = ref(null);
const itemsRef = ref([]);

const scrollToItem = (index) => {
  const container = containerRef.value;
  const itemPrev = itemsRef.value[index - 1];
  const item = itemsRef.value[index];

  if (container && item) {
    container.scrollLeft = container.scrollLeft + 75;
  }
};

const scrollPrev = () => {
  const container = containerRef.value;
  const currentIndex = itemsRef.value.findIndex(
    (item) => item.offsetLeft >= container.scrollLeft
  );
  let targetIndex = currentIndex - 1;
  if (targetIndex < 0) {
    targetIndex = 0;
  }
  scrollToItem(targetIndex);
};

const scrollNext = () => {
  const container = containerRef.value;

  // Find the current index by checking the position of the first visible item
  const currentIndex = itemsRef.value.findIndex((item) => {
    return item.offsetLeft >= container.scrollLeft;
  });

  console.log(toRaw(itemsRef.value));

  for (let i = 0; i < itemsRef.value.length; i++) {
    console.log(itemsRef.value[i].offsetWidth);
  }

  // Calculate the target index by moving forward by 2 items
  let targetIndex = currentIndex + 1;
  console.log("setttt", currentIndex);

  // Ensure that the target index does not go beyond the last item
  if (targetIndex >= itemsRef.value.length) {
    targetIndex = itemsRef.value.length - 1;
  }

  // Scroll to the target item
  scrollToItem(targetIndex);
};

onMounted(() => {
  // Ensure itemsRef is populated with the correct elements
  itemsRef.value = Array.from(containerRef.value.querySelectorAll(".item"));
});
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div class="min-w-[500px] relative" style="white-space: nowrap">
      <div
        class="border-r-[2px] h-[100px] border-[green] absolute left-[50%] top-[0px]"
      ></div>
      <div
        class="flex gap-x-4 x mandatory-scroll-snapping"
        id="content"
        ref="containerRef"
      >
        <div
          v-for="(slide, index) in [
            'a',
            '',
            'd',
            '',
            'i',
            '',
            'k',
            '',
            'a',
            '',
            'r',
            '',
            'y',
            '',
            'a',
          ]"
          class="bg-red text-[96px] item"
          :style="{
            scrollSnapAlign: slide % 2 === 0 ? 'start' : 'unset',
            flex: 'none',
          }"
          :key="index"
        >
          <span v-if="slide">{{ slide }}</span>
          <div v-else class="border-r-[2px] h-[100px] border-[black]"></div>
        </div>
      </div>
    </div>
  </div>
  <button @click="scrollPrev">Prev</button>
  <button @click="scrollNext">Next</button>
</template>

<style>
.x.mandatory-scroll-snapping {
  scroll-snap-type: x mandatory;
  scroll-padding-left: 50%;
  padding-left: 50%;
  padding-right: 50%;
  scroll-behavior: smooth;
}
.x {
  flex-flow: row nowrap;
  overflow-y: hidden;
  width: 100%;
  height: 128px;
}
</style>
