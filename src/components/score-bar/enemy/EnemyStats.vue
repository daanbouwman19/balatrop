<script setup lang="ts">
import CoinIcon from "../../icons/CoinIcon.vue";
import type { GameState } from "@/game/GameState";

defineProps<{
  game: GameState;
}>();

const generateArray = (count: number) => {
  return Array.from({ length: count }, (_, index) => index);
};
</script>

<template>
  <div
    class="flex flex-row gap-2 p-1 w-[100%] justify-center items-center bg-score-board-background-dark"
  >
    <div class="flex flex-col">
      <span class="text-xl text-center">Reward:</span>
      <div class="flex flex-row justify-center items-center flex-wrap gap-1 px-2">
        <CoinIcon
          v-for="index in generateArray(game.fightReward)"
          :key="index"
          class="w-[24px] h-[24px] mx-0.5"
        />
      </div>
    </div>
  </div>
</template>
