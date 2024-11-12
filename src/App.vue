<script setup>
import MainCanvas from './components/canvas/MainCanvas.vue';
import ScoreBar from './components/score-bar/ScoreBar.vue';
import AiConsole from './components/console/AiConsole.vue'
import Game from './game.js';
import { ref } from 'vue';

const game = ref(new Game());
</script>

<template>
  <div class="flex">
    <ScoreBar :game="game"/>
    <MainCanvas :game="game"/>
    <AiConsole :game="game"/>
  </div>
</template>