<script setup lang="ts">
import { computed } from "vue";
import { GameActive } from "@/components/canvas/GameActive";

const props = defineProps({
  game: {
    type: GameActive,
    required: true,
  },
});

const enemyName = computed(() => {
  if (props.game.STATE === "INTRO") {
    return "Frank";
  }
  return `${props.game.enemy.pokemon.name}`;
});
</script>

<template>
  <div class="bg-score-board-enemy-header-background rounded">
    <span class="text-lg flex justify-center text-center">A wild {{ enemyName }} has appeard</span>
  </div>
</template>
