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
  <div
    class="relative w-[150px] h-[200px] bg-white/80 backdrop-blur-sm border-4 rounded-xl flex flex-col items-center justify-between p-2 cursor-pointer transition-transform duration-200 select-none"
    :class="{
      'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] -translate-y-5':
        selected,
      'border-gray-300 hover:-translate-y-2': !selected,
    }"
    @click="emit('click')"
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
        class="w-24 h-24 object-contain pixelated"
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

    <!-- Value/Stats (Optional, based on design) -->
    <div class="text-xs text-gray-500 font-mono">Val: {{ card.value }}</div>
  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}
</style>
