<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  readonly,
  ref,
  toRaw,
} from "vue";
import interact from "interactjs";

const props = defineProps({
  next: Boolean,
  preventSwipe: Boolean,
  isFlipped: Boolean,
});

const cardRef = ref(null);
const count = ref(5);

const emit = defineEmits(["hideCard, onStarting, onEnd, onSkip, "]);

const statics = readonly({
  interactMaxRotation: 2,
  interactOutOfSightXCoordinate: 500,
  interactOutOfSightYCoordinate: -825,
  interactYThreshold: -30,
  interactXThreshold: 100,
});

const positions = reactive({
  isShowing: true,
  isInteractAnimating: true,
  isInteractDragged: null,
  interactPosition: {
    x: 0,
    y: 0,
    rotation: 0,
  },
});

const transformString = computed(() => {
  if (!positions.isInteractAnimating || positions.isInteractDragged) {
    const { x, y, rotation } = positions.interactPosition;
    // return `translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
    return `translate3D(0, ${y}px, 0) rotate(${rotation}deg) ${
      props.isFlipped ? "rotateY(-180deg)" : ""
    }`;
  }

  return null;
});

const interactSetPosition = (coordinates) => {
  const { x = 0, y = 0, rotation = 0 } = coordinates;
  positions.interactPosition = { x, y, rotation };
};

const interactUnsetElement = () => {
  interact(cardRef.value).unset();
  positions.isInteractDragged = true;
};

const resetCardPosition = () => {
  interactSetPosition({ x: 0, y: 0, rotation: 0 });
};

const hideCard = () => {
  setTimeout(() => {
    positions.isShowing = false;
    emit("hideCard");
  }, 300);
};

const playCard = (interaction) => {
  const {
    interactOutOfSightXCoordinate,
    interactOutOfSightYCoordinate,
    interactMaxRotation,
  } = statics;

  interactUnsetElement();

  switch (interaction) {
    case "SKIP_CARD":
      interactSetPosition({
        y: interactOutOfSightYCoordinate,
      });
      emit("onSkip");
      break;
  }

  hideCard();
};

onBeforeUnmount(() => {
  interact(cardRef.value).unset();
});

onMounted(() => {
  const element = cardRef.value;

  interact(toRaw(element)).draggable({
    allowFrom: ".header",
    // ignoreFrom: ".header",

    onstart: () => {
      positions.isInteractAnimating = false;
      emit("onStarting");
    },

    onmove: (event) => {
      const { interactMaxRotation, interactXThreshold } = statics;
      const x = positions.interactPosition.x + event.dx;
      let y = positions.interactPosition.y + event.dy;

      if (y > 0) {
        y = y / 1.35; // Do nothing if trying to move downward
      }

      let rotation = interactMaxRotation * (x / interactXThreshold);

      if (rotation > interactMaxRotation) rotation = interactMaxRotation;
      else if (rotation < -interactMaxRotation) rotation = -interactMaxRotation;

      interactSetPosition({ x, y, rotation });
    },

    onend: () => {
      const { x, y } = positions.interactPosition;
      const { interactXThreshold, interactYThreshold } = statics;
      positions.isInteractAnimating = true;
      emit("onEnd");

      if (!props.preventSwipe && y < interactYThreshold) playCard("SKIP_CARD");
      else {
        resetCardPosition();
      }
    },
  });
});
</script>

<template>
  <div
    :style="{
      transform: transformString,
      display: positions.isShowing ? 'block' : 'none',
      touchAction: 'none',
    }"
    ref="cardRef"
    :class="[
      'absolute bg-white rounded-[16px] w-full h-full max-h-[650px] min-w-[288px] max-w-[450px] minwidth border border-[#C8CCD1] dark:border-[#54595D] z-[5]',
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.minwidth {
  min-height: 415px;
}

@media (max-height: 567px) {
  .minwidth {
    min-height: unset;
  }
}

.shadow-custom {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
}

.next-card {
  animation: swipeCardUp 0.4s;
}

.prev-card {
  transition: unset !important;
  animation: swipeCardDown 0.5s !important;
}

.submit-card {
  animation: swipeCardRight 0.4s;
}

@keyframes swipeCardUp {
  0% {
    transform: translateY(0) rotate(0);
    opacity: 1;
  }
  30% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(-825px) rotate(2deg);
    opacity: 0;
  }
}

@keyframes swipeCardDown {
  0% {
    transform: translateY(-825px) rotate(2deg);
    opacity: 0;
  }
  30% {
    opacity: 0;
  }

  80% {
    opacity: 1;
  }
  100% {
    transform: translateY(0) rotate(0);
    opacity: 1;
  }
}

@keyframes swipeCardRight {
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
    transform: translateX(5000px) rotate(2deg);
    opacity: 0;
  }
}
</style>
