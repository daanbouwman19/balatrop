<script setup>
import HelloWorld from './components/HelloWorld.vue'
import MainCanvas from './components/canvas/MainCanvas.vue'
import Game from './game.js'
import { ref } from 'vue'

const game = new Game();
console.log(game);

const gameRef = ref(game);
console.log(gameRef);

</script>

<template>
  <HelloWorld/>
  <MainCanvas :gameRef="gameRef"/>
</template>