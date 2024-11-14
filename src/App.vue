<script setup>
import MainCanvas from './components/canvas/MainCanvas.vue';
import ScoreBar from './components/score-bar/ScoreBar.vue';
import RotateDevice from './components/RotateDevice.vue'
import CurrentMoney from './components/CurrentMoney.vue';
import Game from './game.js';
import { computed, ref } from 'vue';

const game = ref(new Game());
const width = ref(window.innerWidth);
const orientation = ref(window.screen.orientation?.type || 'portrait');

const updateWidth = () => {
  width.value = window.innerWidth;
};
const updateOrientation = () => {
  orientation.value = window.screen.orientation?.type || 'portrait';
};

const rotateDevice = computed(() => {
  return orientation.value === 'portrait' || width.value <= 600;
});

window.addEventListener('resize', updateWidth);
window.addEventListener('orientationchange', updateOrientation);

</script>
<template>
  <div 
    class="flex flex-row justify-between items-center w-[100vw] h-[100vh] bg-background"
    v-if="!rotateDevice"
  >
    <ScoreBar :game="game"/>
    <MainCanvas :game="game"/>
    <CurrentMoney class="fixed top-1 right-1" :game="game"/>
  </div>
  <div v-else>
    <RotateDevice/>
  </div>
</template>