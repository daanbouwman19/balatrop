<script setup lang="ts">
import type { GameState } from "@/game/GameState";
import { computed } from "vue";

const props = defineProps<{
  game: GameState;
}>();

const cardsLeft = computed(
  () => props.game.player_deck.length - props.game.drawed_this_round.length,
);
</script>

<template>
  <div class="flex flex-row justify-center items-center">
    <div
      class="flex flex-col justify-center bg-score-board-background-dark rounded p-1 m-2"
    >
      <span class="text-sm">Total cards left</span>
      <div class="bg-score-board-background text-center">
        <span class="text-xl text-score-board-current-score-background">{{
          cardsLeft
        }}</span>
      </div>
    </div>
  </div>
</template>
