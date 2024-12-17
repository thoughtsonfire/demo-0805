<script setup lang="ts">
import { CircleCloseFilled, Female, Male, User, ArrowRightBold, Document, Star } from '@element-plus/icons-vue';
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { highlightKeyword } from '@/utils/utils';
import { userInfoStore } from '@/stores/userInfo';
import Login from '../login/Login.vue';

const userStore = userInfoStore()
//登录组件
const login = ref()
const props = defineProps({
    //固定头
    isFixHeaderBar: {
        type: Boolean,
        default: false
    }
})
// 需要搜索的内容
const searchInput = ref<string>('')
// 是否显示搜索气泡框
const isSearchPopShow = ref<boolean>(false)
// 是否正在输入中文
const isComposite = ref<boolean>(false)
// 首页是否展开频道
const isOpen = ref<boolean>(false)
//展开搜索气泡框
const isShowSearchInput = ref<boolean>(true)
// 是否展开搜索历史
const isHistoryOpen = ref<boolean>(false)
//输入框元素
const searchForm = ref<HTMLElement | null>()
//搜素气泡框元素
const searchPop = ref<HTMLElement | null>()
const screenWidth = ref<number>(window.innerWidth)
// 搜索历史
const histories = reactive<string[]>([
    "1搜索历史",
    "2搜索历史",
    "3搜索历史",
    "4搜索历史4搜索历史4搜索历史4搜索历史4搜索历史4搜索历史4搜索历史",
    "5搜索历史",
    "6搜索历史",
    "7搜索历史7搜索历史7搜索历史7搜索历史7搜索历史7搜索历史7搜索历史",
    "8搜索历史",
    "9搜索历史",
    "10搜索历史",
    "11搜索历史",
    "12搜索历史",
    "13搜索历史",
    "14搜索历史",
    "15搜索历史",
    "16搜索历史",
    "17搜索历史",
])
interface TrendingItem {
    content: string;
    type: number
}
// 热搜
const trendings = reactive<TrendingItem[]>([
    { content: "热搜1", type: 1 },
    { content: "热搜2", type: 2 },
    { content: "热搜3", type: 2 },
    { content: "热搜4", type: 1 },
    { content: "热搜5", type: 1 },
    { content: "热搜6", type: 2 },
    { content: "热搜7", type: 1 },
    { content: "热搜8", type: 1 },
    { content: "热搜9", type: 2 },
    { content: "热搜10", type: 2 }
])
// 搜索推荐词
const matchingWord = reactive<string[]>([
    "suggest1",
    "suggest2",
    "suggest3",
    "suggest4",
    "suggest5",
    "suggest6",
])
//头像气泡框的显隐
const popoverDisplay = ref<string>("none")
const isPopoverShow = ref<boolean>(false)
function noPage() {
    // console.log('111')
}
function searchPopShow() {
    isSearchPopShow.value = true
}
function handleInput() {

}
function goSearch() {

}
function compositionend() {

}
function searchPopHide() {
    isSearchPopShow.value = false
}
function handleOutsideClick(event: MouseEvent) {
    const formElement = searchForm.value
    const popoverElement = searchPop.value

    if (formElement && popoverElement && event.target instanceof Node) {
        if (!formElement.contains(event.target) && !popoverElement.contains(event.target)) {
            searchPopHide()
            // console.log('1111111111');

        }
    }

}
function removeAllHistories() {
    histories.length = 0
}
function removeHistory(index: number) {
    histories.splice(index, 1)
}
function updateScreenWidth() {
    screenWidth.value = window.innerWidth;
}
function highLightKeyWord(text: string) {
    return highlightKeyword(searchInput.value, text)
}
// 悬浮头像时，气泡的显隐
let inTimer = ref<number>(0)
let outTimer = ref<number>(0)
function handleMouseEnter() {
    clearTimeout(outTimer.value);     // 这里要清除隐藏的计时器，否则在0.2秒内出入头像，会导致头像变大但气泡突然消失
    inTimer.value = setTimeout(() => {
        popoverDisplay.value = "";
        isPopoverShow.value = true;
    }, 100);
}
function handleMouseLeave() {
    clearTimeout(inTimer.value);    // 清除显示计时器防止快速经过头像时的气泡闪烁
    isPopoverShow.value = false;
    inTimer.value = setTimeout(() => {
        popoverDisplay.value = "none";
    }, 100);
}
//登录
function loginFn() {
    login.value.loginDialogVisible = true
}
//退出登录
function logout() {
    userStore.setUserBaseInfo(null)
    userStore.setIsloading(false)
    localStorage.removeItem("Authorization")
    localStorage.removeItem("userBaseInfo")
}
onMounted(() => {
    window.addEventListener('click', handleOutsideClick)
    window.addEventListener('resize', updateScreenWidth);
})
onBeforeUnmount(() => {
    window.removeEventListener('click', handleOutsideClick)
    window.removeEventListener('resize', updateScreenWidth);
})
</script>

<template>
    <div class="header-bar" :class="props.isFixHeaderBar ? 'slide-down' : ''">
        <!-- 左侧 -->
        <div class="left-entry">
            <div class="entry-title test" v-if="props.isFixHeaderBar" @mouseleave="isOpen = false">
                <picture class="logo">
                    <img src="@/assets/imgs/teriteri-pink.png" alt="">
                </picture>
                <span>首页</span>
                <i class="iconfont icon-xiajiantou" :class="isOpen ? 'arrow - down' : ''"></i>
            </div>
            <div class="entry-title" v-else>
                <i class="iconfont icon-dianshi"></i>
                <span>首页</span>
            </div>
            <div class="default-entry" @click="noPage">
                <span>番剧</span>
            </div>
            <div class="default-entry" @click="noPage">
                <span>漫画</span>
            </div>
            <div class="default-entry" @click="noPage">
                <span>直播</span>
            </div>
            <div class="default-entry" @click="noPage">
                <span>游戏中心</span>
            </div>
            <div class="default-entry" @click="noPage">
                <span>会员购</span>
            </div>
            <div class="download-entry" @click="noPage" v-if="!props.isFixHeaderBar">
                <i class="iconfont icon-xiazai"></i>
                <span>下载客户端</span>
            </div>
        </div>
        <!-- 中间 -->
        <div class="center-search-container" :style="isShowSearchInput ? '' : 'display:none;'">
            <div class="center-search__bar" :class="isShowSearchInput ? 'is-focus' : ''">
                <!-- 输入框 -->
                <div ref="searchForm" id="nav-searchform" :class="isSearchPopShow ? 'nav-searchform-active' : ''">
                    <div class="nav-search-content">
                        <el-input class="nav-search-input" :class="isSearchPopShow ? 'nav-search-input-active' : ''"
                            v-model="searchInput" placeholder="请输入搜索内容" @focus="searchPopShow()" @keyup.enter="goSearch"
                            @input="handleInput" @compositionstart="isComposite = true"
                            @compositionend="compositionend"></el-input>
                    </div>
                    <div class="nav-search-clean" :style="searchInput == '' ? 'display: none;' : ''">
                        <el-icon size="16">
                            <CircleCloseFilled />
                        </el-icon>
                        <!-- <i class="el-icon-circle-close"></i> -->
                    </div>
                    <div class="nav-search-btn">
                        <i class="iconfont icon-sousuo"></i>
                    </div>
                </div>
                <!-- 气泡框 -->
                <div class="search-panel" :style="isSearchPopShow ? '' : 'display: none;'" ref="searchPop">
                    <div class="history" v-if="searchInput == ''">
                        <div class="header">
                            <div class="title">搜索历史</div>
                            <div class="clear" @click.stop="removeAllHistories">清空</div>
                        </div>
                        <div class="histories-wrap" :style="isHistoryOpen ? 'max-height:171px;' : 'max-height:91px;'">
                            <div class="histories">
                                <div class="history-item" v-for="(item, index) in histories" :key="index">
                                    <div class="history-text">
                                        {{ item }}
                                    </div>
                                    <div class="close" @click.stop="removeHistory(index)">
                                        <i class="iconfont icon-close"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="history-fold" v-if="isHistoryOpen" @click.stop="isHistoryOpen = false">
                            <div class="fold-text">收起</div>
                            <i class="iconfont icon-xiajiantou" style="transform: rotate(180deg);"></i>
                        </div>
                        <div class="history-fold" v-else @click.stop="isHistoryOpen = true;">
                            <div class="fold-text">展开更多</div>
                            <i class="iconfont icon-xiajiantou"></i>
                        </div>
                    </div>
                    <div class="trending" v-if="searchInput == ''">
                        <div class="header">
                            <div class="title">热搜推荐</div>
                        </div>
                        <div class="trendings-double" v-if="screenWidth >= 1450">
                            <div class="trendings-col" style="max-width: calc(50% - 5px);">
                                <div class="trending-item"
                                    v-for="(item, index) in trendings.filter((item, idx) => idx % 2 === 0)"
                                    :key="index">
                                    <div class="trending-wrap">
                                        <div class="trendings-rank" :class="index < 2 ? 'topThree' : ''">{{ index * 2 +
                                            1 }}</div>
                                        <div class="trendings-text">{{ item.content }}</div>
                                        <img class="trending-mark" src="@/assets/imgs/icon_new.png" alt=""
                                            v-if="item.type === 1">
                                        <img class="trending-mark" src="@/assets/imgs/icon_hot.png" alt=""
                                            v-if="item.type === 2">
                                    </div>
                                </div>
                            </div>
                            <div class="trendings-col" style="max-width: calc(50% - 5px);">
                                <div class="trending-item"
                                    v-for="(item, index) in trendings.filter((item, idx) => idx % 2 !== 0)"
                                    :key="index">
                                    <div class="trending-wrap">
                                        <div class="trendings-rank" :class="index < 2 ? 'topThree' : ''">{{ index * 2 +
                                            2 }}</div>
                                        <div class="trendings-text">{{ item.content }}</div>
                                        <img class="trending-mark" src="@/assets/imgs/icon_new.png" alt=""
                                            v-if="item.type === 1">
                                        <img class="trending-mark" src="@/assets/imgs/icon_hot.png" alt=""
                                            v-if="item.type === 2">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="trendings-double" v-else>
                            <div class="trendings-col" style="margin-right: unset;">
                                <div class="trending-item" v-for="(item, index) in trendings" :key="index">
                                    <div class="trending-wrap">
                                        <div class="trendings-rank" :class="index < 2 ? 'topThree' : ''">{{ index +
                                            1 }}</div>
                                        <div class="trendings-text">{{ item.content }}</div>
                                        <img class="trending-mark" src="@/assets/imgs/icon_new.png" alt=""
                                            v-if="item.type === 1">
                                        <img class="trending-mark" src="@/assets/imgs/icon_hot.png" alt=""
                                            v-if="item.type === 2">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="suggestions" v-if="searchInput != ''">
                        <div class="suggest-item" v-for="(item, index) in matchingWord" :key="index"
                            v-html="highLightKeyWord(item)"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 右侧 -->
        <div class="right-entry">
            <!-- 未登录状态 -->
            <div class="header-avatar-warp" v-if="!userStore.isLoading">
                <div class="default-login" @click="loginFn">登录</div>
            </div>
            <!-- 登录后显示头像 -->
            <div v-else class="header-avatar-warp" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
                <a href="" target="_blank" class="header-avatar-wrap--container mini-avatar--small">
                    <picture class="v-img">
                        <img :src="userStore.userBaseInfo.photo" alt="">
                    </picture>
                </a>
                <div class="v-popover to-bottom">
                    <div class="avatar-panel-popover" :class="isPopoverShow ? 'popoShow' : 'popHide'"
                        :style="{ display: popoverDisplay }">
                        <a href="" target="_blank" class="nick-name" :class="'vip-name'">
                            <span>{{ userStore.userBaseInfo.nickName }}</span>
                        </a>
                        <div class="vip-level-tag">
                            <div class="vip-tag">
                                {{
                                    userStore.userBaseInfo.vip === 3 ? '年度大会员' : userStore.userBaseInfo.vip === 2 ? '季度大会员'
                                        : userStore.userBaseInfo.vip === 1 ? '月度大会员' : '普通大会员'
                                }}
                            </div>
                            <div class="gender female" v-if="userStore.userBaseInfo.gender === 0">
                                <el-icon size="12">
                                    <Female />
                                </el-icon>
                            </div>
                            <div class="gender male" v-if="userStore.userBaseInfo.gender === 1">
                                <el-icon size="12">
                                    <Male />
                                </el-icon>
                            </div>
                        </div>
                        <div class="coins">
                            <span class="coins-text">硬币:</span>
                            <span class="coins-num">{{ userStore.userBaseInfo.coin }}</span>
                        </div>
                        <div class="counts">
                            <a class="counts-item" href="" target="_blank">
                                <div class="count-num">{{ userStore.userBaseInfo.attention }}</div>
                                <div class="count-text">关注</div>
                            </a>
                            <a class="counts-item" href="" target="_blank">
                                <div class="count-num">{{ userStore.userBaseInfo.fans }}</div>
                                <div class="count-text">粉丝</div>
                            </a>
                            <a class="counts-item" href="" target="_blank">
                                <div class="count-num">{{ userStore.userBaseInfo.dynamics }}</div>
                                <div class="count-text">动态</div>
                            </a>
                        </div>
                        <div class="single-item middle">
                            <div class="single-item-left">
                                <el-icon size="16">
                                    <User />
                                </el-icon>
                                <span>个人中心</span>
                            </div>
                            <el-icon>
                                <ArrowRightBold />
                            </el-icon>
                        </div>
                        <div class="single-item middle">
                            <div class="single-item-left">
                                <el-icon size="16">
                                    <Document />
                                </el-icon>
                                <span>投稿管理</span>
                            </div>
                            <el-icon>
                                <ArrowRightBold />
                            </el-icon>
                        </div>
                        <div class="single-item middle">
                            <div class="single-item-left">
                                <el-icon size="16">
                                    <Star />
                                </el-icon>
                                <span>推荐服务</span>
                            </div>
                            <el-icon>
                                <ArrowRightBold />
                            </el-icon>
                        </div>
                        <div class="placeholder"></div>
                        <div class="single-item logout" @click="logout">
                            <i class="iconfont icon-dengchu"></i>
                            <span>退出登录</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="v-popover-warp">
                <el-popover width="auto" :show-after="200" trigger="hover">
                    <template #reference>
                        <div class="vip-warp">
                            <div class="right-entry--outside">
                                <i class="iconfont icon-huiyuan1"></i>
                                <span>大会员</span>
                            </div>
                        </div>
                    </template>
                    <template #default>
                        <div v-if="userStore.isLoading">
                            登陆后的会员广告
                        </div>
                        <div v-else>
                            未登录的会员广告
                        </div>
                    </template>
                </el-popover>
            </div>
            <div class="v-popover-warp">
                <el-popover width="auto" :show-after="200" trigger="hover">
                    <template #reference>
                        <div class="right-entry--outside">
                            <div class="red-num--dynamic" v-if="userStore.isLoading">
                                3
                            </div>
                            <i class="iconfont icon-xinfeng"></i>
                            <span>消息</span>
                        </div>
                    </template>
                    <template #default>
                        <div class="message-entry-popover" v-if="userStore.isLoading">
                            <div class="message-inner-list">
                                <div class="message-inner-list__item">
                                    回复我的
                                    <span class="notify-number">99+</span>
                                </div>
                                <div class="message-inner-list__item">
                                    @ 我的
                                    <span class="notify-number">99+</span>
                                </div>
                                <div class="message-inner-list__item">
                                    收到的赞
                                    <span class="notify-number"></span>
                                </div>
                                <div class="message-inner-list__item">
                                    系统消息
                                    <span class="notify-number"></span>
                                </div>
                                <div class="message-inner-list__item">
                                    我的
                                    消息
                                    <span class="notify-number"></span>
                                </div>
                            </div>
                        </div>
                        <div class="not-login" v-else>
                            <p class="not-login-tips">登录即可查看关注动态</p>
                            <div class="not-login-btn" @click="loginFn">
                                立即登录
                            </div>
                        </div>
                    </template>

                </el-popover>
            </div>
            <div class="v-popover-warp">
                <el-popover width="auto" :show-after="200" trigger="hover">
                    <template #reference>
                        <div class="right-entry--outside">
                            <div class="red-num--dynamic" v-if="userStore.isLoading">
                                10
                            </div>
                            <i class="iconfont icon-fengche"></i>
                            <span>动态</span>
                        </div>
                    </template>
                    <template #default>
                        <div v-if="userStore.isLoading">
                            关注动态
                        </div>
                        <div class="not-login" v-else>
                            <p class="not-login-tips">登录即可查看关注动态</p>
                            <div class="not-login-btn" @click="loginFn">
                                立即登录
                            </div>
                        </div>
                    </template>
                </el-popover>
            </div>
            <div class="v-popover-warp">
                <el-popover width="auto" :show-after="200" trigger="hover">
                    <template #reference>
                        <div class="right-entry--outside">
                            <i class="iconfont icon-shoucang"></i>
                            <span>收藏</span>
                        </div>
                    </template>
                    <template #default>
                        <div v-if="userStore.isLoading">
                            我的收藏
                        </div>
                        <div class="not-login" v-else>
                            <p class="not-login-tips">登录即可查看我的收藏</p>
                            <div class="not-login-btn" @click="loginFn">
                                立即登录
                            </div>
                        </div>
                    </template>
                </el-popover>
            </div>
            <div class="v-popover-warp">
                <el-popover width="auto" :show-after="200" trigger="hover">
                    <template #reference>
                        <div class="right-entry--outside">
                            <i class="iconfont icon-lishijilu"></i>
                            <span>历史</span>
                        </div>
                    </template>
                    <template #default>
                        <div v-if="userStore.isLoading">
                            历史记录
                        </div>
                        <div class="not-login" v-else>
                            <p class="not-login-tips">登录即可查看历史记录</p>
                            <div class="not-login-btn" @click="loginFn">
                                立即登录
                            </div>
                        </div>
                    </template>
                </el-popover>
            </div>
            <div class="right-entry-item">
                <div class="right-entry--outside">
                    <i class="iconfont icon-dengpao"></i>
                    <span>创作中心</span>
                </div>
            </div>
            <div class="right-entry-item right-entry-item--upload">
                <div class="upload-buttom">
                    <i class="iconfont icon-shangchuan"></i>
                    <span>投稿</span>
                </div>
            </div>
        </div>
    </div>
    <login ref="login"></login>
</template>

<style scoped lang="scss">
@mixin entry {
    height: 64px;
    line-height: 64px;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    margin-right: 15px;
}

@keyframes shrink {
    to {
        transform: scale(1);
        /* 缩小到原始大小 */
    }
}

/* 淡入动画 */
@keyframes fade-in {
    0% {
        opacity: 0;
        /* 初始状态透明 */
        transform: translateY(-10px);
        /* 向上平移 10px，将元素隐藏在顶部 */
    }

    100% {
        opacity: 1;
        /* 最终状态不透明 */
        transform: translateY(0);
        /* 平移恢复到原始位置 */
    }
}

.header-bar {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1002;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    max-width: var(--v-max-w);
    width: 100%;
    height: 64px;

    .left-entry {
        // border: 1px solid #ccc; // 查看位置
        display: flex;
        align-items: center;
        /*容器空间不足时不缩小，即固定大小*/
        flex-shrink: 0;
        margin-right: 20px;

        .entry-title {
            @include entry;
            display: flex;
            align-items: center;

            .icon-dianshi,
            .icon-xiazai {
                margin-right: 5px;
            }

            .logo {
                height: 40%;
                display: flex;
                align-items: center;
                margin-right: 10px;

                img {
                    height: 100%;
                }

            }
        }

        .default-entry {
            @include entry;

            &:hover span {
                animation: jump 0.3s;
            }

            span {
                display: inline-block;
                position: relative;
            }
        }

        .download-entry {
            @include entry;
        }
    }

    .center-search-container {
        // border: 1px solid gold; //查看位置
        flex: 1 auto; //查一下gpt说的不准却 左右不被压缩，中部适应大小
        height: 40px;

        .center-search__bar {
            position: relative;
            margin: 0 auto;
            min-width: 181px;
            max-width: 500px;

            #nav-searchform {
                display: flex;
                align-items: center;
                padding: 0 48px 0 4px;
                position: relative;
                z-index: 1;
                overflow: hidden;
                border: 1px solid var(--line_regular);
                height: 40px;
                border-radius: 8px;
                background-color: var(--graph_bg_regular);
                opacity: .9;
                transition: background-color .3s;

                .nav-search-content {
                    flex: 1;

                    .nav-search-input {
                        ::v-deep .el-input__wrapper {
                            background-color: #FFFFFF00;
                            border-radius: 6px;
                            box-shadow: none;
                            padding: 1px 30px 1px 11px;
                        }

                        ::v-deep .el-input__inner {
                            color: var(--text2);
                        }

                        ::v-deep .el-input__inner:focus {
                            color: var(--text1);
                        }
                    }

                    .nav-search-input-active {
                        ::v-deep .el-input__wrapper {
                            background-color: #0000001A;
                        }
                    }
                }

                .nav-search-clean {
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    right: 55px;
                    cursor: pointer;
                    color: var(--graph_weak);

                    &:hover {
                        color: var(--graph_icon);
                    }
                }

                .nav-search-btn {
                    position: absolute;
                    right: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    color: var(--text1);
                    line-height: 32px;
                    cursor: pointer;
                    transition: background-color .3s;

                    &:hover {
                        background-color: var(--graph_bg_thick);
                    }
                }
            }

        }

        .is-focus {
            box-shadow: 0 0 30px rgba(0, 0, 0, .1);
            border-radius: 8px;

            #nav-searchform {
                background-color: #fff;
                border-bottom: none;
            }

            .nav-searchform-active {
                transition: background-color 0s !important;
                border-radius: 8px 8px 0 0 !important;
            }

            .search-panel {
                width: 100%;
                max-width: 612px;
                overflow-y: auto;
                background: var(--bg1);
                border: 1px solid var(--line_regular);
                border-top: none;
                border-radius: 0 0 8px 8px;
                padding: 13px 0 16px;
                -webkit-font-smoothing: antialiased;

                .history,
                .trending {
                    .header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 16px;

                        .title {
                            height: 24px;
                            font-size: 16px;
                            line-height: 24px;
                        }

                        .clear {
                            font-size: 12px;
                            line-height: 15px;
                            height: 15px;
                            cursor: pointer;
                            color: var(--text3);

                            &:hover {
                                color: var(--text2);
                            }
                        }
                    }
                }

                .history {
                    .histories-wrap {
                        padding: 0 16px;
                        overflow: hidden;

                        .histories {
                            display: flex;
                            flex-wrap: wrap;
                            margin-top: 12px;
                            margin-bottom: 4px;

                            .history-item {
                                position: relative;
                                height: 30px;
                                padding: 7px 10px 8px;
                                font-size: 12px;
                                line-height: 15px;
                                background: var(--graph_bg_thin);
                                border-radius: 4px;
                                margin-right: 10px;
                                margin-bottom: 10px;
                                cursor: pointer;

                                &:hover .close {
                                    display: block;
                                }

                                .history-text {
                                    white-space: nowrap;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    max-width: 96px;
                                    color: var(--text2);

                                    &:hover {
                                        color: var(--brand_pink);
                                    }
                                }

                                .close {
                                    display: none;
                                    box-sizing: border-box;
                                    position: absolute;
                                    width: 13px;
                                    height: 13px;
                                    top: -6px;
                                    right: -3px;
                                    padding: 2px;

                                    i {
                                        font-size: 10px;
                                        color: #fff;
                                        background-color: #ccc;
                                        border-radius: 50%;
                                    }
                                }
                            }
                        }
                    }

                    .history-fold {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 70px;
                        margin: 0 auto 14px;
                        color: var(--text3);
                        cursor: pointer;

                        &:hover {
                            color: var(--brand_pink);
                        }

                        .fold-text {
                            font-size: 12px;
                            line-height: 15px;
                            height: 15px;
                        }
                    }
                }

                .trending {

                    .trendings-double {
                        display: flex;

                        .trendings-col {
                            flex: 1;

                            &:first-child {
                                margin-right: 10px;
                            }

                            .trending-item {


                                &:hover {
                                    background-color: var(--graph_bg_thick);
                                }

                                .trending-wrap {
                                    height: 38px;
                                    display: flex;
                                    align-items: center;
                                    cursor: pointer;
                                    padding-left: 16px;

                                    .trendings-rank {
                                        margin-right: 10px;
                                        color: var(--text3);
                                    }

                                    .topThree {
                                        color: var(--text2) !important;
                                    }

                                    .trendings-text {
                                        font-size: 14px;
                                        line-height: 17px;
                                        height: 17px;
                                        margin-right: 6px;
                                        white-space: nowrap;
                                        overflow: hidden;
                                        text-overflow: ellipsis;
                                        letter-spacing: 0;
                                        color: var(--text2);
                                    }

                                    .trending-mark {
                                        height: 14px;
                                        margin-right: 16px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    .right-entry {
        display: flex;
        align-items: center;
        margin-left: 20px;
        flex-shrink: 0; //容器空间不足时不缩小，即固定大小

        .header-avatar-warp {
            position: relative;
            box-sizing: content-box;
            margin-right: 10px;
            width: 50px;
            height: 50px;
            cursor: pointer;

            &:hover {
                .mini-avatar--small {
                    top: 15px;
                    left: -35px;
                    width: 90px;
                    height: 90px;
                }
            }

            .header-avatar-wrap--container {
                z-index: 2;
            }

            .mini-avatar--small {
                position: absolute;
                top: 5px;
                left: 10px;
                z-index: 2;
                display: block;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                box-sizing: border-box;
                border: 2px solid #fff;
                transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease;
                /* 添加平滑过渡效果 */
                animation: shrink 0.3s both;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    image-rendering: -webkit-optimize-contrast;
                }
            }

            .v-popover {
                position: absolute;
                z-index: 1;
                padding-top: 20px;
                margin-left: -20px;
                cursor: default;
            }

            .to-bottom {
                top: 100%;
                left: 50%;
                transform: translate3d(-50%, 0, 0);
                /* 水平左移半个元素身位，使其水平与父元素居中 */

                .avatar-panel-popover {
                    width: 300px;
                    background-color: #fff;
                    border-radius: 8px;
                    padding: 0 24px 18px;
                    box-shadow: 0 0 30px rgba(0, 0, 0, .1);
                    border: 1px solid var(--line_regular);

                    .nick-name {
                        display: flex;
                        justify-content: center;
                        margin-top: 50px;
                        margin-bottom: 6px;
                        font-size: 18px;
                        color: var(--text1);
                    }
                }

                .popShow {
                    animation: fade-out 0.2s ease-out forwards;
                    transform-origin: top;
                    /* 设置动画的旋转点为顶部 */
                }

                .popHide {
                    animation: fade-out 0.2s ease-out forwards;
                    transform-origin: top;
                    /* 设置动画的旋转点为顶部 */
                }

                .vip-level-tag {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .vip-tag {
                        display: inline-block;
                        max-width: 58px;
                        height: 16px;
                        color: #fff;
                        background: var(--brand_pink);
                        border-radius: 2px;
                        line-height: 16px;
                        font-size: 10px;
                        padding: 0 3px;
                        margin-right: 10px;
                        overflow: hidden;
                        white-space: nowrap;
                        font-weight: 400;
                        cursor: pointer;
                    }

                    .gender {
                        height: 14px;
                        width: 14px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .female {
                        background-color: var(--Pi2);
                        color: var(--Pi5);
                    }

                    .male {
                        background-color: var(--Lb2);
                        color: var(--Lb5_u);
                    }

                    .iconfont {
                        font-size: 12px;
                        margin-right: 10px;
                        line-height: 14px;
                    }
                }

                .coins {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    margin: 6px 0;

                    .coins-text {
                        margin-right: 5px;
                        color: var(--text3);
                    }

                    .coins-num {
                        color: var(--text1);
                    }
                }

                .counts {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    margin: 6px 0 12px 0;

                    .counts-item {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        width: fit-content;

                        &:hover {

                            .count-num,
                            .count-text {
                                color: var(--brand_pink);
                            }
                        }

                        .count-num {
                            font-size: 18px;
                            color: #222222;
                            transition: 0.3s;
                        }

                        .count-text {
                            font-size: 12px;
                            color: var(--text3);
                            margin-top: 2px;
                            transition: 0.3s;
                        }
                    }
                }

                .single-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 14px;
                    height: 38px;
                    border-radius: 8px;
                    color: var(--text2);
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color .3s;
                    margin-bottom: 2px;

                    &:hover {
                        background-color: var(--graph_bg_regular);
                    }

                    .single-item-left {
                        display: flex;
                        align-items: center;
                    }

                    span {
                        line-height: 14px;
                        margin-left: 10px;
                    }
                }

                .placeholder {
                    margin: 6px 0 12px 0;
                    border-bottom: 1px solid #ddd;
                }

                .logout {
                    display: flex;
                    justify-content: initial !important;
                }
            }

            .default-login {
                position: absolute;
                top: 5px;
                left: 10px;
                z-index: 2;
                display: block;
                width: 38px;
                height: 38px;
                border-radius: 50%;
                background-color: var(--Pi4);
                text-align: center;
                line-height: 38px;
                color: rgba(255, 255, 255, 0.9);
            }
        }

        .right-entry--outside {
            position: relative;
            display: flex;
            align-items: center;
            flex-direction: column; //主轴从上到下
            flex-shrink: 0;
            margin-right: 0;
            min-width: 50px;
            text-align: center;
            font-size: 13px;
            color: #fff;
            cursor: pointer;

            .iconfont {
                font-size: 20px;
                display: inline-block;
                position: relative;
            }

            &:hover .iconfont {
                animation: jump 0.3s;
            }

            .red-num--dynamic {
                position: absolute;
                cursor: auto;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                z-index: 1;
                top: -5px;
                left: 25px;
                padding: 0 4px;
                min-width: 15px;
                border-radius: 10px;
                background-color: var(--stress_red);
                color: #fff;
                font-size: 12px;
                line-height: 15px;
            }
        }

        .right-entry-item--upload {
            margin-left: 15px;

            .upload-buttom {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 16px;
                width: 90px;
                height: 34px;
                border-radius: 8px;
                background: #fb7299;
                color: #fff;
                text-align: center;
                font-size: 14px;
                line-height: 34px;
                cursor: pointer;
                transition: background-color .3s;

                &:hover {
                    background-color: #f992af;
                }
            }
        }
    }
}

.not-login {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    padding: 22px 20px;
    width: 340px;

    .not-login-tips {
        margin-bottom: 24px;
        font-size: 14px;
        line-height: 20px;
        text-align: center;
        color: var(--text3);
    }

    .not-login-btn {
        border-radius: 8px;
        color: #fff;
        background-color: var(--brand_pink);
        height: 40px;
        width: 100%;
        text-align: center;
        line-height: 40px;
        cursor: pointer;
        transition: 0.3s;
    }
}

.message-entry-popover {
    overflow: hidden;
    width: 142px;

    .message-inner-list {
        display: flex;
        flex-direction: column;
        padding: 12px 0;

        .message-inner-list__item {
            position: relative;
            display: flex;
            align-items: center;
            padding: 10px 0 10px 27px;
            color: var(--text2);
            text-align: left;
            font-size: 14px;
            transition: background-color .3s;
            cursor: pointer;

            &:hover {
                background-color: var(--graph_bg_thick);
            }

            .notify-number {
                position: absolute;
                right: 17px;
                padding: 0 5px;
                border-radius: 8px;
                background: var(--stress_red);
                color: #fff;
                font-size: 12px;
                line-height: 16px;
            }
        }
    }
}

.slide-down {
    position: fixed;
    top: 0;
    left: unset;
    animation: headerSlideDown .3 linear forwards;
    background: var(--bg1);
    box-shadow: inset 0 -1px 0 var(--line_regular) !important;
    // background: var(--bg1_float);

    .entry-title,
    .default-entry,
    .download-entry {
        color: var(--text1) !important;
    }

    .right-entry--outside {
        color: var(--text2) !important;

        .iconfont {
            color: var(--text1) !important;
        }
    }
}






/* 跳动效果 */
@keyframes jump {

    0%,
    100% {
        transform: translateY(0);
        /* 起始和结束状态，图标回到原位 */
    }

    50% {
        transform: translateY(-5px);
        /* 中间状态，图标向上跳动 5px */
    }
}

@media (max-width: 1279.9px) {
    .header-bar {
        .left-entry {
            margin-right: 10px;

            .entry-title,
            .default-entry {
                margin-right: 5px !important;
            }
        }

        .right-entry {
            margin-left: 10px;

            .right-entry--outside,
            .right-entry-item {
                margin: 0 5px;
                min-width: 25px;

                .upload-buttom {
                    width: 34px;
                    height: 34px;
                    margin-left: 0;

                    .icon-shangchuan {
                        margin-right: 0;
                    }

                    span {
                        display: none;
                    }
                }

                span {
                    display: none;
                }

                .red-num--dynamic {
                    left: 17px;
                }

            }
        }
    }
}
</style>