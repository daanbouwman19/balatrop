<script setup>
import ScoreBar from "./components/score-bar/ScoreBar.vue";
import RotateDevice from "./components/RotateDevice.vue";
import CurrentMoney from "./components/CurrentMoney.vue";
import { GameActive } from "./components/canvas/GameActive";
import { computed, ref, onMounted } from "vue";

const width = ref(window.innerWidth);
const orientation = ref(window.screen.orientation?.type || "portrait");

const updateWidth = () => {
  width.value = window.innerWidth;
};
const updateOrientation = () => {
  orientation.value = window.screen.orientation?.type || "portrait";
};

const rotateDevice = computed(() => {
  return orientation.value === "portrait" || width.value <= 600;
});

window.addEventListener("resize", updateWidth);
window.addEventListener("orientationchange", updateOrientation);

const canvas = ref(null);
const isMounted = ref(false);

const game = ref(null);

// GAME INITIALIZATION

onMounted(() => {
  console.log(canvas.value);
  if (!canvas.value) {
    canvas.value = document.querySelector("canvas");
  }

  game.value = new GameActive(canvas.value);

  loop();

  isMounted.value = true;
});

// GAME LOOP

const loop = () => {
  if (game.value) {
    game.value.update();
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
    <ScoreBar
      v-if="game"
      :is-mounted="isMounted"
      :game="game"
    />
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
      v-if="isMounted"
      class="fixed top-1 right-1"
      :game="game"
    />
  </div>
  <div v-else>
    <RotateDevice />
  </div>
</template>
