<script setup lang="ts">
import { ref, reactive } from 'vue'
const videoUrl = ref<string>("/VideoLibrary/BungouStrayDogs/01.mp4")


</script>

<template>

    <!-- loop: 循环播放
    @loadedmetadata: 元数据已加载完毕。 
    -->
    <video muted ref="videoPlayer" :src="videoUrl" autoplay>

    </video>

</template>
