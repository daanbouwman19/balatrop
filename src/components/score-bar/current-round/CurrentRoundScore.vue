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
    <div class="flex flex-row p-2 content-center justify-center bg-score-board-background-dark rounded">
        <div class="flex flex-col content-center items-center text-base w-[40%]">
            <span>Round</span>
            <span>Damage</span>
        </div>
        <div class="flex bg-score-board-background p-2 text-lg w-[40%] justify-center">
            <DamageIcon/>
            <span>{{ game.currentScore }}</span>
        </div>
    </div>
</template>