<script setup>
import EnemyCard from './EnemyCard.vue';
import EnemyHeader from './EnemyHeader.vue';
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
        <EnemyHeader class="w-[90%] p-1" :enemyName="enemyName"/>
        <EnemyCard class="w-[90%]"/>
    </div>
</template>