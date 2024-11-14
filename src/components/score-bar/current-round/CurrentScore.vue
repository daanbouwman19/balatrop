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
        <span class="p-1">{{ game.currentHandScore }}</span>
        <div class="flex flex-row content-center items-center">
            <div>
                <span class="text-white">{{ game.currentScore }}</span>
            </div>
            <span class="text-score-board-current-multi-background px-4">X</span>
            <div>
                <span class="text-white">{{ game.currentMulti }}</span>
            </div>
        </div>
    </div>
</template>