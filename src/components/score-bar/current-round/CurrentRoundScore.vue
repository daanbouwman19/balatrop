<script setup>
import DamageIcon from '../../icons/DamageIcon.vue'
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
    <div class="flex flex-row p-2 content-center items-center bg-score-board-background-dark rounded">
        <div class="flex flex-col content-center items-center text-base">
            <span>Round</span>
            <span>Damage</span>
        </div>
        <div class="bg-score-board-background p-2 text-lg">
            <DamageIcon/>
            <span>{{ game.currentScore }}</span>
        </div>
    </div>
</template>