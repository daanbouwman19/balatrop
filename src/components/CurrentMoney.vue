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
    <div class="flex flex-row justify-center items-center bg-transparent text-money-color text-shadow font-bold py-0.5 px-1">
        <DuitseFrank/>
        <span class="text-xl">{{ game.duitseFranken }}</span>
    </div>
</template>

<style scoped>
.text-shadow{
    text-shadow: 2px 2px black;
}
</style>