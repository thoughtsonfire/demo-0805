<script setup lang="ts">
import { reactive } from 'vue';
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
    }
])
const openNewPage = (data: string) => {
    console.log(data);
}
</script>

<template>
    <div class="header-channel">
        <!-- 左侧 -->
        <div class="channel-icons">
            <div class="channel-icons__item">
                <div class="icon-bg icon-bg__dynamic">
                    <picture class="v-img icon-bg--up" v-if="true">
                        <img src="https://cdn.acwing.com/media/user/profile/photo/240972_md_e16c066264.jpg" alt="">
                    </picture>
                    <i class="iconfont icon-fengche" v-else></i>
                </div>
                <div class="icon-title">动态</div>
            </div>
            <div class="channel-icons__item">
                <div class="icon-bg icon-bg__popular">
                    <i class="iconfont icon-huo"></i>
                </div>
                <span class="icon-title">热门</span>
            </div>
        </div>
        <!-- 右侧 -->
        <div class="right-channel-container">
            <!-- 中间频道 -->
            <div class="channel-items__left">
                <!-- 番剧 -->
                <el-popover placement="top">
                    <template #reference>
                        <div class="channel-link" @click="openNewPage(`/v/${channels[0].mcId}`)">
                            <span>{{ channels[0].mcName }}</span>
                        </div>
                    </template>
                    <div class="channel-children-container">
                        <div class="sub-item" v-for="subIndex in Math.ceil(channels[0].scList.length / 4)"
                            :key="subIndex">
                            <div @click="openNewPage(`/v/${child.mcId}/${child.scId}`)" class="channel-children"
                                v-for="(child, chIndex) in channels[0].scList.slice((subIndex - 1) * 4, subIndex * 4)"
                                :key="chIndex">
                                {{ child.scName }}
                            </div>
                        </div>
                    </div>
                </el-popover>
                <div class="channel-link" @click="openNewPage(`/movie`)">
                    <span>电影</span>
                </div>
                <el-popover placement="top">
                    <template #reference>
                        <div class="channel-link" @click="openNewPage(`/v/${channels[0].mcId}`)">
                            <span>{{ channels[1].mcName }}</span>
                        </div>
                    </template>
                    <div class="channel-children-container">
                        <div class="sub-item" v-for="subIndex in Math.ceil(channels[0].scList.length / 4)"
                            :key="subIndex">
                            <div @click="openNewPage(`/v/${child.mcId}/${child.scId}`)" class="channel-children"
                                v-for="(child, chIndex) in channels[0].scList.slice((subIndex - 1) * 4, subIndex * 4)"
                                :key="chIndex">
                                {{ child.scName }}
                            </div>
                        </div>
                    </div>
                </el-popover>
                <div class="channel-link" @click="openNewPage(`/movie`)">
                    <span>电视剧</span>
                </div>
                <div class="channel-link" @click="openNewPage(`/variety`)">
                    <span>综艺</span>
                </div>
                <div class="channel-link" @click="openNewPage(`/documentary`)">
                    <span>记录片</span>
                </div>
                <el-popover v-for="(item, index) in channels.slice(2)" :key="index"
                    :placement="index % 2 == 0 ? 'top' : 'bottom'">
                    <template #reference>
                        <div class="channel-link" @click="openNewPage(`/v/${item.mcId}`)">
                            <span>{{ item.mcName }}</span>
                        </div>
                    </template>
                    <div class="channel-children-container">
                        <div class="sub-item" v-for="subIndex in Math.ceil(item.scList.length / 4)" :key="subIndex">
                            <div @click="openNewPage(`/v/${child.mcId}/${child.scId}`)" class="channel-children"
                                v-for="(child, chIndex) in channels[0].scList.slice((subIndex - 1) * 4, subIndex * 4)"
                                :key="chIndex">
                                {{ child.scName }}
                            </div>
                        </div>
                    </div>
                </el-popover>
                <div class="channel-link" @click="openNewPage(`/v/life/daily`)">
                    <span>VLOG</span>
                </div>
                <div class="channel-link" @click="openNewPage(`/v/life/funny`)">
                    <span>搞笑</span>
                </div>
                <div class="channel-link" @click="openNewPage(`/v/game/stand_alone`)">
                    <span>单机游戏</span>
                </div>
                <div class="channel-link" @click="openNewPage(`/love`)">
                    <span>公益</span>
                </div>
                <div class="channel-link" @click="openNewPage(`/mooc`)">
                    <span>公开课</span>
                </div>
                <el-popover placement="bottom">
                    <template #reference>
                        <div class="channel-entry-more__link" @click="openNewPage(`/v/${channels[0].mcId}`)">
                            <span>更多</span>
                        </div>
                    </template>
                    <div class="channel-children-container">
                        <div class="sub-item" v-for="subIndex in Math.ceil(channels[0].scList.length / 4)"
                            :key="subIndex">
                            <div @click="openNewPage(`/v/${child.mcId}/${child.scId}`)" class="channel-children"
                                v-for="(child, chIndex) in channels[0].scList.slice((subIndex - 1) * 4, subIndex * 4)"
                                :key="chIndex">
                                {{ child.scName }}
                            </div>
                        </div>
                    </div>
                </el-popover>
            </div>
            <!-- 右侧右边 -->
            <div class="channel-items__right">
                <div class="channel-link__right" @click="openNewPage(`/read/home`)">
                    <i class="iconfont icon-zhuanlan"></i>
                    <span>专栏</span>
                </div>
                <div class="channel-link__right" @click="openNewPage(`/live`)">
                    <i class="iconfont icon-zhibo"></i>
                    <span>直播</span>
                </div>
                <div class="channel-link__right" @click="openNewPage(`/activity`)">
                    <i class="iconfont icon-huodong"></i>
                    <span>活动</span>
                </div>
                <div class="channel-link__right" @click="openNewPage(`/cheese`)">
                    <i class="iconfont icon-ketang"></i>
                    <span>课堂</span>
                </div>
                <div class="channel-link__right" @click="openNewPage(`/community`)">
                    <i class="iconfont icon-gonggao"></i>
                    <span>社区中心</span>
                </div>
                <div class="channel-link__right" @click="openNewPage(`/song`)">
                    <i class="iconfont icon-xinge"></i>
                    <span>新歌热榜</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.header-channel {
    position: relative;
    width: 100%;
    max-width: calc(1980px + 2* var(--layout-padding));
    margin: 0 auto;
    padding: 0 var(--layout-padding);
    display: flex;
    align-items: center;
    background: var(--bg1);
}

// 左侧
.channel-icons {
    z-index: 0;
    display: flex;
    align-items: center;
}

.channel-icons__item {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-right: 16px;
    color: var(--text1);
    cursor: pointer;
}

.icon-bg {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 6px;
    border-radius: 50%;
    transition: background-color .3s;
    color: #fff;
}

.icon-bg__dynamic {
    background: #48cc69;

    &:hover {
        background: #6eda89;
    }
}

.v-img {
    position: relative;
    display: inline-block;
    line-height: 1;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    background-color: var(--graph_bg_regular);
}

.icon-bg--up {
    overflow: hidden;
    border-radius: 50%;

    img {
        border-radius: 50%;
        display: block;
        width: 100%;
        height: 100%;
        object-fit: inherit;
    }
}

.icon-title {
    text-align: center;
    font-size: 13px;
    line-height: 18px;
}

.icon-bg__popular {
    background: #f07775;

    &:hover {
        background: #eb908f;
    }
}

// 右侧
.right-channel-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    // border: 1px solid #48cc69;
}

//中间频道
.channel-items__left {
    position: relative;
    display: grid;
    width: 100%;
    grid-auto-flow: column;
    grid-column: span 4;
    gap: 10px;
    grid-template-rows: repeat(2, 1fr);
    border-right: 1px solid var(--line_regular);
}

.channel-link,
.channel-entry-more__link {
    display: inline-block;
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    border: 1px solid var(--line_light);
    border-radius: 6px;
    background-color: var(--graph_bg_thin);
    color: var(--text2);
    text-align: center;
    font-weight: 400;
    transition: background-color .3s, color .3s;
}

// 右侧右边
.channel-items__right {
    display: grid;
    grid-auto-flow: column;
    grid-row-gap: 10px;
    grid-column: span 1; //grid-column: auto / span 1;简写
    grid-template-rows: repeat(2, 1fr);
    flex-shrink: 0;
}

.channel-link__right {
    letter-spacing: 2px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 100%;
    color: var(--text2);
    text-align: center;
    font-weight: 400;
    transition: color .3s;
    cursor: pointer;

    &:hover {
        color: var(--brand_pink);
    }
}

// 媒体查询

@media (max-width: 1099.9px) {
    .channel-icons__item {
        margin-right: 10px;
    }

    .channel-items__right {
        width: 210px;
    }

    .channel-link,
    .channel-entry-more__link {
        font-size: 13px;
        height: 22px;
        line-height: 22px;
    }

    .channel-link:nth-of-type(1n + 18) {
        display: none !important;
        /* 第18个元素及之后的隐藏 */
    }
}

@media (max-width: 1139.9px) {
    .header-channel {
        width: 1020px;
    }
}

@media (max-width: 1366.9px) {
    .header-channel {
        height: 100px;
    }

    .channel-icons {
        margin-right: 4px;
    }

    .icon-bg {
        width: 40px;
        height: 40px;
    }

    .channel-link__right {
        font-size: 13px;
        height: 28px;
    }

    .channel-items__left {
        padding-right: 20px;
        grid-template-columns: repeat(9, 1fr);
    }
}

@media (min-width: 1100px) and (max-width: 1366.9px) {
    .channel-icons__item {
        margin-right: 16px;
    }

    .channel-items__right {
        width: 230px;
    }

    .channel-link,
    .channel-entry-more__link {
        font-size: 13px;
        height: 26px;
        line-height: 26px;
    }

    .channel-link:nth-of-type(1n + 18) {
        display: none !important;
        /* 第18个元素及之后的隐藏 */
    }
}

@media (min-width: 1367px) and (max-width: 1700.9px) {
    .header-channel {
        height: 110px;
    }

    .channel-icons {
        margin-right: 8px;
    }

    .channel-items__right {
        width: 240px;
    }

    .channel-items__left {
        padding-right: 30px;
        grid-template-columns: repeat(11, 1fr);
    }

    .channel-link,
    .channel-entry-more__link {
        font-size: 14px;
        height: 26px;
        line-height: 26px;
    }

    .channel-link:nth-of-type(1n + 24) {
        display: none !important;
        /* 第22个元素及之后的隐藏 */
    }
}

@media (min-width: 1701px) and (max-width: 2199.9px) {
    .header-channel {
        height: 120px;
    }

    .channel-icons {
        margin-right: 20px;
    }

    .channel-link__right {
        font-size: 14px;
        height: 32px;
    }

    .channel-link,
    .channel-entry-more__link {
        font-size: 14px;
        height: 30px;
        line-height: 30px;
    }

    .channel-link:nth-of-type(1n + 24) {
        display: none !important;
        /* 第24个元素及之后的隐藏 */
    }
}

@media (min-width: 1367px) and (max-width: 2199.9px) {
    .icon-title {
        font-size: 14px;
        line-height: 20px;
    }

    .channel-icons__item {
        margin-right: 24px;
    }

    .channel-items__left {
        padding-right: 30px;
        grid-template-columns: repeat(12, 1fr);
    }
}

@media (min-width: 1367px) {
    .icon-bg {
        width: 46px;
        height: 46px;
    }
}

@media (min-width: 1701px) {
    .channel-items__right {
        width: 258px;
    }
}

@media (min-width: 2200px) {
    .header-channel {
        height: 130px;
    }

    .channel-icons {
        margin-right: 20px;
    }

    .channel-icons__item {
        margin-right: 32px;
    }

    .icon-title {
        font-size: 15px;
        line-height: 20px;
    }

    .channel-link__right {
        font-size: 15px;
        height: 32px;
    }

    .channel-items__left {
        padding-right: 30px;
        grid-template-columns: repeat(14, 1fr);
    }

    .channel-link,
    .channel-entry-more__link {
        font-size: 15px;
        height: 30px;
        line-height: 30px;
    }
}
</style>