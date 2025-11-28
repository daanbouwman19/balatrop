<script setup lang="ts">
import DuitseFrank from "../components/icons/DuitseFrank.vue";
import { GameState } from "@/game/GameState";

defineProps({
  game: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="flex flex-row justify-center items-center bg-transparent text-money-color text-shadow font-bold py-0.5 px-1"
  >
    <DuitseFrank class="h-[24px] w-[24px]" />
    <span class="text-xl">{{ game.score }}</span>
  </div>
</template>

<style scoped>
.text-shadow {
  text-shadow: 2px 2px black;
}
</style>
