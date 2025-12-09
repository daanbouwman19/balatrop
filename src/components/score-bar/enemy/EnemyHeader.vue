<script setup lang="ts">
import { computed } from "vue";
import type { GameState } from "@/game/GameState";

const props = defineProps<{
  game: GameState;
}>();

const enemyName = computed(() => {
  if (props.game.state === "INTRO") {
    return "Rival";
  }
  return props.game.enemy?.pokemon.name || "Unknown";
});
</script>

<template>
  <div class="bg-score-board-enemy-header-background rounded">
    <span class="text-lg flex justify-center text-center"
      >A wild {{ enemyName }} has appeared</span
    >
  </div>
</template>
