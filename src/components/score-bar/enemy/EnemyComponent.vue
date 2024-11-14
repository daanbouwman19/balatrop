<script setup>

import { defineProps } from 'vue';
import Game from '../../../game.js';

defineProps({
    game: {
        type: Game,
        required: true
    }
});

const enemyName = "BIG Blind";
</script>

<template>
    <div class="flex flex-col justify-center items-center">

    </div>
</template>