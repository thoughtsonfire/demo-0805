<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
const props = defineProps({
    // 缓存百分比 小数0~1
    bufferPer: {
        type: Number,
        default: 0.00001
    },
    // 当前进度百分比 小数0~1
    currentPer: {
        type: Number,
        default: 0.00001
    },
    // 外部控制进度条粗细
    activing: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(["changeCurrent"])
const progress = ref<HTMLElement>()
const inTimer = ref<number>(0)  // 节流计时器
const outTimer = ref<number>(0)
const isActive = ref<boolean>(false)    // 光标是否悬停进度条
const isDragging = ref<boolean>(false)  // 是否正在拖动

// 悬浮时的效果
const handleMouseEnter = () => {
    inTimer.value = setTimeout(() => {
        isActive.value = true
    }, 200)
}

const handleMouseLeave = () => {
    clearTimeout(inTimer.value)     // 清除显示计时器防止快速经过时的闪烁
    if (!isDragging.value) {
        outTimer.value = setTimeout(() => {
            isActive.value = false
        }, 50);
    }
}

// 初始化拖动
const initDrag = () => {
    let offsetX, currPer

    // 鼠标按下事件处理程序
    progress.value?.addEventListener("mousedown", (e) => {
        isDragging.value = true
        isActive.value = true
        offsetX = e.clientX - progress.value!.getBoundingClientRect().left; // 鼠标相对进度条左侧的X偏移
        currPer = offsetX / progress.value!.getBoundingClientRect().width; // 计算进度比例
        emit("changeCurrent", currPer);    // 更新
    })

    // 移动端 触碰事件处理程序
    progress.value?.addEventListener("touchstart", (e) => {
        isDragging.value = true
        isActive.value = true
        offsetX = e.touches[0].clientX - progress.value!.getBoundingClientRect().left; // 鼠标相对进度条左侧的X偏移
        currPer = offsetX / progress.value!.getBoundingClientRect().width; // 计算进度比例
        emit("changeCurrent", currPer);    // 更新
    })

    // 鼠标移动事件处理程序
    document.addEventListener("mousemove", (e) => {
        if (!isDragging.value) return
        offsetX = e.clientX - progress.value!.getBoundingClientRect().left; // 鼠标相对进度条左侧的X偏移
        currPer = offsetX / progress.value!.getBoundingClientRect().width; // 计算进度比例
        // 边界值判定
        currPer = Math.max(0.00001, currPer);
        currPer = Math.min(0.99999, currPer);
        emit("changeCurrent", currPer);    // 更新
    })

    // 移动端 移动事件处理程序
    document.addEventListener("touchmove", (e) => {
        if (!isDragging.value) return;
        e.preventDefault();
        offsetX = e.touches[0].clientX - progress.value!.getBoundingClientRect().left; // 鼠标相对进度条左侧的X偏移
        currPer = offsetX / progress.value!.getBoundingClientRect().width; // 计算进度比例
        // 边界值判定
        currPer = Math.max(0.00001, currPer);
        currPer = Math.min(0.99999, currPer);
        emit("changeCurrent", currPer);    // 更新
    }, { passive: false })

    // 鼠标释放事件处理程序
    document.addEventListener("mouseup", () => {
        isDragging.value = false;
        isActive.value = false;
    });

    // 移动端 释放事件处理程序
    document.addEventListener("touchend", () => {
        isDragging.value = false;
        isActive.value = false;
    });
}

onMounted(() => {
    initDrag()
})
const activing = computed(() => props.activing)
watch(activing, (n) => {
    clearTimeout(outTimer.value);
    isDragging.value = n;
    isActive.value = n;
})
</script>

<template>
    <div class="player-progress-area">
        <div class="player-progress-wrap" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="progress">
            <div class="player-progress" :class="isActive ? 'state-active' : ''">
                <div class="player-progress-schedule-wrap">
                    <div class="player-progress-schedule">
                        <div class="player-progress-schedule-buffer" :style="`transform: scaleX(${bufferPer});`"></div>
                        <div class="player-progress-schedule-current" :style="`transform: scaleX(${currentPer});`">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.player-progress-area {
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    .player-progress-wrap {
        -webkit-box-align: end;
        -ms-flex-align: end;
        align-items: flex-end;
        cursor: pointer;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        height: 16px;
        padding-bottom: 6px;

        .player-progress {
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            height: 2px;
            position: relative;
            width: 100%;

            .player-progress-schedule-wrap {
                position: absolute;
                height: 100%;
                width: 100%;

                .player-progress-schedule {
                    background-color: hsla(0, 0%, 100%, .2);
                    border-radius: 1.5px;
                    bottom: 0;
                    left: 0;
                    overflow: hidden;
                    position: absolute;
                    right: 0;
                    top: 0;

                    .player-progress-schedule-buffer {
                        background-color: hsla(0, 0%, 100%, .3);
                    }

                    .player-progress-schedule-current {
                        background-color: var(--brand_pink);
                    }

                    .player-progress-schedule-buffer,
                    .player-progress-schedule-current {
                        bottom: 0;
                        left: 0;
                        position: absolute;
                        right: 0;
                        top: 0;
                        -webkit-transform: scaleX(0);
                        transform: scaleX(0);
                        -webkit-transform-origin: 0 0;
                        transform-origin: 0 0;
                    }
                }
            }
        }

        .state-active {
            height: 4px;
        }
    }
}
</style>