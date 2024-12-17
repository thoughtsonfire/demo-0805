<script setup lang="ts">
import CommentTree from './CommentTree.vue';
import ReplyTextArea from './ReplyTextArea.vue';
import { ref } from 'vue'
const type = ref<number>(1)  //评论排序方式 1最热 2最新
const isHideReplyBox = ref<boolean>(true)  //是否隐藏回复框
const replyBoxDisplay = ref<string>("none")
const left = ref<number>(0) //固钉评论框左偏移量
const width = ref<number>(0) //固钉评论框宽度
//修改评论排序方式
const changeCommentSort = (val: number) => {
    if (type.value === val) return
    type.value = val
}
</script>

<template>
    <div class="comment">
        <div class="jdream-comment browser-pc">
            <div class="comment-container">
                <div class="reply-header">
                    <div class="reply-navigation">
                        <ul class="nav-bar">
                            <li class="nav-title">
                                <span class="nav-title-text">评论</span>
                                <span class="total-reply">999+</span>
                            </li>
                            <li class="nav-sort">
                                <div class="sort-item" :class="{ 'active': type === 1 }" @click="changeCommentSort(1)">
                                    最热</div>
                                <div class="part-symbol"></div>
                                <div class="sort-item" :class="{ 'active': type === 2 }" @click="changeCommentSort(2)">
                                    最新
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 评论区 -->
                <div class="reply-wrap">
                    <div class="main-reply-box">
                        <div class="reply-box">
                            <ReplyTextArea></ReplyTextArea>
                        </div>
                    </div>
                    <CommentTree ref="CommentTree"></CommentTree>
                    <div class="fixed-reply-box" :class="isHideReplyBox ? 'reply-box-hide' : 'reply-box-show'"
                        :style="`--left:${left}px;--width:${width}px;display:${replyBoxDisplay};`">
                        <i class="reply-box-shadow"></i>
                        <div class="reply-box fixed-box">
                            <ReplyTextArea ref="FixReplyBox"></ReplyTextArea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.comment {
    margin-top: 24px;
    z-index: 0;
    position: relative;

    .jdream-comment {
        background-color: #FFFFFF;

        .comment-container {
            .reply-header {
                .reply-navigation {
                    margin-bottom: 22px;

                    .nav-bar {
                        display: flex;
                        align-items: center;
                        list-style: none;
                        margin: 0;
                        padding: 0;

                        .nav-title {
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            .nav-title-text {
                                color: black;
                                font-size: 20px;
                                font-weight: 500;
                            }
                        }

                        .nav-sort {
                            display: flex;
                            align-items: center;

                            .sort-item {
                                color: var(--text3);
                                cursor: pointer;

                                &:hover {
                                    color: var(--brand_pink);
                                }

                                &.active {
                                    color: var(--text1) !important;
                                }
                            }

                            .part-symbol {
                                height: 11px;
                                margin: 0 12px;
                                border-left: solid 1px;
                            }
                        }
                    }
                }
            }

            .reply-wrap {
                position: relative;

                .main-reply-box {
                    .reply-box {
                        display: flex;
                        flex-direction: column;
                    }
                }

                .fixed-reply-box {
                    position: fixed;
                    bottom: 0;
                    left: var(--left);
                    z-index: 10;
                    width: var(--width);

                    .reply-box-shadow {
                        position: absolute;
                        top: -10px;
                        z-index: 1;
                        width: 100%;
                        height: 36px;
                        border-radius: 50%;
                        background-color: #00000014;
                        filter: blur(10px);
                    }

                    .reply-box {
                        display: flex;
                        flex-direction: column;

                        &.fixed-box {
                            position: relative;
                            z-index: 2;
                            padding: 15px 0;
                            border-top: 0.5px solid #E3E5E7;
                            background-color: #FFFFFF;
                        }
                    }
                }

                .reply-box-hide {
                    animation: fade-out-bottom .3s ease-out forwards;
                    transform-origin: bottom;
                }

                .reply-box-show {
                    animation: fade-in-bottom .3s ease-out forwards;
                    transform-origin: bottom;
                }
            }
        }
    }
}

@keyframes fade-in-bottom {
    0% {
        opacity: 0;
        transform: translateY(5px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fade-out-bottom {
    0% {
        opacity: 1;
        transform: translateY(0);
    }

    100% {
        opacity: 0;
        transform: translateY(5px);
    }
}
</style>