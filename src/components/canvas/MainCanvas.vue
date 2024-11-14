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
    console.log(props.game);

    const canvasRef = ref(null);
    var screen = null;

    var gameA = null;

    // GAME INITIALIZATION

    onMounted(() => {

        const canvas = canvasRef.value;

        gameA = new GameActive(canvas);

        // canvas.width = canvas.clientWidth;
        // canvas.height = canvas.clientHeight;

        // const ctx = canvas.getContext('2d');
        // ctx.fillStyle = 'red';
        // ctx.fillRect(10, 10, 150, 100);

        // screen = new Screen(canvas);
        // screen.clear();
        // canvas.addEventListener('mousemove', (e) => {
        //     screen.updateMousePosition(e)
        // });
        // window.addEventListener('resize', () => {
        //     let width = canvas.clientWidth;
        //     let height = canvas.clientHeight;
        //     screen.resize(width, height);
        // });

        // constructor(x, y, width, height, color)
        // entities.push(new FrankEntity(5, 5, 10, 10, "#FF0000"));

        // props.game.STATE = "PLAYING";
        // props.game.refillHand();
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
