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
    var screen = null;

    const entities = [];


    // GAME INITIALIZATION

    onMounted(() => {
        const canvas = canvasRef.value;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 150, 100);

        screen = new Screen(canvas);
        screen.clear();
        canvas.addEventListener('mousemove', (e) => {
            screen.updateMousePosition(e)
        });
        canvas.addEventListener('touchmove', (e) => {
            screen.updateMousePosition(e)
        });

        // constructor(x, y, width, height, color)
        entities.push(new CardEntity(5, 5, 10, 10, "#FF0000"));

        loop();
    });

    // GAME LOOP
    
    let t = 0;
    const loop = () => {
        t++;
        if (screen != null) {
            screen.background("#000000");

            entities.forEach(entity => {
                entity.update(t);
            });

            entities.forEach(entity => {
                entity.draw(screen, t);
            });
        }

        requestAnimationFrame(loop);
    }


</script>

<template>
    <div class="h-full w-full">
        <canvas class="bg-canvas-background h-full w-full" ref="canvasRef"></canvas>
    </div>
</template>
