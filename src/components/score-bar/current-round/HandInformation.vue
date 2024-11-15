<script setup>
import SmallComponent from './SmallComponent.vue';
import { defineProps } from 'vue';
import { GameActive } from '@/components/canvas/GameActive';

defineProps({
    game: {
        type: GameActive,
        required: true
    }
});

const cardsLeft = game.player_deck.length - game.drawed_this_round 

</script>

<template>
    <div class="flex flex-row justify-center items-center">
        <div class="flex flex-col justify-center bg-score-board-background-dark rounded p-1 m-2">
            <span class="text-sm">Total cards left</span>
            <div class="bg-score-board-background text-center">
                <span class="text-xl text-score-board-current-score-background">{{ cardsLeft }}</span>
            </div>
        </div>
    </div>
</template>