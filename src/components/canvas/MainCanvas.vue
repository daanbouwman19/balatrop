<script setup>
    import { ref, onMounted, defineProps } from 'vue';
    import { Screen } from './screen.js';
    import Game from '../../game.js';
    import { FrankEntity } from './entity/impl/FrankEntity.js';
    import { CardEntity } from './entity/impl/cardEntity.js';
    import { GameActive } from './GameActive.js';
   

    const props = defineProps({
        game: {
            type: Game,
            required: true
        }
    });

    const canvasRef = ref(null);
    var screen = null;

    var gameA = null;

    // GAME INITIALIZATION

    onMounted(() => {

        const canvas = canvasRef.value;

        gameA = new GameActive(canvas);

        loop();
    });

    // GAME LOOP
    
    const loop = () => {
        if (gameA) {
            gameA.update();
            gameA.draw();
        }

        requestAnimationFrame(loop);
    }


</script>

<template>
    <div class="h-full w-full">
        <canvas class="bg-background h-full w-full" ref="canvasRef"></canvas>
    </div>
</template>
