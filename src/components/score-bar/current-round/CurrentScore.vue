<script setup>
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
    <div class="bg-score-board-background-dark flex flex-col content-center items-center text-xl">
        <span class="p-2">{{ game.currentHandScore }}</span>
        <div class="flex flex-row content-center items-center">
            <div class="score-board-current-score-background">
                <span class="text-white">{{ game.currentScore }}</span>
            </div>
            <span class="text-score-board-current-multi-background p-2">X</span>
            <div class="score-board-current-multi-background">
                <span class="text-white">{{ game.currentMulti }}</span>
            </div>
        </div>
    </div>
</template>