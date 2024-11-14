<script setup>
import EnemyInformation from './EnemyInformation.vue';
import EnemyImage from './EnemyImage.vue';

</script>

<template>
    <div class="flex flex-row justify-center items-center gap-2 px-2">
        <EnemyImage class="w-[64px] h-[64px]"/>
        <EnemyInformation/>
    </div>
</template>