<script setup>
import { defineProps } from 'vue';

defineProps({
    enemyImageUrl: {
        type: String,
        required: true,
    }
});

</script>

<template>
    <img :href="enemyImageUrl" class="border-0"/>
</template>