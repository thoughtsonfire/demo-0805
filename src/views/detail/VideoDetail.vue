<script setup lang="ts">
import Comment from '@/components/comment/Comment.vue';
import { ref, reactive, nextTick, onMounted } from 'vue'
import HeaderBar from '@/components/headerBar/HeaderBar.vue'
import { handleNum, linkify } from '@/utils/utils';
import PlayerWrapper from '@/components/player/PlayerWrapper.vue';
const playerSize = reactive({
    width: 704,
    height: 442
})
const video = reactive({
    title: "这个是视频标题",
    top: true,
    type: 1,
    auth: 1,
    uploadDate: '2024-12',
    descr: `这个是视频的简介这个
    是视频的简介这个是视频的简介
    这个是视频的简介这个是视频的简
    介这个是视频的简介这个是视频的简介
    是视频的简介这个是视频的简介
    这个是视频的简介这个是视频的简
    介这个是视频的简介这个是视频的简介`
})
const view = ref<number>(99999)     //播放量
const good = ref<number>(999)//点赞量
const isGifShow = ref<boolean>(false)
const gifDisplay = ref<boolean>(false)
const coin = ref<number>(100) //投币数
const collect = ref<number>(10)//收藏
const share = ref<number>(12)//转发
const showAllDesc = ref<boolean>(true)//是否展开简介
const descTooLong = ref<boolean>(false)//简介太长需要展开
const category = reactive({
    mcId: 123132,
    mcName: "mc标签",
    scName: "sc标签",
})
const tags = reactive([
    '标签1',
    '标签2',
    '标签3',
    '标签4'
])
const handleNumFn = (num: number) => {  //处理数据
    return handleNum(num)
}

const loveOrNot = () => {

}
const noPage = () => {

}
const openCollectDialog = () => {

}

//判断简介长度是否过长需收起
const isDescTooLong = () => {
    nextTick(() => {
        const desc = document.querySelector('.basic-desc-info') as HTMLElement | null
        if (desc && desc.clientHeight > 84) {
            descTooLong.value = true
            showAllDesc.value = false
        }
    })
}

// 处理超链接文本
const handleLinkify = (text: string) => {
    return linkify(text);
}

onMounted(() => {
    isDescTooLong()
})
</script>

<template>
    <div class="videoDetail">
        <HeaderBar :isFixHeaderBar="true"></HeaderBar>
        <div class="video-container">
            <div class="left-container" :style="`width: ${playerSize.width}px;`">
                <!-- 标题 -->
                <div class="video-info-container">
                    <h1 :title="video.title" class="video-title">
                        {{ video.title }}
                    </h1>
                    <div class="video-info-detail">
                        <div class="video-info-detail-list">
                            <a class="honor item honor-rank" href="" target="_blank" v-if="video.top">
                                <i class="iconfont icon-paihang"></i>
                                <span class="honor-text">全站排行榜最高第1名</span>
                                <i class="iconfont icon-youjiantou"></i>
                            </a>
                            <span class="view item">
                                <i class="iconfont icon-bofangshu"></i>
                                &nbsp;{{ handleNumFn(view) }}&nbsp;
                            </span>
                            <span class="danmu item">
                                <i class="iconfont icon-danmushu"></i>
                                &nbsp;9999&nbsp;
                            </span>
                            <span class="date item">
                                {{ video.uploadDate }}
                            </span>
                            <span class="copyright item" v-if="video.type === 1 && video.auth === 1">
                                <i class="iconfont icon-jinzhi"></i>
                                未经作者授权，禁止转载
                            </span>
                        </div>
                    </div>
                </div>
                <!-- 播放器组件 -->
                <PlayerWrapper></PlayerWrapper>
                <!-- 三连转发 -->
                <div class="video-toolbar-container">
                    <div class="video-toolbar-left">
                        <div class="toolbar-left-item-wrap">
                            <div class="video-toolbar-left-item" :class="{ 'on': false }" @click="loveOrNot">
                                <i class="iconfont icon-dianzan"></i>
                                <span class="video-toolbar-item-text">{{ handleNum(good) }}</span>
                                <div class="dianzan-gif" :class="isGifShow ? 'gif-show' : 'gif-hide'">
                                    <img src="~@/assets/imgs/dianzan.gif" alt="" v-if="gifDisplay">
                                </div>
                            </div>
                        </div>
                        <div class="toolbar-left-item-wrap">
                            <div class="video-toolbar-left-item" :class="{ 'on': true }" @click="loveOrNot()">
                                <i class="iconfont icon-diancai"></i>
                                <span class="video-toolbar-item-text">不喜欢</span>
                            </div>
                        </div>
                        <div class="toolbar-left-item-wrap">
                            <div class="video-toolbar-left-item" :class="{ 'on': false }" @click="noPage">
                                <i class="iconfont icon-toubi"></i>
                                <span class="video-toolbar-item-text">{{ handleNum(coin) }}</span>
                            </div>
                        </div>
                        <div class="toolbar-left-item-wrap">
                            <div class="video-toolbar-left-item" :class="{ 'on': false }" @click="openCollectDialog">
                                <i class="iconfont icon-shoucang1"></i>
                                <span class="video-toolbar-item-text">{{ handleNum(collect) }}</span>
                            </div>
                        </div>
                        <div class="toolbar-left-item-wrap">
                            <div class="video-toolbar-left-item" @click="noPage">
                                <i class="iconfont icon-zhuanfa"></i>
                                <span class="video-toolbar-item-text">{{ handleNum(share) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="video-toolbar-right">
                        <div class="video-toolbar-right-item">
                            <el-popover>
                                <template #reference>
                                    <div class="video-tool-more">
                                        <i class="iconfont icon-gengduo"></i>
                                    </div>
                                </template>
                                <div class="video-tool-more-dropdown">
                                    <div class="dropdown-item">
                                        <i class="iconfont icon-jubao1"></i>
                                        <span>举报稿件</span>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                    </div>
                </div>
                <!-- 简介评论区 -->
                <div class="left-container-under-player">
                    <!-- 简介 -->
                    <div class="video-desc-container"
                        :style="(!video.descr || video.descr === '') ? 'display:none;' : ''">
                        <div class="basic-desc-info" :style="showAllDesc ? 'height:auto;' : 'height:84px'">
                            <span class="desc-info-text" v-html="handleLinkify(video.descr)"></span>
                        </div>
                        <div class="toggle-btn" v-if="descTooLong">
                            <span class="toggle-btn-text" @click="showAllDesc = !showAllDesc">
                                {{ showAllDesc ? '收起' : '展开更多' }}
                            </span>
                        </div>
                    </div>
                    <!-- 标签 -->
                    <div class="video-tag-container">
                        <div class="tag-container">
                            <a class="tag-link" href="" target="_blank">{{ category.mcName }}</a>
                        </div>
                        <div class="tag-container">
                            <a class="tag-link" href="" target="_blank">{{ category.scName }}</a>
                        </div>
                        <div class="tag-container" v-for="(item, index) in tags" :key="index">
                            <a class="tag-link" href="" target="_blank">{{ item }}</a>
                        </div>
                    </div>
                    <!-- 评论 -->
                    <Comment></Comment>
                </div>
            </div>
            <div class="right-container">
                <div class="right-container-inner">
                    <!-- up主信息 -->
                    <div class="up-panel-container">
                        <div class="up-info--left">
                            <div class="up-avatar-wrap">
                                <el-popover>
                                    <template #reference>
                                        <a class="up-avatar" href="" target="_blank"></a>
                                    </template>
                                </el-popover>
                            </div>
                        </div>
                        <div class="up-info--right"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@layer base {
    .videoDetail {
        .video-container {
            width: auto;
            padding: 64px 10px 0px;
            max-width: 2540px;
            min-width: 1080px;
            margin: 0 auto;
            display: flex;
            justify-content: center;
            box-sizing: content-box;
            position: relative;

            .left-container {
                position: sticky;
                height: fit-content;

                .video-info-container {
                    height: 104px;
                    box-sizing: border-box;
                    padding-top: 22px;

                    .video-title {
                        font-size: 20px !important;
                        font-weight: 500 !important;
                        -webkit-font-smoothing: antialiased; //改善字体显示效果
                        color: var(--text1);
                        line-height: 28px !important;
                        margin-bottom: 6px !important;
                        overflow: hidden;
                        white-space: nowrap;
                        text-decoration: ellipsis !important;
                    }

                    .video-info-detail {
                        font-size: 13px;
                        color: var(--text3);
                        display: flex;
                        align-items: center;
                        height: 24px;
                        line-height: 18px;
                        position: relative;
                        overflow: hidden;

                        .video-info-detail-list {
                            display: flex;
                            align-items: center;
                            overflow: hidden;
                            box-sizing: border-box;

                            .honor {
                                display: inline-flex;
                                align-items: center;
                                font-size: 13px;
                                height: 24px;
                                border-radius: 2px;
                                padding: 0 6px;

                                .icon-paihang {
                                    font-size: 14px;
                                    margin: 0 5px 0 3px;
                                }

                                .icon-youjiantou {
                                    font-size: 14px;
                                }
                            }

                            .honor.honor-rank {
                                color: var(--brand_pink);
                                background-color: rgba(255, 102, 153, 0.1);
                            }

                            .item {
                                flex-shrink: 0;
                                margin-right: 12px;
                                overflow: hidden;

                                &:last-child {
                                    margin-right: 0;
                                }

                                .icon-jinzhi {
                                    font-size: 12px;
                                    margin-right: 4px;
                                    color: var(--stress_red);
                                }
                            }

                            .view,
                            .danmu,
                            .copyright {
                                display: inline-flex;
                                align-items: center;
                            }

                            .date {
                                text-overflow: ellipsis;
                                overflow: hidden;
                                white-space: nowrap;
                                line-height: 24px;
                                font-size: 13px;
                                height: 100%;
                                display: inline-block;
                                vertical-align: middle;
                            }
                        }
                    }
                }

                .video-toolbar-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top: 16px;
                    padding-bottom: 12px;
                    line-height: 28px;
                    border-bottom: 1px solid var(--line_regular);

                    .video-toolbar-left {
                        position: relative;
                        display: flex;
                        align-items: center;
                        -webkit-user-select: none;
                        user-select: none;

                        .toolbar-left-item-wrap {
                            position: relative;
                            margin-right: 8px;

                            .video-toolbar-left-item {
                                position: relative;
                                display: -ms-flexbox;
                                display: flex;
                                -ms-flex-align: center;
                                align-items: center;
                                width: 92px;
                                white-space: nowrap;
                                transition: all .3s;
                                font-size: 13px;
                                color: var(--text2);
                                font-weight: 500;
                                cursor: pointer;

                                &.on,
                                &:hover {
                                    color: var(--brand_pink);
                                }

                                .iconfont {
                                    margin-right: 8px;
                                    font-size: 26px;
                                }

                                .icon-diancai {
                                    transform: translateY(2px);
                                }

                                .video-toolbar-item-text {
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    word-break: break-word;
                                    white-space: nowrap;
                                }

                                .dianzan-gif {
                                    position: absolute;
                                    top: -50px;
                                    left: -10px;
                                    height: 40px;

                                    img {
                                        height: 100%;
                                    }
                                }

                                .gif-hide {
                                    animation: disappear 0.2s ease-out forwards;
                                    transform-origin: bottom;
                                }

                                .gif-show {
                                    animation: appear 0.2s ease-out forwards;
                                    transform-origin: bottom;
                                }
                            }
                        }
                    }

                    .video-toolbar-right {
                        display: flex;
                        align-items: center;
                        -webkit-user-select: none;
                        user-select: none;

                        .video-toolbar-right-item {
                            display: -ms-inline-flexbox;
                            display: inline-flex;
                            -ms-flex-align: center;
                            align-items: center;
                            font-size: 13px;
                            color: var(--text2);
                            transition: all .3s;
                            cursor: pointer;

                            &:hover {
                                color: var(--brand_pink);
                            }

                            .video-tool-more {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                width: 30px;

                                .icon-gengduo {
                                    font-size: 18px;
                                }
                            }

                            .video-tool-more-dropdown {
                                padding: 12px 0px;
                                cursor: auto;

                                .dropdown-item {
                                    position: relative;
                                    display: flex;
                                    align-items: center;
                                    height: 40px;
                                    width: 120px;
                                    padding: 0 20px;
                                    color: var(--text1);
                                    cursor: pointer;

                                    &:hover {
                                        background-color: var(--Ga1);
                                    }

                                    .icon-jubao1 {
                                        margin-right: 10px;
                                    }
                                }
                            }
                        }
                    }
                }

                .left-container-under-player {
                    .video-desc-container {
                        margin: 16px 0;

                        .basic-desc-info {
                            white-space: pre-line;
                            letter-spacing: 0;
                            color: var(--text1);
                            font-size: 15px;
                            line-height: 24px;
                            overflow: hidden;

                        }

                        .toggle-btn {
                            margin-top: 10px;
                            font-size: 13px;
                            line-height: 18px;

                            .toggle-btn-text {
                                cursor: pointer;
                                color: var(--text2);

                                &:hover {
                                    color: var(--brand_pink);
                                }
                            }
                        }
                    }

                    .video-tag-container {
                        padding-bottom: 6px;
                        margin: 16px 0 20px 0;
                        border-bottom: 1px solid var(--line_regular);
                        display: flex;
                        flex-wrap: wrap;

                        .tag-container {
                            margin: 0px 12px 8px 0px;

                            .tag-link {
                                color: var(--text2);
                                background: var(--graph_bg_regular);
                                height: 28px;
                                line-height: 28px;
                                border-radius: 14px;
                                font-size: 13px;
                                padding: 0 12px;
                                box-sizing: border-box;
                                transition: all .3s;
                                display: -ms-inline-flexbox;
                                display: inline-flex;
                                -ms-flex-align: center;
                                align-items: center;
                                cursor: pointer;
                            }
                        }
                    }
                }
            }

            .right-container {
                width: 350px;
                flex: none;
                margin-left: 30px;
                position: relative;
                pointer-events: none;

                .right-container-inner {
                    padding-bottom: 250px;
                    position: sticky;

                    * {
                        pointer-events: all;
                    }

                    .up-panel-container {
                        .up-info-container {
                            box-sizing: border-box;
                            height: 104px;
                            display: flex;
                            align-items: center;

                            .up-info--left {
                                .up-avatar-wrap {
                                    width: 48px;
                                    height: 48px;
                                    flex-shrink: 0;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;

                                    .up-avatar {
                                        display: block;
                                        width: 100%;
                                        height: 100%;
                                        border-radius: 50%;
                                        background-color: var(--graph_weak);
                                    }
                                }
                            }

                            .up-info--right {
                                margin-left: 12px;
                                flex: 1;
                            }
                        }
                    }
                }
            }
        }
    }
}

@keyframes appear {
    0% {
        opacity: 0;
        transform: translateY(5px) scale(0);
    }

    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes disappear {
    0% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    100% {
        opacity: 0;
        transform: translateY(5px) scale(0);
    }
}
</style>