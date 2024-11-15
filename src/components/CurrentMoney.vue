<script setup>
import { defineProps } from 'vue';
import DuitseFrank from '../components/icons/DuitseFrank.vue'
import { GameActive } from './canvas/GameActive';

defineProps({
    game: {
        type: GameActive,
        required: true
    }
});


</script>

<template>
    <div class="flex flex-row justify-center items-center bg-transparent text-money-color text-shadow font-bold py-0.5 px-1">
        <DuitseFrank class="h-[24px] w-[24px]"/>
        <span class="text-xl">{{ game.score }}</span>
    </div>
</template>

<style scoped>
.text-shadow{
    text-shadow: 2px 2px black;
}
</style>