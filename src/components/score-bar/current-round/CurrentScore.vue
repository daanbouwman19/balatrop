<script setup>
import { computed, defineProps } from 'vue';
import { GameActive } from '@/components/canvas/GameActive';

const props = defineProps({
    game: {
        type: GameActive,
        required: true
    }
});

const currentHandScore = computed(() => {
    return props.game.totalCardsMultiplier * props.game.totalCardsDamage
});

</script>

<template>
    <div class="bg-score-board-background-dark flex flex-col content-center items-center text-xl">
        <span class="p-1">{{ currentHandScore }}</span>
        <div class="flex flex-row content-center items-center">
            <div>
                <span class="text-white">{{ game.totalCardsDamage }}</span>
            </div>
            <span class="text-score-board-current-multi-background px-4">X</span>
            <div>
                <span class="text-white">{{ game.totalCardsMultiplier }}</span>
            </div>
        </div>
    </div>
</template>