<script setup lang="ts">
import HeaderBar from "@/components/headerBar/HeaderBar.vue";
import HeaderChannel from "@/components/headerChannel/HeaderChannel.vue";
import { onMounted, onBeforeMount, ref, reactive, watch, onUnmounted, nextTick } from "vue";
import api from '@/request/api';
interface scListItem {
    scName: string,
    mcId?: number,
    scId?: number,
}
interface channel {
    mcName: string,
    mcId?: number,
    scList: scListItem[]
}
const channels = reactive<channel[]>([
    {
        mcName: "番剧",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "综艺",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "纪录片",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "动画",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "游戏",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "番剧",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "综艺",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "纪录片",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "动画",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "游戏",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
    {
        mcName: "国创",
        mcId: 1223555,
        scList: [
            {
                scName: "咨询"
            },
            {
                scName: "连载动画"
            }
        ],
    },
])
//是否是固定导航栏
const isFixHeaderBar = ref<boolean>(false)
//是否是固定频道栏
const isFixChannel = ref<boolean>(false)
//是否显示更多频道
const isChannelDown = ref<boolean>(false)
//是否正在加载随机推荐
const loadingRandom = ref<boolean>(true)
//随即推荐视频列表
const randomVideos = ref<any[]>([])
//累加推荐视频列表
const cumulativeVideos = ref<any[]>([])
//是否还有更多累加视频
const hasMore = ref<boolean>(true)
//是否正在加载更多视频
const loadingMore = ref<boolean>(false)
function initHeader() {
    let startingPoint: number
    const header: HTMLElement = document.querySelector('header')!
    let isMoving: boolean = false

    const handleMouseMove = (e: MouseEvent) => {
        const headerRect: DOMRect = header.getBoundingClientRect()
        if (e.clientX >= headerRect.left && e.clientX <= headerRect.right
            && e.clientY >= headerRect.top && e.clientY <= headerRect.bottom
        ) {
            if (!isMoving) {
                startingPoint = e.clientX;
                header.classList.add('moving');
                isMoving = true
            }
            let percentage = (e.clientX - startingPoint) / window.outerWidth + 0.5
            header.style.setProperty('--percentage', String(percentage))
        } else {
            if (isMoving) {
                header.classList.remove('moving')
                header.style.setProperty('--percentage', '0.5')
                isMoving = false
            }
        }
    }
    const handleMouseOut = (e: MouseEvent) => {
        if (e.relatedTarget == null) {
            header.classList.remove('moving')
            header.style.setProperty('--percentage', '0.5')
            isMoving = false
        }
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseout', handleMouseOut)
}

//获取游客随机推荐
function getRandomVideos() {
    loadingRandom.value = true
    let params = {
        sc_id: 100000
    }
    api.selectVideo(params).then(res => {
        console.log(res, 'getRandomVideos');
        (res as any).data.forEach(item => {
            let temp = {
                video: {
                    vid: "000000",
                    title: "title",
                    uploadDate: "2024-08-01 10:12:12",
                    coverUrl: new URL('@/assets/imgs/404.png', import.meta.url).href,
                    v_url: ""
                },
                user: {
                    uid: "00000000",
                    nickName: "zhangsan",
                }
            }
            temp.video.vid = item.v_id
            temp.video.title = item.v_title
            temp.video.v_url = item.v_url
            temp.user.uid = item.uid
            temp.user.nickName = item.nickName
            randomVideos.value.push(temp)
        })

    })
    loadingRandom.value = false
}

//获取游客累加推荐
function getCumulativeVideos() {
    loadingMore.value = true
    let temp = JSON.parse(JSON.stringify(randomVideos.value.slice(0, 10)))
    cumulativeVideos.value.push(...temp)
    loadingMore.value = false
}

// 滚动事件 头部 频道栏 下拉加载
function handleScroll() {
    const el = document.documentElement
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const headerHeight = (document.querySelector(".main__layout") as HTMLElement).offsetTop
    const bottomDistance = documentHeight - (window.scrollY + windowHeight);


    window.requestAnimationFrame(() => {
        //导航栏
        if (window.scrollY >= 64 && !isFixHeaderBar.value) {
            isFixHeaderBar.value = true
        } else if (window.scrollY < 64 && isFixHeaderBar.value) {
            isFixHeaderBar.value = false
        }

        //频道栏
        if (window.scrollY >= headerHeight && !isFixChannel.value) {
            isFixChannel.value = true
        } else if (window.scrollY < headerHeight && isFixChannel.value) {
            isFixChannel.value = false
        }

        //当距离底部小于800且有更多数据且加载完毕后触发
        if (bottomDistance < 800 && hasMore.value && !loadingMore.value) {
            getCumulativeVideos()
        }
    })
}


//适配手机
const designWidth = 1100;
const viewportMetaSelector = 'meta[name=viewport]';
const isMobileDevice = ref(false);

const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor
    const isMobileUserAgent = /android|iPad|iPhone|iPod|blackberry|IEMobile|Opera Mini/i.test(userAgent);
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
    return isMobileUserAgent || isMobileViewport;
};

const updateViewport = () => {
    let metaNode = document.querySelector(viewportMetaSelector) as HTMLMetaElement;

    if (!metaNode) {
        metaNode = document.createElement('meta');
        metaNode.name = 'viewport';
        document.head.appendChild(metaNode);
    }

    const scale = document.documentElement.clientWidth / designWidth;
    metaNode.content = `initial-scale=${scale}, minimum-scale=${scale}, maximum-scale=${scale}, user-scalable=no`;
    // nextTick(() => {
    //     throttleReload()
    // })
};
// 刷新
function throttleReload() {
    const now = Date.now();
    const lastReloadTime = parseInt(localStorage.getItem('lastReloadTime') || '0', 10);

    // 检查是否距离上次刷新已经过了1秒
    if (now - lastReloadTime >= 1000) {
        localStorage.setItem('lastReloadTime', now.toString());
        window.location.reload();
    }
}

const handleResize = () => {
    const currentIsMobile = isMobile();
    if (currentIsMobile !== isMobileDevice.value) {
        isMobileDevice.value = currentIsMobile;
        updateViewport();
    }
};

const handleOrientationChange = () => {
    updateViewport();
};


const resizeObserver = new ResizeObserver(() => {
    handleResize();
});

onBeforeMount(() => {
    getRandomVideos()
})

onMounted(() => {
    initHeader()
    handleScroll()
    window.addEventListener('scroll', handleScroll);
    handleResize(); // 设备初始检查和设置

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);//屏幕方向改变


    resizeObserver.observe(document.documentElement);

})
onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
    resizeObserver.disconnect(); // 组件卸载时移除监听
});

</script>
<template>
    <div class="index">
        <div class="large-header">
            <HeaderBar :isFixHeaderBar="isFixHeaderBar"></HeaderBar>
            <header>
                <div class="view">
                    <img class="morning" src="@/assets/imgs/bilibili/bilibili-winter-view-1.jpg" alt="">
                    <img class="afternoon" src="@/assets/imgs/bilibili/bilibili-winter-view-2.jpg" alt="">
                    <video autoplay loop muted class="evening">
                        <source src="@/assets/imgs/bilibili/bilibili-winter-view-3.webm" type="video/webm" />
                    </video>
                    <img class="window-cover" src="@/assets/imgs/bilibili/bilibili-winter-view-3-snow.png" alt="">
                </div>
                <div class="tree">
                    <img class="morning" src="@/assets/imgs/bilibili/bilibili-winter-tree-1.png" alt="">
                    <img class="afternoon" src="@/assets/imgs/bilibili/bilibili-winter-tree-2.png" alt="">
                    <img class="evening" src="@/assets/imgs/bilibili/bilibili-winter-tree-3.png" alt="">
                </div>
                <div class="header-banner__inner">
                    <div class="logo-box">
                        <img src="@/assets/imgs/teriteri-white.png" alt="">
                    </div>
                </div>
                <div class="taper-line"></div>
            </header>
            <HeaderChannel></HeaderChannel>
        </div>
        <!-- 固定频道栏 -->
        <div class="header-channel-fixed" :style="isFixChannel ? '' : 'display:none;'">
            <div class="header-channel-fixed-container" :class="isChannelDown ? 'header-channel-fixed-down' : ''"
                @mouseenter="isChannelDown = true" @mouseleave="isChannelDown = false">
                <div class="header-channel-fixed-left">
                    <div class="left-fixed-channel">
                        <i class="iconfont icon-fengche"></i>
                        <span>动态</span>
                    </div>
                    <div class="left-fixed-channel">
                        <i class="iconfont icon-huo"></i>
                        <span>热门</span>
                    </div>
                </div>
                <div class="header-channel-fixed-center"></div>
                <div class="header-channel-fixed-right">
                    <div class="header-channel-fixed-right-left">
                        <div class="left-top">
                            <a :href="`/v/anime`" target="_blank" class="header-channel-fixed-right-item">番剧1</a>
                            <a :href="`/movie`" target="_blank" class="header-channel-fixed-right-item">电影</a>
                            <a :href="`/v/guochuang`" target="_blank" class="header-channel-fixed-right-item">国创</a>
                            <a :href="`/tv`" target="_blank" class="header-channel-fixed-right-item">电视剧</a>
                            <a :href="`/variety`" target="_blank" class="header-channel-fixed-right-item">综艺</a>
                            <a :href="`/documentary`" target="_blank" class="header-channel-fixed-right-item">纪录片</a>
                            <a :href="`/v/${item.mcId}`" target="_blank" class="header-channel-fixed-right-item"
                                v-for="(item, index) in channels.slice(2)" :key="index">
                                {{ item.mcName }}
                            </a>
                            <!-- 这里的url要在VLOG标签做出来后重新修改，目前先暂定到生活日常区 -->
                            <a :href="`/v/life/daily`" target="_blank" class="header-channel-fixed-right-item">VLOG</a>
                            <a :href="`/v/life/funny`" target="_blank" class="header-channel-fixed-right-item">搞笑</a>
                            <a :href="`/v/game/stand_alone`" target="_blank"
                                class="header-channel-fixed-right-item">单机游戏</a>
                            <a :href="`/love`" target="_blank" class="header-channel-fixed-right-item">公益</a>
                            <a :href="`/mooc`" target="_blank" class="header-channel-fixed-right-item">公开课1</a>
                        </div>
                    </div>
                    <div class="header-channel-fixed-right-right">
                        <a :href="`/read/home`" target="_blank" class="header-channel-fixed-right-item">专栏2</a>
                        <a :href="`/live`" target="_blank" class="header-channel-fixed-right-item">直播</a>
                        <a :href="`/activity`" target="_blank" class="header-channel-fixed-right-item">活动</a>
                        <a :href="`/cheese`" target="_blank" class="header-channel-fixed-right-item">课堂</a>
                        <a :href="`/community`" target="_blank" class="header-channel-fixed-right-item"
                            style="letter-spacing: 0px;">社区中心</a>
                        <a :href="`/song`" target="_blank" class="header-channel-fixed-right-item"
                            style="letter-spacing: 0px;">新歌热榜2</a>
                    </div>
                    <div class="left-bottom">
                        <a :href="`/v/anime`" target="_blank" class="header-channel-fixed-right-item">番剧3</a>
                        <a :href="`/movie`" target="_blank" class="header-channel-fixed-right-item">电影</a>
                        <a :href="`/v/guochuang`" target="_blank" class="header-channel-fixed-right-item">国创</a>
                        <a :href="`/tv`" target="_blank" class="header-channel-fixed-right-item">电视剧</a>
                        <a :href="`/variety`" target="_blank" class="header-channel-fixed-right-item">综艺</a>
                        <a :href="`/documentary`" target="_blank" class="header-channel-fixed-right-item">纪录片</a>
                        <a :href="`/v/${item.mcId}`" target="_blank" class="header-channel-fixed-right-item"
                            v-for="(item, index) in channels.slice(2)" :key="index">
                            {{ item.mcName }}
                        </a>
                        <a :href="`/v/life/daily`" target="_blank" class="header-channel-fixed-right-item">VLOG</a>
                        <a :href="`/v/life/funny`" target="_blank" class="header-channel-fixed-right-item">搞笑</a>
                        <a :href="`/v/game/stand_alone`" target="_blank"
                            class="header-channel-fixed-right-item">单机游戏</a>
                        <a :href="`/love`" target="_blank" class="header-channel-fixed-right-item">公益</a>
                        <a :href="`/mooc`" target="_blank" class="header-channel-fixed-right-item">公开课3</a>
                    </div>
                </div>
                <div class="header-channel-fixed-arrow">
                    <div class="iconfont icon-xiajiantou" :style="isChannelDown ? 'transform: rotate(180deg);' : ''">
                    </div>
                </div>
            </div>
        </div>
        <!-- 主体布局 -->
        <div class="main__layout">
            <div class="recommended-container">
                <div class="container">
                    <!-- 轮播图 -->
                    <div class="recommended-swipe">

                    </div>
                    <!-- 随机推荐 -->
                    <div class="feed-card" v-for="index in loadingRandom ? 11 : randomVideos.length" :key="index">
                        <div class="video-card">
                            <!-- 骨架屏 -->
                            <div class="video-card__skeleton" :class="loadingRandom ? 'loading_animation' : 'hide'">
                                <div class="video-card__skeleton--cover"></div>
                                <div class="video-card__skeleton--info">
                                    <div class="video-card__skeleton--right">
                                        <p class="video-card__skeleton--text"></p>
                                        <p class="video-card__skeleton--text short"></p>
                                        <p class="video-card__skeleton--light"></p>
                                    </div>
                                </div>
                            </div>
                            <!-- 实体内容 -->
                            <div class="video-card__wrap" v-if="!loadingRandom">
                                <a :href="`/video?v_url=${randomVideos[index - 1].video.v_url}&v_id=${randomVideos[index - 1].video.vid}`"
                                    target="_blank">
                                    <div class="video-card__image">
                                        <div class="video-card__image--wrap">
                                            <picture class="video-card__cover">
                                                <img :src="randomVideos[index - 1].video.coverUrl"
                                                    :alt="randomVideos[index - 1].video.title">
                                            </picture>
                                        </div>
                                        <div class="video-card__mask">
                                            <div class="video-card__stats">
                                                <div class="video-card__stats--left">
                                                    <span class="video-card__stats--item">
                                                        <i class="iconfont icon-bofangshu"></i>
                                                        <span class="video-card__stats--text">
                                                            12万
                                                        </span>
                                                    </span>
                                                    <span class="video-card__stats--item">
                                                        <i class="iconfont icon-danmushu"></i>
                                                        <span class="video-card__stats--text">
                                                            900
                                                        </span>
                                                    </span>
                                                </div>
                                                <div class="video-card__stats__duration">
                                                    17:30
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                                <div class="video-card__info">
                                    <div class="video-card__info--right">
                                        <h3 class="video-card__info--tit">
                                            <a :href="`/video?v_url=${randomVideos[index - 1].video.v_url}&v_id=${randomVideos[index - 1].video.vid}`"
                                                target="_blank">
                                                {{ randomVideos[index - 1].video.title }}
                                            </a>
                                        </h3>
                                        <div class="video-card__info--bottom">
                                            <div class="video-card__info--icon-text" :style="'display: none;'">已关注</div>
                                            <a class="video-card__info--owner"
                                                :href="`/space/${randomVideos[index - 1].user.uid}`" target="_blank">
                                                <i class="iconfont icon-uper" :style="''"></i>
                                                <span class="video-card__info--author">{{ randomVideos[index -
                                                    1].user.nickName }}</span>
                                                <span class="video-card__info--date">
                                                    · 8-17
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 累加推荐 -->
                    <div class="video-card" v-for="(item, index) in cumulativeVideos" :key="index">
                        <!-- 骨架屏 -->
                        <div class="video-card__skeleton hide">
                            <div class="video-card__skeleton--cover"></div>
                            <div class="video-card__skeleton--info">
                                <div class="video-card__skeleton--right">
                                    <p class="video-card__skeleton--text"></p>
                                    <p class="video-card__skeleton--text short"></p>
                                    <p class="video-card__skeleton--light"></p>
                                </div>
                            </div>
                        </div>
                        <!-- 实体内容 -->
                        <div class="video-card__wrap" v-if="!loadingRandom">
                            <a href="" target="_blank">
                                <div class="video-card__image">
                                    <div class="video-card__image--wrap">
                                        <picture class="video-card__cover">
                                            <img :src="item.video.coverUrl" :alt="item.video.title">
                                        </picture>
                                    </div>
                                    <div class="video-card__mask">
                                        <div class="video-card__stats">
                                            <div class="video-card__stats--left">
                                                <span class="video-card__stats--item">
                                                    <i class="iconfont icon-bofangshu"></i>
                                                    <span class="video-card__stats--text">
                                                        12万
                                                    </span>
                                                </span>
                                                <span class="video-card__stats--item">
                                                    <i class="iconfont icon-danmushu"></i>
                                                    <span class="video-card__stats--text">
                                                        900
                                                    </span>
                                                </span>
                                            </div>
                                            <div class="video-card__stats__duration">
                                                17:30
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                            <div class="video-card__info">
                                <div class="video-card__info--right">
                                    <h3 class="video-card__info--tit">
                                        <a :href="`/video/item.video.vid}`" target="_blank">
                                            {{ item.video.title }}
                                        </a>
                                    </h3>
                                    <div class="video-card__info--bottom">
                                        <div class="video-card__info--icon-text" :style="'display: none;'">已关注</div>
                                        <a class="video-card__info--owner" :href="`/space/${item.user.uid}`"
                                            target="_blank">
                                            <i class="iconfont icon-uper" :style="''"></i>
                                            <span class="video-card__info--author">{{ item.user.nickName }}</span>
                                            <span class="video-card__info--date">
                                                · 8-17
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 骨架屏 -->
                    <div class="video-card" v-for="index in 10" :key="index" :style="hasMore ? '' : 'display: none;'">
                        <div class="video-card__skeleton loading_animation">
                            <div class="video-card__skeleton--cover"></div>
                            <div class="video-card__skeleton--info">
                                <div class="video-card__skeleton--right">
                                    <p class="video-card__skeleton--text"></p>
                                    <p class="video-card__skeleton--text short"></p>
                                    <p class="video-card__skeleton--light"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="feed-roll-btn"></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.index {
    position: relative;
    margin: 0 auto;
    max-width: var(--v-max-w);
    background-color: var(--bg1);

    .large-header {
        background-color: #fff;
        min-height: 64px;
        position: relative;
        margin: 0 auto;
        max-width: var(--v-max-w);
        width: 100%;
        color: #000;

        header {
            position: relative;
            z-index: 0;
            display: flex;
            -ms-flex-pack: center; //老版ie主轴对齐方式
            justify-content: center;
            margin: 0 auto;
            width: 100%;
            min-width: 1000px;
            min-height: 155px;
            max-height: 240px;
            height: 9.375vw;
            background-color: #e3e5e7;
            background-position: center 0;
            background-size: cover;
            background-repeat: no-repeat;
            overflow: hidden;
            --percentage: 0.5; //自定义一个0.5

            .view,
            .tree {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;

                img,
                video {
                    position: absolute;
                    display: block;
                    width: 120%;
                    height: 100%;
                    object-fit: cover;
                }

                .morning {
                    z-index: 20;
                    opacity: calc(1 - (var(--percentage) - 0.25) / 0.25);
                }

                .afternoon {
                    z-index: 10;
                    opacity: calc(1 - (var(--percentage) - 0.5) / 0.5);
                }
            }

            .view {
                transform: translateX(calc(var(--percentage)* 100px));

                .window-cover {
                    opacity: calc((var(--percentage) - 0.9)/0.1);
                }
            }

            .tree {
                transform: translateX(calc(var(--percentage)* 50px));
                filter: blur(3px)
            }

            .view,
            .tree,
            .morning,
            .afternoon {
                transition: .2s all ease-in;
            }

            .header-banner__inner {
                position: relative;
                width: 100%;
                max-width: var(--v-max-w);
                margin: 0 auto;
                display: flex;
                align-items: flex-end;

                .logo-box {
                    z-index: 1;
                    display: inline-block;
                    width: 150px;
                    height: 50%;

                    img {
                        cursor: pointer;
                        position: relative;
                        top: 5;
                        right: 0;
                        margin-bottom: 20px;
                        margin-left: 15px;
                        width: 150px;
                        height: 50px;
                        filter: drop-shadow(3px 5px 3px rgba(0, 0, 0, 0.5));
                    }
                }
            }

            .taper-line {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 0;
                width: 100%;
                height: 100px;
                background: linear-gradient(rgba(0, 0, 0, .4), transparent);
                pointer-events: none;
            }
        }

        .moving {

            .view,
            .tree,
            .morning,
            .afternoonn {
                transition: none;
            }
        }
    }
}

.header-channel-fixed {
    width: 100%;
    min-width: 1100px;
    max-width: 2560px;
    display: flex;
    justify-content: center;
    background: var(--bg1);
    z-index: 1001;
    position: fixed;
    top: 63px;
    letter-spacing: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .08);
    animation: headerSlideDown .2s linear forwards;
    --left_width: 140px;
    --left_width_item: 70px;
    --item_height: 28px;
}

.header-channel-fixed-container {
    margin: 0 auto;
    max-height: 56px;
    overflow: hidden;
    transition: max-height .2s;
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    padding: 14px var(--layout-padding, 60px) 14px var(--layout-padding, 30px);
}

.header-channel-fixed-down {
    max-height: 140px;
}

.header-channel-fixed-left {
    display: flex;
    min-width: var(--left_width);
    width: var(--left_width);
    flex-wrap: wrap;
    color: var(--text2);
    font-size: 14px;
    align-self: flex-start;
}

.left-fixed-channel {
    cursor: pointer;
    display: flex;
    width: var(--left_width_item);
    height: 28px;
    margin-bottom: 14px;
    align-items: center;

    &:hover {
        color: var(--brand_pink);

        .iconfont {
            color: var(--brand_pink);
        }
    }

    .iconfont {
        color: var(--text1);
        font-size: 21px;
        display: inline-block;
        position: relative;
        margin-right: 5px;
    }
}

.header-channel-fixed-center {
    height: 14px;
    width: 1px;
    margin-right: 10px;
    background: var(--line_regular);
}

.header-channel-fixed-right {
    display: inline-grid;
    flex: 1;
    height: 100%;
    position: relative;
}

.header-channel-fixed-right-left {
    display: inline-grid;
    position: relative;
}

.header-channel-fixed-right-right {
    display: inline-grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-flow: column;
    grid-template-rows: var(--item_height) var(--item_height);
    grid-column: span 3;
}

.left-top {
    display: inline-grid;
    grid-template-rows: repeat(2, 1fr);
    position: relative;
    grid-auto-flow: column;
}


.left-bottom {
    display: inline-grid;
    grid-template-rows: repeat(1, 1fr);
    position: relative;
}

.header-channel-fixed-right-item {
    height: var(--item_height);
    line-height: var(--item_height);
    border: 1px solid var(--line_regular);
    background: var(--graoh_bg_thin);
    border-radius: 6px;
    text-align: center;
    cursor: pointer;
    color: var(-text2);

    &:hover {
        background: var(--graph_bg_thick);
        transition: background 0.2s;
    }
}

.header-channel-fixed-arrow {
    position: absolute;
    right: calc(var(--layout-padding, 60px) - 40px);
    width: 28px;
    height: 28px;
    padding: 6px;
    margin-left: 10px;
    align-self: start;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: .2s;

    &:hover {
        background-color: var(--graph_bg_thick);
    }
}

.header-channel-fixed-right .left-bottom,
.header-channel-fixed-right-right,
.header-channel-fixed-right-left .left-top,
.header-channel-fixed-right {
    grid-gap: 14px 10px;
}

.left-top .header-channel-fixed-right-item:nth-of-type(23),
.left-top .header-channel-fixed-right-item:nth-of-type(24),
.left-top .header-channel-fixed-right-item:nth-of-type(26),
.left-bottom .header-channel-fixed-right-item:nth-of-type(23),
.left-bottom .header-channel-fixed-right-item:nth-of-type(24),
.left-bottom .header-channel-fixed-right-item:nth-of-type(26) {
    letter-spacing: 0px;
}

.main__layout {
    background: #fff;
    margin: 0 auto;
    padding: 0 var(--layout-padding);
    max-width: calc(1980px + 2*var(--layout-padding));
    width: 100%;
}

.recommended-container {
    padding-bottom: 60px;
}

.container {
    gap: 20px;
    display: grid;
    position: relative;
    width: 100%;
}

.recommended-swipe {
    position: relative;
    grid-column: 1/3; //第一列到第三列，占两个网格
    grid-row: 1/3;
    border: 1px solid red;
}

@media (max-width: 1366.9px) {

    .header-channel-fixed-right,
    .left-bottom {
        grid-column: span 12;
        grid-template-columns: repeat(12, 1fr);
    }

    .header-channel-fixed {
        --left_width: 128px;
        --left_width_item: 64px;
    }

    .header-channel-fixed-right-left,
    .left-top {
        grid-column: span 9;
        grid-template-columns: repeat(9, 1fr);
    }

    .left-top .header-channel-fixed-right-item:nth-of-type(1n + 19) {
        display: none;
    }

    .left-bottom .header-channel-fixed-right-item:nth-of-type(-1n + 18) {
        display: none !important;
    }


    .header-channel-fixed-right .left-bottom,
    .header-channel-fixed-right-right,
    .header-channel-fixed-right-left .left-top,
    .header-channel-fixed-right {
        font-size: 13px;
        grid-gap: 14px 8px;
    }

    .main__layout {
        width: 1020px;
    }
}

@media (max-width: 1399px) {
    .container {
        grid-column: span 4;
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 1367px) and (max-width: 1700.9px) {

    .header-channel-fixed-right,
    .left-bottom {
        grid-column: span 14;
        grid-template-columns: repeat(14, 1fr);
    }

    .header-channel-fixed-right-left,
    .left-top {
        grid-column: span 11;
        grid-template-columns: repeat(11, 1fr);
    }

    .left-top .header-channel-fixed-right-item:nth-of-type(1n + 23) {
        display: none !important;
    }

    .left-bottom .header-channel-fixed-right-item:nth-of-type(-1n + 22) {
        display: none !important;
    }
}

@media (min-width: 1701px) and (max-width: 2199.9px) {

    .header-channel-fixed-right,
    .left-bottom {
        grid-column: span 15;
        grid-template-columns: repeat(15, 1fr);
    }

    .header-channel-fixed {
        --left_width: 160px;
        --left_width_item: 80px;
    }

    .header-channel-fixed-right-left,
    .left-top {
        grid-column: span 12;
        grid-template-columns: repeat(12, 1fr);
    }


    .left-bottom .header-channel-fixed-right-item:nth-of-type(-1n + 24) {
        display: none !important;
    }

    .left-top .header-channel-fixed-right-item:nth-of-type(1n + 25) {
        display: none !important;
    }
}

@media (min-width: 1140px) {
    .main__layout {
        position: relative;
    }

    .recommended-container {
        position: relative;
    }

    .container {
        grid-column: span 5;
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (min-width: 2200px) {
    .header-channel-fixed-right {
        grid-column: span 17;
        grid-template-columns: repeat(17, 1fr);
    }

    .header-channel-fixed {
        --left_width: 160px;
        --left_width_item: 80px;
    }

    .header-channel-fixed-right-left,
    .left-top {
        grid-column: span 14;
        grid-template-columns: repeat(14, 1fr);
    }

    .header-channel-fixed-right .left-bottom {
        display: none;
    }
}

@keyframes headerSlideDown {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>