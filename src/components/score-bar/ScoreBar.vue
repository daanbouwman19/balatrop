<script setup>
import EnemyStats from './enemy/EnemyStats.vue';
import EnemyHeader from './enemy/EnemyHeader.vue';
import CurrentScore from './current-round/CurrentScore.vue';
import HandInformation from './current-round/HandInformation.vue';
import { defineProps } from 'vue';
import { GameActive } from '../canvas/GameActive';

const props = defineProps({
    isMounted: {
        type: Boolean,
        required: true,
    },
    game: {
        type: GameActive,
        required: true
    }
});

</script>

<template>
    <div v-if="isMounted" class="h-full text-text-color overflow-visible">
        <div class="h-full w-52 bg-score-board-background flex flex-col flex-1 justify-center shadow-inner gap" > 
            <EnemyHeader class="mx-auto w-[90%] p-1" :game="game"/>
            <EnemyStats :game="game" class="w-[90%]"/>
            <CurrentScore  :game="game"/>
            <HandInformation :game="game"/>
        </div>
    </div>
</template>

<style scoped>
@media (min-height: 600px) {

    .gap {
        gap: 1rem
    }
}
</style>