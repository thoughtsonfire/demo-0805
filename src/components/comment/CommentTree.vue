<script setup lang="ts">
import { ref } from 'vue'
const commentList = ref<Array<any>>([])
</script>

<template>
    <div class="reply-list">
        <div class="reply-item" v-for="(rootComment, index) in commentList" :key="index">
            <!-- 第二楼特有的未登录蒙版 -->
            <div class="login-limit-mask" v-if="index === 1">
                <div class="mask-top"></div>
                <div class="mask-bottom"></div>
            </div>
            <div class="root-reply-container">
                <div class="root-reply-avatar-wrap">

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.reply-list {
    margin-top: 14px;
    padding-bottom: 100px;

    .reply-item {
        .login-limit-mask {
            display: none;
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
            pointer-events: none;

            .mask-top {
                height: 80%;
                background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, var(--bg1) 100%);
            }

            .mask-bottom {
                height: 20%;
                background: var(--bg1);
                pointer-events: initial;
            }
        }

        .root-reply-container {
            padding: 22px 0 0 80px;
        }

    }
}
</style>