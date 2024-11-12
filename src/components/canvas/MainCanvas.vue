<script setup>
    import { ref, onMounted, defineProps } from 'vue';
    import { Screen } from './screen.js';
    import Game from '../../game.js'
    
    const props = defineProps({
        game: {
            type: Game,
            required: true
        }
    });
    console.log(props.game);

    const canvasRef = ref(null);

    const entities = [];

    onMounted(() => {
        const canvas = canvasRef.value;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 150, 100);

        const screen = new Screen(canvas);
        screen.clear();
        screen.background("#000000")


        loop();
    });

    
    const loop = () => {
        
        entities.forEach(entity => {
            entity.update();
        });

        entities.forEach(entity => {
            entity.draw(screen);
        });

        requestAnimationFrame(loop);
    }


</script>

<template>
    <div>
        <canvas ref="canvasRef"></canvas>
    </div>
</template>
