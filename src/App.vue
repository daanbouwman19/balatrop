<script setup>
import MainCanvas from './components/canvas/MainCanvas.vue';
import ScoreBar from './components/score-bar/ScoreBar.vue';
import Game from './game.js';
import { computed, ref } from 'vue';

const game = ref(new Game());
const rotateDevice = computed(() => {
  if (window.screen.orientation.type === 'portrait') {
    return true
  }
  return false
});


</script>
<template>
  <div 
    class="flex flex-row justify-between items-center w-[100vw] h-[100vh] bg-background"
    v-if="!rotateDevice"
  >
    <ScoreBar :game="game"/>
    <MainCanvas :game="game"/>
  </div>
  <div v-else>
    <h1>Please rotate device your device 90 degrees</h1>
  </div>
</template>