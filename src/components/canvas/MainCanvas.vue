<script setup>
    import { ref, onMounted, defineProps } from 'vue';
    import { Screen } from './screen.js';
    import Game from '../../game.js';
    import { CardEntity } from './entity/impl/cardEntity.js';
    
    const props = defineProps({
        game: {
            type: Game,
            required: true
        }
    });
    console.log(props.game);

    const canvasRef = ref(null);

    const entities = [];


    // GAME INITIALIZATION

    onMounted(() => {
        const canvas = canvasRef.value;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 150, 100);

        const screen = new Screen(canvas);
        screen.clear();

    // constructor(x, y, width, height, color) {
        entities.push(new CardEntity(5, 5, 10, 10, "#FF0000"));

        loop();
    });

    // GAME LOOP
    
    const loop = () => {
        
        entities.forEach(entity => {
            entity.update();
        });

        entities.forEach(entity => {
            console.log(entity);
            entity.draw(screen);
        });

        requestAnimationFrame(loop);
    }


</script>

<template>
    <div class="h-full w-full">
        <canvas class="bg-canvas-background h-full w-full" ref="canvasRef"></canvas>
    </div>
</template>
