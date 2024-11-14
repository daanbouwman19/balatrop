<script setup>
import DamageIcon from '../../icons/DamageIcon.vue'
import DuitseFrank from '../../icons/DuitseFrank.vue'

</script>

<template>
    <div class="flex flex-row gap-2 p-1 w-[100%] justify-center items-center bg-score-board-background-dark">
        <div class="flex flex-col">
            <span class="text-sm text-center">Do at least:</span>
            <div class="flex flex-row justify-center">
                <DamageIcon/>
                <span class="text-lg text-center text-score-board-current-multi-background">Damage</span>
            </div>
        </div>

        <div class="flex flex-col">
            <span class="text-sm text-center">Reward:</span>
            <div class="flex flex-row justify-center items-center h-[20px]">
                <DuitseFrank 
                    class="w-[16px] h-[16px] mx-0.5"
                    :key="index" 
                    v-for="index in [1, 2, 3, 4]"
                />
            </div>
        </div>
    </div>
</template>