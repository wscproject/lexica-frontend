<script setup>
import { ref, onMounted, nextTick } from "vue";

const containerRef = ref(null);
const itemsRef = ref([]);

const scrollToItem = (index) => {
  const container = containerRef.value;
  const item = itemsRef.value[index];

  console.log("set", index);

  if (container && item) {
    container.scrollTo({
      left: item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2,
      behavior: "smooth",
    });
  }
};

const scrollPrev = () => {
  const container = containerRef.value;
  const currentIndex = itemsRef.value.findIndex(
    (item) => item.offsetLeft >= container.scrollLeft
  );
  let targetIndex = currentIndex - 2;
  if (targetIndex < 0) {
    targetIndex = 0;
  }
  scrollToItem(targetIndex);
};

const scrollNext = () => {
  const content = document.getElementById("content");

  setTimeout(() => {
    content.scrollLeft = 200;
    console.log(content.scrollWidth, content.clientWidth);
  }, 100);
};

onMounted(() => {
  // Ensure itemsRef is populated with the correct elements
  itemsRef.value = Array.from(containerRef.value.querySelectorAll(".item"));
});
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div
      class="min-w-[500px] overflow relative"
      id="content"
      ref="containerRef"
      style="white-space: nowrap"
    >
      <div
        class="border-r-[2px] h-[100px] border-[green] absolute left-[50%] top-[0px]"
      ></div>
      <div class="flex gap-x-4 x mandatory-scroll-snapping">
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
}
.x {
  flex-flow: row nowrap;
  overflow-y: hidden;
  width: 100%;
  height: 128px;
}
</style>
