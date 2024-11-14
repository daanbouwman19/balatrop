<script setup>
import { defineProps } from 'vue';

defineProps({
    enemyName: {
        type: String,
        required: true,
    }
});

</script>

<template>
    <div class="bg-score-board-enemy-header-background rounded">
        <span class="text-xl flex justify-center">{{ enemyName }}</span>
    </div>
</template>