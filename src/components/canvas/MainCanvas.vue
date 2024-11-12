<script setup>
    import { ref, onMounted, defineProps } from 'vue';
    import { Screen } from './screen.js';
    // import { Game } from '../game.js'
    
    const props = defineProps();
    console.log(props);

    const canvasRef = ref(null);

    onMounted(() => {
        const canvas = canvasRef.value;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 150, 100);

        const screen = new Screen(canvas);
        screen.clear();
        screen.background("#000000")

    });

</script>

<template>
    <div>
        <canvas ref="canvasRef"></canvas>
    </div>
</template>
