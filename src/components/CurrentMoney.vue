<script setup lang="ts">
import CoinIcon from "../components/icons/CoinIcon.vue";
import type { GameState } from "../game/GameState";

defineProps<{
  game: GameState;
}>();
</script>

<template>
  <div
    class="bg-score-board-background border-4 border-score-board-border p-4 rounded-lg shadow-lg flex items-center gap-2"
  >
    <CoinIcon class="w-8 h-8" />
    <span class="text-2xl font-bold text-white font-mono">{{
      game.score
    }}</span>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px black;
}
</style>
