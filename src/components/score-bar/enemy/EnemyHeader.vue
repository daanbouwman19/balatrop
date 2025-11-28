<script setup lang="ts">
import { computed } from "vue";
import { GameState } from "@/game/GameState";

const props = defineProps({
  game: {
    type: Object,
    required: true,
  },
});

const enemyName = computed(() => {
  if (props.game.state === "INTRO") {
    return "Frank";
  }
  return `${props.game.enemy?.pokemon.name || "Unknown"}`;
});
</script>

<template>
  <div class="bg-score-board-enemy-header-background rounded">
    <span class="text-lg flex justify-center text-center"
      >A wild {{ enemyName }} has appeard</span
    >
  </div>
</template>
