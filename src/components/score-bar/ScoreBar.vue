<script setup lang="ts">
import EnemyStats from "./enemy/EnemyStats.vue";
import EnemyHeader from "./enemy/EnemyHeader.vue";
import CurrentScore from "./current-round/CurrentScore.vue";
import HandInformation from "./current-round/HandInformation.vue";

import type { GameState } from "@/game/GameState";

defineProps<{
  isMounted: boolean;
  game: GameState;
}>();
</script>

<template>
  <div v-if="isMounted" class="h-full text-text-color overflow-visible relative">
    <div
      class="w-32 h-32 bg-[navy] rounded-full border-background border-4 absolute top-4 left-1/2 -translate-x-1/2 shadow-2xl z-10"
    />
    <div
      class="h-full w-52 bg-score-board-background flex flex-col flex-1 justify-center shadow-inner gap"
    >
      <EnemyHeader class="mx-auto w-[90%] p-1" :game="game" />
      <EnemyStats :game="game" class="w-[90%]" />
      <CurrentScore :game="game" />
      <HandInformation :game="game" />
    </div>
  </div>
</template>

<style scoped>
@media (min-height: 600px) {
  .gap {
    gap: 1rem;
  }
}
</style>
