<script setup>
import SmallComponent from './SmallComponent.vue';
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
    <div class="flex flex-row justify-center items-center">
        <SmallComponent headerText="Hands" :text="game.hands" textColorClass="text-score-board-current-score-background"/>
        <SmallComponent headerText="Discards" :text="game.discards" textColorClass="text-score-board-current-multi-background"/>
    </div>
</template>