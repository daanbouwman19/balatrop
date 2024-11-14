<script setup>
import CurrentScore from './CurrentScore.vue'
import CurrentRoundScore from './CurrentRoundScore.vue';
import HandInformation from './HandInformation.vue';
import CurrentMoney from './CurrentMoney.vue';
import { defineProps } from 'vue';
import Game from '../../../game.js';

defineProps({
    game: {
        type: Game,
        required: true
    }
});

</script>

<template>
    <div>
        <CurrentRoundScore :game="game"/>
        <CurrentScore :game="game"/>
        <HandInformation/>
        <CurrentMoney/>
    </div>
</template>