<script setup>
import MainCanvas from './components/canvas/MainCanvas.vue';
import ScoreBar from './components/score-bar/ScoreBar.vue';
import AiConsole from './components/console/AiConsole.vue'
import Game from './game.js';
import { ref } from 'vue';

const game = new Game();
console.log(game);

const gameRef = ref(game);
console.log(gameRef);

</script>

<template>
  <div class="flex">
    <ScoreBar/>
    <MainCanvas :game="gameRef"/>
    <AiConsole/>
  </div>
</template>