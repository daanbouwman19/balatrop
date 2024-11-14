<script setup>
import EnemyCard from './EnemyCard.vue';
import CurrentRound from './current-round/CurrentRound.vue'
import { defineProps } from 'vue';
import Game from '../../game.js';

const props = defineProps({
    game: {
        type: Game,
        required: true
    }
});
console.log(props.game);
</script>

<template>
    <div class="mx-10 my-6 w-[300px] h-full py-5">
        <div class="h-full w-[300px] bg-score-board-background" > 
            <EnemyCard/>
            <CurrentRound :game="game"/>
        </div>
    </div>
</template> 