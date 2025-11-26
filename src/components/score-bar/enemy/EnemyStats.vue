<script setup lang="ts">
import DuitseFrank from '../../icons/DuitseFrank.vue'
import { GameActive } from '@/components/canvas/GameActive';

defineProps({
    game: {
        type: GameActive,
        required: true
    }
});

const generateArray = (count: number) => {
    return Array.from({ length: count }, (_, index) => index);
}
</script>

<template>
  <div class="flex flex-row gap-2 p-1 w-[100%] justify-center items-center bg-score-board-background-dark">
    <div class="flex flex-col">
      <span class="text-xl text-center">Reward:</span>
      <div class="flex flex-row justify-center items-center h-[20px]">
        <DuitseFrank 
          v-for="index in generateArray(game.fightReward)"
          :key="index" 
          class="w-[24px] h-[24px] mx-0.5"
        />
      </div>
    </div>
  </div>
</template>