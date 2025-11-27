<script setup lang="ts">
import ScoreBar from "./components/score-bar/ScoreBar.vue";
import RotateDevice from "./components/RotateDevice.vue";
import CurrentMoney from "./components/CurrentMoney.vue";
import { GameActive } from "./components/canvas/GameActive";
import { computed, ref, onMounted, onUnmounted } from "vue";

const width = ref(window.innerWidth);
const orientation = ref(window.screen.orientation?.type || "portrait");

const updateWidth = () => {
  width.value = window.innerWidth;
};
const updateOrientation = () => {
  orientation.value = window.screen.orientation?.type || "portrait";
};

const rotateDevice = computed(() => {
  return orientation.value.includes("portrait") || width.value <= 600;
});

const canvas = ref<HTMLCanvasElement | null>(null);
const isMounted = ref(false);

const game = ref<GameActive | null>(null);

// GAME INITIALIZATION

onMounted(() => {
  window.addEventListener("resize", updateWidth);
  window.addEventListener("orientationchange", updateOrientation);

  if (!canvas.value) {
    canvas.value = document.querySelector("canvas");
  }

  if (canvas.value) {
    game.value = new GameActive(canvas.value);
  }

  requestAnimationFrame(loop);

  isMounted.value = true;
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
  window.removeEventListener("orientationchange", updateOrientation);
});

// GAME LOOP

let lastTime = 0;
const loop = (timestamp: number) => {
  if (!lastTime) lastTime = timestamp;
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  // 60Hz target: 1000ms / 60frames ≈ 16.666ms per frame
  // dtFactor = 1 means we are running at 60Hz
  const dtFactor = deltaTime / (1000 / 60);

  if (game.value) {
    game.value.update(dtFactor);
    game.value.draw();
  }

  requestAnimationFrame(loop);
};
</script>
<template>
  <div
    v-if="!rotateDevice"
    class="flex flex-row justify-between items-center w-[100vw] h-[100vh]"
  >
    <ScoreBar v-if="game" :is-mounted="isMounted" :game="game" />
    <div
      class="h-full w-full border-solid border-[6vh] border-score-board-background"
    >
      <div class="h-full bg-score-board-background">
        <canvas
          ref="canvas"
          class="bg-[url('/images/pixel_background.jpg')] bg-cover h-full w-full border-solid border-[20px] rounded-lg"
        />
      </div>
    </div>
    <CurrentMoney
      v-if="isMounted && game"
      class="fixed top-1 right-1"
      :game="game"
    />
  </div>
  <div v-else>
    <RotateDevice />
  </div>
</template>
