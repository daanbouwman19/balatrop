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
    <div class="flex flex-row justify-center items-center">
        <div class="flex flex-col justify-center bg-score-board-background-dark rounded">
            <span class="text-sm">Hands</span>
            <div class="bg-score-board-background text-center">
                <span class="text-xl text-score-board-current-score-background">{{ game.hands }}</span>
            </div>
        </div>
        <div class="flex flex-col justify-center bg-score-board-background-dark rounded">
            <span class="text-sm">Discards</span>
            <div class="bg-score-board-background text-center">
                <span class="text-xl text-score-board-current-multi-background">{{ game.discards }}</span>
            </div>
        </div>
    </div>
</template>