<script setup>
import SmallComponent from './SmallComponent.vue';
import { defineProps } from 'vue';
import Game from '../../../game.js';

const props = defineProps({
    game: {
        type: Game,
        required: true
    }
});

const anteText = `${props.game.ante} / ${props.game.maxAnte}`

</script>

<template>
    <div class="flex flex-row justify-center items-center">
        <SmallComponent headerText="Ante" :text="anteText" textColorClass="text-offset-yellow"/>
        <SmallComponent headerText="Round" :text="game.currentRound" textColorClass="text-offset-yellow"/>
    </div>
</template>