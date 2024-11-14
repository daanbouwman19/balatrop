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
    <div class="bg-score-board-background">
        <EnemyCard/>
        <CurrentRound :game="game"/>
    </div>
</template>