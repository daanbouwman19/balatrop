<script setup>
import MainCanvas from './components/canvas/MainCanvas.vue';
import ScoreBar from './components/score-bar/ScoreBar.vue';
import Game from './game.js';
import { ref } from 'vue';

const game = ref(new Game());
</script>

<template>
  <div class="flex flex-row justify-between items-center w-[100vw] h-[100vh] bg-background">
    <ScoreBar :game="game"/>
    <MainCanvas :game="game"/>
  </div>
</template>