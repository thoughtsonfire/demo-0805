<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
const props = defineProps({
    // 当前进度百分比 小数0~1
    currentPer: {
        type: Number,
        default: 0
    },
    // 滑块总宽度
    sliderWidth: {
        type: Number,
        default: 12
    },
    // 更新信号
    order: {
        type: Boolean,
        default: false
    }
})
const barScaleX = ref<number>(0)       // 滑动条的X轴缩放百分比 0~1
const isDragging = ref<boolean>(false) // 是否正在拖动
const thumbOffsetX = ref<number>(0)    // 滑块X轴的向右偏移量 单位px
const emit = defineEmits(["update:order", "changeCurrent"])
// 初始化滑块位置
const initPosition = () => {
    barScaleX.value = props.currentPer
    thumbOffsetX.value = (props.sliderWidth - 12) * props.currentPer
    emit('update:order', false)
}
// 初始化拖动
const initDrag = () => {
    const slider: HTMLElement = document.querySelector('.slider-row')!
    let offsetX, currPer  // currPer 取值 0~1

    // 鼠标按下事件处理程序
    slider.addEventListener("mousedown", (e: MouseEvent) => {
        isDragging.value = true
        offsetX = e.clientX - slider.getBoundingClientRect().left;
        currPer = offsetX / slider.getBoundingClientRect().width; // 计算进度比例
        barScaleX.value = currPer
        thumbOffsetX.value = (slider.getBoundingClientRect().width - 12) * currPer
        emit('changeCurrent', currPer)   // 更新
    })

    // 移动端 触碰事件处理程序
    slider.addEventListener("touchstart", (e) => {
        isDragging.value = true
        offsetX = e.touches[0].clientX - slider.getBoundingClientRect().left
        currPer = offsetX / slider.getBoundingClientRect().width // 计算进度比例
        barScaleX.value = currPer
        thumbOffsetX.value = (slider.getBoundingClientRect().width - 12) * currPer
        emit('changeCurrent', currPer)   // 更新
    })

    // 鼠标移动事件处理程序
    document.addEventListener("mousemove", (e) => {
        if (!isDragging.value) return
        offsetX = e.clientX - slider.getBoundingClientRect().left
        currPer = offsetX / slider.getBoundingClientRect().width // 计算进度比例
        // 边界值判定
        currPer = Math.max(0, currPer)
        currPer = Math.min(1, currPer)
        barScaleX.value = currPer
        thumbOffsetX.value = (slider.getBoundingClientRect().width - 12) * currPer
        emit('changeCurrent', currPer)   // 更新
    })

    // 移动端 移动事件处理程序
    document.addEventListener("touchmove", (e) => {
        if (!isDragging.value) return
        e.preventDefault()
        offsetX = e.touches[0].clientX - slider.getBoundingClientRect().left
        currPer = offsetX / slider.getBoundingClientRect().width // 计算进度比例
        // 边界值判定
        currPer = Math.max(0, currPer)
        currPer = Math.min(1, currPer)
        barScaleX.value = currPer
        thumbOffsetX.value = (slider.getBoundingClientRect().width - 12) * currPer
        emit('changeCurrent', currPer)   // 更新
    }, { passive: false })

    // 鼠标释放事件处理程序
    document.addEventListener("mouseup", () => {
        isDragging.value = false;
    });

    // 移动端 释放事件处理程序
    document.addEventListener("touchend", () => {
        isDragging.value = false;
    });
}
onMounted(() => {
    initPosition()
    initDrag()
})
const order = computed(() => props.order)
watch(order, (n, o) => {
    if (n) {
        initPosition()
    }
})
</script>

<template>
    <div class="slider-row v-ui">
        <div class="v-ui-area">
            <div class="track">
                <div class="bar-wrap">
                    <div class="bar" :style="`transform:scaleX(${barScaleX})`"></div>
                </div>
                <div class="thumb" :style="`transform: translateX(${thumbOffsetX}px);`">
                    <div class="thumb-dot"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.slider-row {
    cursor: pointer;
    width: 12px;
}

.track {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 2px;
    position: relative;
    width: 100%;
}

.bar-wrap {
    background: #e7e7e7;
    border-radius: 1.5px;
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
}

.bar {
    background: var(--brand_pink);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
}

.thumb {
    bottom: 0;
    position: relative;
    top: auto;
    cursor: pointer;
    left: 0;
}

.thumb-dot {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    background-color: var(--brand_pink);
    border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-transition: all .2s;
    transition: all .2s;
    vertical-align: middle;
    height: 12px;
    width: 12px;
}
</style>