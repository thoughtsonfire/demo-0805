<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import ThreeApp from './ts/ThreeApp';

const scene = ref<HTMLDivElement>()

onMounted(() => {
    const threeApp = new ThreeApp(scene.value as HTMLDivElement)
    threeApp.render()
})
</script>

<template>
    <canvas ref="scene" class="scene">
    </canvas>
</template>

<style scoped></style>