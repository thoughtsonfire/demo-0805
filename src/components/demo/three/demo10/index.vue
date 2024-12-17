<script setup lang="ts">
import { onMounted } from 'vue';
import ThreeApp from './ts/three/ThreeApp';

onMounted(() => {
    const threeApp = new ThreeApp()
})
</script>
<template>

</template>