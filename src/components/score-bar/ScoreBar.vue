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
    <div class="mx-10 my-6 w-auto h-full py-5 text-text-color overflow-visible">
        <div class="h-full w-52 bg-score-board-background flex flex-col flex-1 gap-2 justify-center shadow-inner" > 
            <EnemyComponent :game="game"/>
            <CurrentRound :game="game"/>
        </div>
    </div>
</template>