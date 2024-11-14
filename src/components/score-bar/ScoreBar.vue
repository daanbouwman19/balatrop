<script setup>
import EnemyComponent from './enemy/EnemyComponent.vue';
import CurrentRound from './current-round/CurrentRound.vue'
import { defineProps } from 'vue';
import Game from '../../game.js';

defineProps({
    game: {
        type: Game,
        required: true
    }
});

</script>

<template>
    <div class="mx-2 my-6 w-auto h-full py-2 text-text-color overflow-visible spacing">
        <div class="h-full w-52 bg-score-board-background flex flex-col flex-1 justify-center shadow-inner" > 
            <EnemyComponent :game="game"/>
            <CurrentRound :game="game"/>
        </div>
    </div>
</template>

<style scoped>
@media (min-height: 600px) {
    .spacing {
        margin: 0 0 0 2.5rem;
        padding: 1rem 0 1rem 0;
    }
}
</style>