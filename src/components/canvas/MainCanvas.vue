<script setup>
import { ref, onMounted } from "vue";
import Game from "../../game.js";
import { GameActive } from "./GameActive.js";

defineProps({
  game: {
    type: Game,
    required: true,
  },
});

const canvasRef = ref(null);

let gameA = null;

// GAME INITIALIZATION

onMounted(() => {
  const canvas = canvasRef.value;

  gameA = new GameActive(canvas);

  loop();
});

// GAME LOOP

const loop = () => {
  if (gameA) {
    gameA.update();
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
