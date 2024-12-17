<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
const width = ref<number>((1080 - document.documentElement.offsetHeight) * 1.77 + 1920)
const height = ref<number>(1080)
const style = reactive({
    width: width.value + "px",
    height: (width.value * 9) / 16 + "px",
    transform: "scale(1) translate(-50%,-50%)"
})

const getScale = () => {
    const w = window.innerWidth / width.value
    const h = window.innerHeight / height.value
    console.log(window.innerHeight, 'wh');

    console.log(w, h);

    return w < h ? h : w
}

const setScale = () => {
    style.transform = "scale(" + getScale() + ") translate(-50%, 0%)"
    console.log(document.documentElement.offsetHeight, '--');

    console.log(style);

}

const deBounce = (fn: Function, t: number) => {
    const delay = t || 500
    let timer: number;
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            fn()
        }, delay);
    }
}


onMounted(() => {
    width.value = (1080 - document.documentElement.offsetHeight) * 1.77 + 1920
    console.log(document.documentElement.offsetHeight, 'hhh');

    console.log(width.value, 'iiii');

    setScale()
    window.onresize = deBounce(setScale, 1000)
})
</script>

<template>
    <div class="box" :style="style">
        <div class="flex-box">
            <div class="content"></div>
            <div class="bottom"></div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.box {
    transform-origin: 0 0;
    // position: absolute;e
    left: 50%;
    transition: 0.3s;
    overflow: hidden;
}

.flex-box {
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 1920px;
    height: 1080px;
    margin: 0 auto;
    background: rgba($color: #000000, $alpha: 0.1);

    .content {
        width: 100px;
        height: 100px;
        background-color: red;
    }
}
</style>
