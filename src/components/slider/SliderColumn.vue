<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
const props = defineProps({
    // 当前进度百分比 小数0~1
    currentPer: {
        type: Number,
        default: 0
    },
    // 滑块总高度
    sliderHeight: {
        type: Number,
        default: 12
    },
    // 更新信号
    order: {
        type: Boolean,
        default: 0
    }
})
const emit = defineEmits(["update:order", "changeCurrent"])
const isDragging = ref<boolean>(false)  // 是否正在拖动
const barScaleY = ref<number>(0)        // 滑动条的Y轴缩放百分比 0~1
const thumbOffsetY = ref<number>(0)     // 滑块Y轴的向上偏移量 单位px
// 初始化滑块位置
const initPosition = () => {
    barScaleY.value = props.currentPer
    thumbOffsetY.value = (props.sliderHeight - 12) * props.currentPer
    emit("update:order", false)
}
// 初始化拖动
const initDrag = () => {
    const slider: HTMLElement = document.querySelector(".slider-column")!
    let offsetY, currPer
    // 鼠标按下事件处理程序
    slider.addEventListener("mousedown", (e: MouseEvent) => {
        isDragging.value = true
        offsetY = slider.getBoundingClientRect().bottom - e.clientY
        currPer = offsetY / slider.getBoundingClientRect().height
        barScaleY.value = currPer
        thumbOffsetY.value = (slider.getBoundingClientRect().height - 12) * currPer
        emit("changeCurrent", currPer)
    })

    // 移动端 触碰事件处理程序
    slider.addEventListener("touchstart", (e) => {
        isDragging.value = true;
        offsetY = slider.getBoundingClientRect().bottom - e.touches[0].clientY;
        currPer = offsetY / slider.getBoundingClientRect().height; // 计算进度比例
        barScaleY.value = currPer;
        thumbOffsetY.value = (slider.getBoundingClientRect().height - 12) * currPer;
        emit("changeCurrent", currPer);    // 更新
    });

    // 鼠标移动事件处理程序
    document.addEventListener("mousemove", (e) => {
        if (!isDragging.value) return;
        offsetY = slider.getBoundingClientRect().bottom - e.clientY;
        currPer = offsetY / slider.getBoundingClientRect().height; // 计算进度比例
        // 边界值判定
        currPer = Math.max(0, currPer);
        currPer = Math.min(1, currPer);
        barScaleY.value = currPer;
        thumbOffsetY.value = (slider.getBoundingClientRect().height - 12) * currPer;
        emit("changeCurrent", currPer);    // 更新
    });

    // 移动端 移动事件处理程序
    document.addEventListener("touchmove", (e) => {
        if (!isDragging.value) return;
        e.preventDefault();
        offsetY = slider.getBoundingClientRect().bottom - e.touches[0].clientY;
        currPer = offsetY / slider.getBoundingClientRect().height; // 计算进度比例
        // 边界值判定
        currPer = Math.max(0, currPer);
        currPer = Math.min(1, currPer);
        barScaleY.value = currPer;
        thumbOffsetY.value = (slider.getBoundingClientRect().height - 12) * currPer;
        emit("changeCurrent", currPer);    // 更新
    }, { passive: false });

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
watch(order, (n) => {
    if (n) {
        initPosition()
    }
})
</script>

<template>
    <div class="slider-column v-ui">
        <div class="v-ui-area">
            <div class="track track-vertical">
                <div class="bar-wrap">
                    <div class="bar" :style="`transform: scaleY(${barScaleY});`"></div>
                </div>
                <div class="thumb" :style="`transform: translateY(-${thumbOffsetY}px);`">
                    <div class="thumb-dot"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.slider-column {
    cursor: pointer;
    height: 12px;

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

    .track.track-vertical {
        -webkit-box-align: end;
        -ms-flex-align: end;
        align-items: flex-end;
        height: 100%;
        width: 2px;

        .bar-wrap {
            background: #e7e7e7;
            border-radius: 1.5px;
            bottom: 0;
            left: 0;
            overflow: hidden;
            position: absolute;
            right: 0;
            top: 0;

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
        }

        .thumb {
            bottom: 0;
            position: relative;
            top: auto;
            cursor: pointer;
            left: -5px;

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
        }
    }
}
</style>