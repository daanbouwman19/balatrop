<script setup>
import DamageIcon from '../../icons/DamageIcon.vue'
import DuitseFrank from '../../icons/DuitseFrank.vue'

</script>

<template>
    <div class="flex flex-col bg-score-board-background-dark">
        <span class="text-sm">Do at least:</span>
        <div>
            <DamageIcon/>
            <span class="text-xl text-score-board-current-multi-background">Damage</span>
        </div>
        <div>
            <span class="text-sm">Reward: </span>
            <div>
                <DuitseFrank 
                    class="w-[8px] h-[8px]"
                    :key="index" 
                    v-for="index in [1, 2, 3, 4]"
                />
            </div>
        </div>
    </div>
</template>