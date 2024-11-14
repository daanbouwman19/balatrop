<script setup>
import EnemyCard from './enemy/EnemyCard.vue';
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
    <div class="mx-10 my-6 w-auto h-full py-5 text-text-color">
        <div class="h-full w-52 bg-score-board-background flex flex-col flex-1 gap-5 justify-center" > 
            <EnemyCard/>
            <CurrentRound :game="game"/>
        </div>
    </div>
</template> 