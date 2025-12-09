<script setup lang="ts">
import { PokemonCard } from "../game/GameState";

defineProps<{
  card: PokemonCard;
  selected: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <!-- Static Hit/Layout Container -->
  <div
    class="relative w-[150px] h-[200px] cursor-pointer select-none group"
    @click="emit('click')"
  >
    <!-- Animated Visual Container -->
    <div
      class="w-full h-full bg-white/80 backdrop-blur-sm border-4 rounded-xl flex flex-col items-center justify-between p-2 transition-transform duration-200"
      :class="{
        'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] -translate-y-5':
          selected,
        'border-gray-300 group-hover:-translate-y-5 group-hover:border-yellow-400 group-hover:shadow-[0_0_10px_rgba(250,204,21,0.5)] group-hover:brightness-105':
          !selected,
      }"
    >
      <!-- Name -->
      <div class="text-center font-bold text-sm text-gray-800 truncate w-full">
        {{ card.name }}
      </div>

      <!-- Sprite -->
      <div class="flex-grow flex items-center justify-center">
        <img
          :src="card.image"
          :alt="card.name"
          class="w-24 h-24 object-contain"
        />
      </div>

      <!-- Types -->
      <div class="flex gap-1 justify-center w-full mb-1">
        <div v-for="(type, index) in card.types" :key="index">
          <img
            :src="`/images/${type.type.name}.png`"
            :alt="type.type.name"
            class="h-4 object-contain"
          />
        </div>
      </div>

      <!-- Value/Stats -->
      <div class="text-xs text-gray-500 font-mono">Val: {{ card.value }}</div>
    </div>
  </div>
</template>

<style scoped></style>
