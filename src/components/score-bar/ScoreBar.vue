<script setup>
    import { defineProps } from 'vue';
    import Game from '../../game.js';

    const props = defineProps({
        game: {
            type: Game,
            required: true
        }
    });
    console.log(props.game);
</script>

<template>
    <div class="bg-score-board-background">
        
    </div>
</template>