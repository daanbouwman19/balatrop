<script setup>
import { defineProps } from 'vue';
import Game from '../game';
import DuitseFrank from '../components/icons/DuitseFrank.vue'

defineProps({
    game: {
        type: Game,
        required: true
    }
});

</script>

<template>
    <div class="bg-score-board-background-dark p-2">
        <div class="flex flex-row justify-center items-center bg-score-board-background text-money-color py-0.5 px-1">
            <DuitseFrank/>
            <span class="text-xl">{{ game.duitseFranken }}</span>
        </div>
    </div>
</template>