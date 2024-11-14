<script setup>
import DamageIcon from '../../icons/DamageIcon.vue'
import DuitseFrank from '../../icons/DuitseFrank.vue'

</script>

<template>
    <div class="flex flex-col justify-center items-center bg-score-board-background-dark">
        <span class="text-sm text-center">Do at least:</span>
        <div class="flex flex-row justify-center">
            <DamageIcon/>
            <span class="text-lg text-center text-score-board-current-multi-background">Damage</span>
        </div>
        <div class="flex flex-row justify-center items-center h-[20px]">
            <DuitseFrank 
                class="w-[16px] h-[16px]"
                :key="index" 
                v-for="index in [1, 2, 3, 4]"
            />
        </div>
    </div>
</template>