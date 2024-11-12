<script setup>
    import { ref, onMounted } from 'vue';
   
    const canvasRef = ref(null);

    onMounted(() => {
        const canvas = canvasRef.value;
        console.log(canvasRef)
        console.log(canvas);
        // const ctx = canvas.getContext('2d');
        // ctx.fillStyle = 'red';
        // ctx.fillRect(10, 10, 150, 100);
    });

</script>

<template>
    <div>
        <canvas :ref="canvasRef"></canvas>
    </div>
</template>
