<script setup>
import { defineProps } from 'vue';
import { GameActive } from '@/components/canvas/GameActive';

const props = defineProps({
    game: {
        type: GameActive,
        required: true
    }
});

const enemyName = `A wild ${props.game.enemy.pokemon.name} appears`

</script>

<template>
    <div class="bg-score-board-enemy-header-background rounded">
        <span class="text-lg flex justify-center text-center">{{ enemyName }}</span>
    </div>
</template>