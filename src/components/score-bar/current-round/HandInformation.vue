<script setup>
import { defineProps } from 'vue';
import { GameActive } from '@/components/canvas/GameActive';

const props = defineProps({
    game: {
        type: GameActive,
        required: true
    }
});

const cardsLeft = props.game.player_deck.length - props.game.drawed_this_round 

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