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

/**
 * Generates CSS transform string for card positioning and animations
 * @see {@link ./DOCS.md#transformString} For detailed documentation
 */
const transformString = computed(() => {
  if (!positions.isInteractAnimating || positions.isInteractDragged) {
    const { x, y, rotation } = positions.interactPosition;
    // return `translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
    return `translate3D(0, ${y}px, 0) rotate(${rotation}deg) ${props.isFlipped ? "rotateY(-180deg)" : ""
      }`;
  }

  return null;
});

/**
 * Sets the card's position and rotation coordinates
 * @param {Object} coordinates - Position data with x, y, rotation properties
 * @see {@link ./DOCS.md#interactSetPosition} For detailed documentation
 */
const interactSetPosition = (coordinates) => {
  const { x = 0, y = 0, rotation = 0 } = coordinates;
  positions.interactPosition = { x, y, rotation };
};

/**
 * Disables further drag interactions and marks card as dragged
 * @see {@link ./DOCS.md#interactUnsetElement} For detailed documentation
 */
const interactUnsetElement = () => {
  interact(cardRef.value).unset();
  positions.isInteractDragged = true;
};

/**
 * Resets card to center position for spring-back effect
 * @see {@link ./DOCS.md#resetCardPosition} For detailed documentation
 */
const resetCardPosition = () => {
  interactSetPosition({ x: 0, y: 0, rotation: 0 });
};

/**
 * Initiates card removal sequence with 300ms delay
 * @see {@link ./DOCS.md#hideCard} For detailed documentation
 */
const hideCard = () => {
  setTimeout(() => {
    positions.isShowing = false;
    emit("hideCard");
  }, 300);
};

/**
 * Executes card exit animations based on interaction type
 * @param {String} interaction - Animation type ("SKIP_CARD")
 * @see {@link ./DOCS.md#playCard} For detailed documentation
 */
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

/**
 * Cleanup Interact.js listeners to prevent memory leaks
 * @see {@link ./DOCS.md#onBeforeUnmount} For detailed documentation
 */
onBeforeUnmount(() => {
  interact(cardRef.value).unset();
});

/**
 * Initializes Interact.js drag system with gesture recognition
 * @see {@link ./DOCS.md#onMounted} For detailed documentation
 */
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
  <div :style="{
    transform: transformString,
    display: positions.isShowing ? 'block' : 'none',
    touchAction: 'none',
  }" ref="cardRef" :class="[
    'absolute bg-[var(--background-color-base)] rounded-[1rem] w-full h-full max-h-[640px] min-w-[18rem] max-w-[448px] minwidth border border-[#C8CCD1] dark:border-[#54595D] z-[5] shadow-custom',
  ]">
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
  /* box-shadow: 0 0 0 1px #c8ccd1; */
  box-shadow: var(--box-shadow-medium);
}

.next-card {
  animation: swipeCardUp 0.4s;
}

.next-card-rtl {
  animation: swipeCardUpRTL 0.4s;
}

.prev-card {
  transition: unset !important;
  animation: swipeCardDown 0.5s !important;
}

.prev-card-rtl {
  transition: unset !important;
  animation: swipeCardDownRTL 0.5s !important;
}

.submit-card {
  animation: swipeCardRight 1125ms;
}

.submit-card-rtl {
  animation: swipeCardLeft 1125ms;
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

@keyframes swipeCardUpRTL {
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
    transform: translateY(-825px) rotate(-2deg);
    opacity: 0;
  }
}

@keyframes swipeCardDownRTL {
  0% {
    transform: translateY(-825px) rotate(-2deg);
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
    transform: translateX(125rem) rotate(2deg);
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
</style>
