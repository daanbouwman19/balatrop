<script setup lang="ts">
import { ref, onMounted } from "vue";
import { GameActive } from "./GameActive";

const canvasRef = ref<HTMLCanvasElement | null>(null);

let gameA: GameActive | null = null;

// GAME INITIALIZATION

onMounted(() => {
  const canvas = canvasRef.value;

  if (canvas) {
    gameA = new GameActive(canvas);
  }

  requestAnimationFrame(loop);
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

  if (gameA) {
    gameA.update(dtFactor);
    gameA.draw();
  }

  requestAnimationFrame(loop);
};
</script>

<template>
  <div
    class="h-full w-full border-solid border-[3vh] border-score-board-background"
  >
    <div class="h-full bg-score-board-background">
      <canvas
        ref="canvasRef"
        class="bg-[url('../../public/images/pixel_background.jpg')] bg-cover h-full w-full border-solid border-[10px] rounded-lg"
      />
    </div>
  </div>
</template>
