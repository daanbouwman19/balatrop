<script setup>
import { defineProps } from 'vue';

defineProps({
    headerText: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    textColorClass: {
        type: String,
        required: true,
    }
});

</script>

<template>
    <div class="flex flex-col justify-center bg-score-board-background-dark rounded p-1 m-2">
        <span class="text-sm">{{ headerText }}</span>
        <div class="bg-score-board-background text-center">
            <span class="text-xl" :class="textColorClass">{{ text }}</span>
        </div>
    </div>
</template>