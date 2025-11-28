<script setup lang="ts">
import { computed } from "vue";
import type { GameState } from "@/game/GameState";

const props = defineProps<{
  game: GameState;
}>();

const currentHandScore = computed(() => {
  return props.game.currentMultiplier * props.game.currentDamage;
});
</script>

<template>
  <div
    class="bg-score-board-background-dark flex flex-col content-center items-center text-xl"
  >
    <span class="p-1">{{ currentHandScore }}</span>
    <div class="flex flex-row content-center items-center">
      <div>
        <span class="text-white">{{ game.currentDamage }}</span>
      </div>
      <span class="text-score-board-current-multi-background px-4">X</span>
      <div>
        <span class="text-white">{{ game.currentMultiplier }}</span>
      </div>
    </div>
  </div>
</template>
