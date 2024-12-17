<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, reactive, onBeforeMount, watch, computed, onBeforeUnmount, onMounted } from 'vue'
import SliderRow from '../slider/SliderRow.vue';
import ColorPicker from '../color/ColorPicker.vue';
import PlayerProgress from './PlayerProgress.vue';
import SliderColumn from '../slider/SliderColumn.vue';
import LoadingBuff from './LoadingBuff.vue';
import PlayerLoading from './PlayerLoading.vue';
import api from '@/request/api';
const v_id = ref<number>(1)
const videoUrl = ref<string>(new URL('@/assets/video/flower.webm', import.meta.url).href) //视频地址
const title = ref<string>("这个是标题") //视频标题
const duration = ref<number>(0)     //视频总时长
const user = reactive({             //up主资料
    uid: 111111,
    avatar_url: new URL('@/assets/imgs/dianzan.gif', import.meta.url).href
})

const population = ref<number>(999) // 当前观看人数

const wrapSize = reactive({         //容器大小
    width: 704,
    height: 442,
})
const setting = reactive({
    loop: false, // 是否开启循环
    autoplay: true, // 是否自动播放
    autonext: false,  // 是否自动连播
})
const dmStyle = reactive({
    fontsize: 25,   // 18 小号 25 标准
    mode: 1,    // 1 滚动 2 顶部 3底部
    color: '#FFFFFF',   // 字体颜色，6位16进制标准格式
})
const dmSetting = reactive({
    opacity: 100,     // 弹幕透明度 
    dmSpeed: 2,   // 弹幕滚动速度，1慢速75px/s 2正常150px/s 4快速300px/s
    rate: 75        //75px/s
})
const videoPlayer = ref()   //视频元素
const pause = ref<boolean>(false)   // 视频是否暂停中
const buff = ref<boolean>(false)  // 视频是否正在缓冲
const screenType = ref<string>('normal')    // 屏幕类型，normal 正常模式 web 网页全屏 full 屏幕全屏
const ctrlHidden = ref<boolean>(true)   // 控制器是否隐藏
const canPlay = ref<boolean>(false)     // 视频可以播放了
const videoSize = ref<number>(0)         // 视频字节大小
const bufferSpeed = ref<number>(0.00)  // 缓冲网速 KB/s
const lastByte = ref<number>(0)        //上次缓冲字节大小
const lastTimePoint = ref<number>(0)    // 上一个播放时间点，用于筛选将展示的弹幕
const dmIndex = ref<number>(-1)         // 当前时间点之前的最后一个弹幕的指针，播放更新的时候这个弹幕及之前的都不会展示（使用索引可以提升筛选效率，前提是根据时间点排序的弹幕列表）
import dmJson from '@/assets/json/dm.json'
const dmList = ref(dmJson)         //弹幕列表
const rollRow = ref<Array<number>>(new Array(12).fill(-1))  // 滚动模式下用于记录每一行上一个弹幕的全呈现时间
const topRow = ref<Array<number>>(new Array(12).fill(-1))   // 顶部模式下用于记录每一行上一个弹幕的结束时间
const bottomRow = ref<Array<number>>(new Array(12).fill(-1))    // 底部模式下用于记录每一行上一个弹幕的结束时间
const currentTime = ref<number>(0)  // 当前播放时间
const bufferPer = ref<number>(0)   // 缓冲百分比 0~1
const currentPer = ref<number>(0)   //进度条百分比0~1
const danmuOpen = ref<boolean>(true)    // 是否开启弹幕
const hideCtrlTimer = ref<number>(0);  // 隐藏控制器的计时器
const clickTimer = ref<number>(0); // 单击播放/暂停事件的防抖计时器
const dmTips = ref<boolean>(false)   // 弹幕按钮快捷提示是否显示
const dmOpacityOrder = ref<boolean>(false)  // 更新弹幕不透明度slider的命令
const showDmInput = ref<boolean>(false)     // 是否显示全屏状态下的弹幕输入框
const input = ref<string>('')   //要发送的弹幕内容
const playbackrate = ref<string>('倍速')   // 倍速文本
const isMuted = ref<boolean>(false)     // 是否静音
const volumeOrder = ref<boolean>(false) // 更新音量slider的命令
const volume = ref<number>(35)     // 音量
const fullTips = ref<boolean>(false)  // 全屏按钮快捷提示是否显示

//元数据加载完毕 可以播放了
const videoCanPlay = async () => {
    canPlay.value = true
    const durationInSeconds = videoPlayer.value.duration
    duration.value = durationInSeconds //-----测试用后删除
    // 使用720p视频的估计平均比特率（假设 1Mbps）
    const averageBitrate720p = 1000000;
    // 计算估计的视频大小（单位：字节）
    videoSize.value = durationInSeconds * averageBitrate720p / 8;
    if (!pause.value) {
        try {
            await videoPlayer.value.play()
            pause.value = false
        } catch {
            pause.value = true
        }
    }
}

// 实时更新当前播放的时间
const timeUpdate = () => {
    const time = videoPlayer.value.currentTime
    // console.log(videoPlayer.value.currentTime);

    // 如果是0就表示视频被循环播放了，需要初始化弹幕索引以及增加一个播放量
    if (time < lastTimePoint.value) {
        console.log('----------------');

        initDanmuIndex(time)
        increasePlay();
    }
    currentTime.value = time
    // 计算进度条的位置
    currentPer.value = time / duration.value
    // 展示该时间段的弹幕
    if (danmuOpen.value) {
        displayDanmus(time)
    }
    lastTimePoint.value = time
}

// 更新缓冲条
const updateBufferingBar = () => {
    const video = videoPlayer.value
    const buffered = video.buffered
    if (buffered.length > 0) {
        bufferPer.value = buffered.end(buffered.length - 1) / duration.value;
    }
}
// 视频播放结束
const ended = () => {
    if (!setting.loop) {
        pause.value = true
    }
}
//初始化弹幕索引
const initDanmuIndex = (time: number) => {
    removeAllDanmu()
    lastTimePoint.value = time
    dmIndex.value = -1
    rollRow.value = new Array(12).fill(-1)
    topRow.value = new Array(12).fill(-1)
    bottomRow.value = new Array(12).fill(-1)
}

// 移除挂载的全部弹幕
const removeAllDanmu = () => {
    const dmWrap = document.querySelector('.player-row-dm-wrap');
    const dmElements = dmWrap!.querySelectorAll('.dm');
    dmElements.forEach((dmElement) => {
        dmElement.remove();
    });
}

// 增加一个播放量
const increasePlay = () => {
    console.log('+1');

}
const getDmlist = (id: number) => {
    console.log(id);

    let params = {
        v_id: id
    }
    api.getDmByVid(params).then(res => {
        dmList.value = (res as any).data

    })
}
// 加载展示弹幕
const displayDanmus = (currTimePoint: number) => {
    const dmWrap = document.querySelector('.player-row-dm-wrap')
    const screen: HTMLElement = document.querySelector('.player-video-area')!

    while (dmIndex.value + 1 < dmList.value.length && dmList.value[dmIndex.value + 1].timePoint <= currTimePoint) {
        const dm = dmList.value[dmIndex.value + 1]

        if (dm.timePoint > lastTimePoint.value) {

            // 如果该弹幕处在当前时间区间，就挂载到document
            const danmuElement = document.createElement('div')
            danmuElement.classList.add('dm');
            danmuElement.innerText = dm.content;
            danmuElement.style.setProperty('--opacity', `${dmSetting.opacity / 100}`);
            danmuElement.style.setProperty('--fontSize', `${dm.fontsize}px`);
            danmuElement.style.setProperty('--color', `${dm.color}`);

            dmWrap!.appendChild(danmuElement)
            if (dm.mode === 1) {
                // 滚动模式
                danmuElement.classList.add('roll');
                const contentWidth = danmuElement.offsetWidth;    // 内容长度
                const distance = screen.offsetWidth + contentWidth;    // 总位移距离
                danmuElement.style.setProperty('--offset', `${screen.offsetWidth}px`);
                danmuElement.style.setProperty('--translateX', `-${distance}px`);
                danmuElement.style.setProperty('--duration', `${distance / (dmSetting.dmSpeed * 75)}s`);
                // 计算弹幕位置
                const rowOutTime = (contentWidth + 10) / (dmSetting.dmSpeed * 75) + currTimePoint; // 当前弹幕全部呈现时的时间点
                let i = 0, full = false, min = -1, minIndex = 0;
                while (i < 12) {
                    if (rollRow.value[i] <= currentTime.value) {
                        danmuElement.style.setProperty('--top', `${i * 30 + 4}px`);
                        rollRow.value[i] = rowOutTime;
                        break;
                    }

                    // 记录最早全呈现的一行的时间点，以便全部行都占有弹幕时选出一行放新弹幕
                    if (min === -1 || rollRow.value[i] < min) {
                        min = rollRow.value[i];
                        minIndex = i;
                    }
                    i++;
                    if (i === 12) {
                        full = true;
                    }
                }
                if (full) {
                    danmuElement.style.setProperty('--top', `${minIndex * 30 + 4}px`);
                    rollRow.value[minIndex] = rowOutTime;
                }
            } else if (dm.mode === 2) {
                // 顶部
                danmuElement.classList.add('center')
                const duration = dmSetting.dmSpeed === 1 ? 6 : dmSetting.dmSpeed === 2 ? 4 : 2;
                danmuElement.style.setProperty('--duration', `${duration}s`);
                const rowOutTime = duration + currTimePoint; // 当前弹幕消失时的时间点
                let i = 0, full = false, min = -1, minIndex = 0;
                while (i < 12) {
                    if (topRow.value[i] <= currTimePoint) {
                        danmuElement.style.setProperty('--top', `${i * 30 + 4}px`);
                        topRow.value[i] = rowOutTime;
                        break;
                    }
                    // 记录最早消失的一行的时间点，以便全部行都占有弹幕时选出一行放新弹幕
                    if (min === -1 || topRow.value[i] < min) {
                        min = topRow.value[i];
                        minIndex = i;
                    }
                    i++;
                    if (i === 12) {
                        full = true;
                    }
                }
                if (full) {
                    danmuElement.style.setProperty('--top', `${minIndex * 30 + 4}px`);
                    topRow.value[minIndex] = rowOutTime;
                }
            } else {
                // 底部
                danmuElement.classList.add('center');
                const duration = dmSetting.dmSpeed === 1 ? 6 : dmSetting.dmSpeed === 2 ? 4 : 2;
                danmuElement.style.setProperty('--duration', `${duration}s`);
                // 计算弹幕位置
                const rowOutTime = duration + currTimePoint; // 当前弹幕消失时的时间点
                let i = 0, full = false, min = -1, minIndex = 0;
                while (i < 12) {
                    if (bottomRow.value[i] <= currTimePoint) {
                        danmuElement.style.setProperty('bottom', `${i * 30 + 5}px`);
                        bottomRow.value[i] = rowOutTime;
                        break;
                    }
                    // 记录最早消失的一行的时间点，以便全部行都占有弹幕时选出一行放新弹幕
                    if (min === -1 || bottomRow.value[i] < min) {
                        min = bottomRow.value[i];
                        minIndex = i;
                    }
                    i++;
                    if (i === 12) {
                        full = true;
                    }
                }
                if (full) {
                    danmuElement.style.setProperty('bottom', `${minIndex * 30 + 5}px`);
                    bottomRow.value[minIndex] = rowOutTime;
                }
            }
            // 动画结束就移除弹幕
            danmuElement.addEventListener('animationend', () => {
                danmuElement.remove();
            });
        }
        dmIndex.value++
    }
}

// 显示控制器
const showCtrl = () => {
    clearTimeout(hideCtrlTimer.value)
    ctrlHidden.value = false
    hideCtrlTimer.value = setTimeout(() => {
        ctrlHidden.value = true
    }, 1000)
}

// 一直显示控制器
const showCtrlAlweys = () => {
    clearTimeout(hideCtrlTimer.value)
    ctrlHidden.value = false
}
// 处理单击防抖
const handleClick = () => {

}
// 双击清除防抖计时器并全屏
const handleDblClick = () => {
    clearTimeout(clickTimer.value)
    changeFullScreen()
}

// 全屏/退出全屏
const changeFullScreen = () => {
    if (screenType.value !== 'full') {
        fullScreen()
    } else {
        exitFullScreen()
    }
}
// 全屏
const fullScreen = () => {
    screenType.value = 'full'
    const videoArea: any = document.querySelector('.player-video-area')!;
    if (videoArea.requestFullscreen) {
        videoArea.requestFullscreen();
    } else if (videoArea.mozRequestFullScreen) {
        videoArea.mozRequestFullScreen();
    } else if (videoArea.webkitRequestFullscreen) {
        videoArea.webkitRequestFullscreen();
    } else if (videoArea.msRequestFullscreen) {
        videoArea.msRequestFullscreen();
    }

}
// 退出全屏
const exitFullScreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
    }
    screenType.value = 'normal';
}

// 处理全屏模式下按esc键触发的退出全屏事件
const handleVideoResize = () => {
    const videoArea: HTMLElement = document.querySelector('.player-video-area')!
    if (
        videoArea.clientWidth < window.innerWidth - 1 &&
        videoArea.clientHeight < window.innerHeight - 1 &&
        screenType.value !== 'normal'
    ) {
        screenType.value = 'normal'
    }
    if (videoArea.clientWidth > 980) {
        showDmInput.value = true;
    } else {
        showDmInput.value = false;
    }
}
const speedInterval = ref<number>(0)
//播放
const playVideo = () => {
    pause.value = false
    videoPlayer.value.play()
    speedInterval.value = setInterval(updateBufferSpeed, 1000);  // 启动定时更新缓冲网速任务
}

//暂停
const pauseVideo = () => {
    pause.value = true
    videoPlayer.value.pause()
    clearInterval(speedInterval.value);  // 清除定时任务
}
// 计算缓冲网速
const updateBufferSpeed = () => {
    const buffered = videoPlayer.value.buffered;
    if (buffered && buffered.length > 0) {
        let currByte = buffered.end(buffered.length - 1) / duration.value * videoSize.value;
        let differ = currByte - lastByte.value;    // 在1s内加载了这么多字节
        bufferSpeed.value = Number((differ / 1000).toFixed(2));
        lastByte.value = currByte;
    }

}
import { handleTime } from '@/utils/utils';
// 格式化时间
const handleTimeFn = (time: number) => {
    return handleTime(time);
}

//打开关闭弹幕
const changeDanmu = () => {
    if (danmuOpen.value) {
        danmuOpen.value = false
    } else {
        danmuOpen.value = true
    }
}
const menuShowTimer = reactive<Array<any>>([null, null, null, null, null, null, null]) // 每个按钮的提示、菜单等显示延时计时器
const menuHideTimer = reactive<Array<any>>([null, null, null, null, null, null, null]) // 每个按钮的提示、菜单等隐藏延时计时器
// 鼠标悬停按钮时打开菜单
const enterBtn = (name: string, index: number) => {
    clearTimeout(menuHideTimer[index]);
    menuShowTimer[index] = setTimeout(() => {
        const obj = document.querySelector(`.${name}`)!
        obj.classList.add('state-show');
    }, 200);
}

// 鼠标移出按钮时关闭菜单
const leaveBtn = (name: string, index: number) => {
    clearTimeout(menuShowTimer[index]);
    menuHideTimer[index] = setTimeout(() => {
        const obj = document.querySelector(`.${name}`)!;
        obj.classList.remove('state-show');
    }, 200);
}

// 更新弹幕透明度
const changeDmOpacity = (per: number) => {
    let opacity = Math.floor(per * 100);
    dmSetting.opacity = opacity;
}

// 发送弹幕
const sendDm = () => {
    if (input.value.trim().length === 0) {
        ElMessage.error("写点东西吧");
        return;
    }

    const dm = {
        v_id: v_id.value,
        content: input.value,
        fontsize: dmStyle.fontsize,
        mode: dmStyle.mode,
        color: dmStyle.color,
        timePoint: currentTime.value     // 不能是this.$refs.videoPlayer.currentTime
    }

    displaySentDanmus()
    api.addDm(dm).then(res => {
        console.log(res);

    })
    input.value = ''
}

// 挂载刚刚发送的弹幕
const displaySentDanmus = () => {
    const dmWrap = document.querySelector('.player-row-dm-wrap')!;
    const screen: HTMLElement = document.querySelector('.player-video-area')!;
    const danmuElement = document.createElement('div');
    danmuElement.classList.add('dm');
    danmuElement.innerText = input.value
    danmuElement.style.setProperty('--opacity', `${dmSetting.opacity / 100}`);
    danmuElement.style.setProperty('--fontSize', `${dmStyle.fontsize}px`);
    danmuElement.style.setProperty('--color', `${dmStyle.color}`);
    danmuElement.style.setProperty('border', '2px solid #FFFFFF');
    dmWrap.appendChild(danmuElement);
    if (dmStyle.mode === 1) {
        // 滚动模式
        danmuElement.classList.add('roll');
        const contentWidth = danmuElement.offsetWidth;    // 内容长度
        const distance = screen.offsetWidth + contentWidth;    // 总位移距离
        danmuElement.style.setProperty('--offset', `${screen.offsetWidth}px`);
        danmuElement.style.setProperty('--translateX', `-${distance}px`);
        danmuElement.style.setProperty('--duration', `${distance / (dmSetting.dmSpeed * 75)}s`);
        // 计算弹幕位置
        const rowOutTime = (contentWidth + 10) / (dmSetting.dmSpeed * 75) + currentTime.value; // 当前弹幕全部呈现时的时间点
        let i = 0, full = false, min = -1, minIndex = 0;
        while (i < 12) {
            if (rollRow.value[i] <= currentTime.value) {
                danmuElement.style.setProperty('--top', `${i * 30 + 4}px`);
                rollRow.value[i] = rowOutTime;
                break;
            }
            // 记录最早全呈现的一行的时间点，以便全部行都占有弹幕时选出一行放新弹幕
            if (min === -1 || rollRow.value[i] < min) {
                min = rollRow.value[i];
                minIndex = i;
            }
            i++;
            if (i === 12) {
                full = true;
            }
        }
        if (full) {
            danmuElement.style.setProperty('--top', `${minIndex * 30 + 4}px`);
            rollRow.value[minIndex] = rowOutTime;
        }
    } else if (dmStyle.mode === 2) {
        // 顶部
        danmuElement.classList.add('center');
        const duration = dmSetting.dmSpeed === 1 ? 6 : dmSetting.dmSpeed === 2 ? 4 : 2;
        danmuElement.style.setProperty('--duration', `${duration}s`);
        // 计算弹幕位置
        const rowOutTime = duration + currentTime.value; // 当前弹幕消失时的时间点
        let i = 0, full = false, min = -1, minIndex = 0;
        while (i < 12) {
            if (topRow.value[i] <= currentTime.value) {
                danmuElement.style.setProperty('--top', `${i * 30 + 4}px`);
                topRow.value[i] = rowOutTime;
                break;
            }
            // 记录最早消失的一行的时间点，以便全部行都占有弹幕时选出一行放新弹幕
            if (min === -1 || topRow.value[i] < min) {
                min = topRow.value[i];
                minIndex = i;
            }
            i++;
            if (i === 12) {
                full = true;
            }
        }
        if (full) {
            danmuElement.style.setProperty('--top', `${minIndex * 30 + 4}px`);
            topRow.value[minIndex] = rowOutTime;
        }
    } else {
        // 底部
        danmuElement.classList.add('center');
        const duration = dmSetting.dmSpeed === 1 ? 6 : dmSetting.dmSpeed === 2 ? 4 : 2;
        danmuElement.style.setProperty('--duration', `${duration}s`);
        // 计算弹幕位置
        const rowOutTime = duration + currentTime.value; // 当前弹幕消失时的时间点
        let i = 0, full = false, min = -1, minIndex = 0;
        while (i < 12) {
            if (bottomRow.value[i] <= currentTime.value) {
                danmuElement.style.setProperty('bottom', `${i * 30 + 5}px`);
                bottomRow.value[i] = rowOutTime;
                break;
            }
            // 记录最早消失的一行的时间点，以便全部行都占有弹幕时选出一行放新弹幕
            if (min === -1 || bottomRow.value[i] < min) {
                min = bottomRow.value[i];
                minIndex = i;
            }
            i++;
            if (i === 12) {
                full = true;
            }
        }
        if (full) {
            danmuElement.style.setProperty('bottom', `${minIndex * 30 + 5}px`);
            bottomRow.value[minIndex] = rowOutTime;
        }
    }
    // 动画结束就移除弹幕
    danmuElement.addEventListener('animationend', () => {
        danmuElement.remove();
    });

}

// 调整倍速
const changePlaybackRate = (num: number) => {
    if (num === 1.0) {
        playbackrate.value = '倍速';
    } else if (num === 2.0) {
        playbackrate.value = '2.0x';
    } else {
        playbackrate.value = `${num}x`;
    }
    videoPlayer.value.playbackRate = num;
}

// 改变播放设置
const changeSetting = (i: number) => {
    if (i === 1) {
        if (setting.loop) {
            setting.loop = false
        } else {
            setting.loop = true
        }
    } else if (i == 2) {
        if (setting.autoplay) {
            setting.autoplay = false
        } else {
            setting.autoplay = true
        }
    } else if (i === 3) {
        if (setting.autonext) {
            setting.autonext = false
        } else {
            setting.autonext = true
        }
    }
    const localSetting = JSON.stringify(setting)
    localStorage.setItem('playerSetting', localSetting)
}

// 点击小喇叭切换静音状态
const changeMutedState = () => {
    if (isMuted.value) {
        volume.value = Number(localStorage.getItem('volume'))
        isMuted.value = false
    } else {
        volume.value = 0
        isMuted.value = true
    }
    videoPlayer.value.volume = volume.value / 100;
    volumeOrder.value = true;
}

// 改变音量
const changeVolume = (per: number) => {
    let volumeChange = Math.floor(per * 100)
    volume.value = volumeChange
    videoPlayer.value.volume = volumeChange / 100
    if (isMuted.value && volumeChange > 0) {
        isMuted.value = false
    } else if (volumeChange == 0 && !isMuted.value) {
        isMuted.value = true
    }
    localStorage.setItem("volume", JSON.stringify(volumeChange))
}

// 拖动进度条的回调
const changeCurrentPer = (curr: number) => {
    currentPer.value = curr
    // 计算当前时间
    let time = curr * duration.value;
    currentTime.value = time;
    videoPlayer.value.currentTime = time;
    initDanmuIndex(time);
}
onBeforeMount(() => {
    // 同步音量
    if (localStorage.getItem("volume")) {
        volume.value = JSON.parse(localStorage.getItem("volume")!);
    } else {
        localStorage.setItem("volume", JSON.stringify(volume.value));
    }
    // 同步用户的弹幕开关设置
    if (localStorage.getItem("danmuOpen") === 'off') {
        danmuOpen.value = false;
    }
    // 同步弹幕设置
    if (localStorage.getItem("dmSetting")) {
        Object.assign(dmSetting, JSON.parse(localStorage.getItem("dmSetting")!))
    }
    // 同步播放设置
    if (localStorage.getItem("playerSetting")) {
        Object.assign(setting, JSON.parse(localStorage.getItem("playerSetting")!))
    }
    // 判断是否允许自动播放
    if (!setting.autoplay) {
        pause.value = true;
    }
    // 同步弹幕风格
    if (localStorage.getItem("dmStyle")) {
        Object.assign(dmStyle, localStorage.getItem("dmStyle"))
    }
})

onMounted(() => {
    window.addEventListener('resize', handleVideoResize)
    const url = new URL(window.location.href);
    const v_url = url.searchParams.get('v_url');
    v_id.value = Number(url.searchParams.get('v_id'));
    videoUrl.value = new URL(`${v_url}`, import.meta.url).href
    getDmlist(Number(v_id.value))

})

onBeforeMount(() => {
    window.removeEventListener('resize', handleVideoResize);
})

watch(dmSetting, () => {
    localStorage.setItem("dmSetting", JSON.stringify(dmSetting));
    dmOpacityOrder.value = true;
}, { deep: true })

watch(videoUrl, () => {
    lastTimePoint.value = 0
})
</script>

<template>
    <div id="playerWrap" class="player-wrap" :style="`height: ${wrapSize.height}px; width: ${wrapSize.width}px;`">
        <!-- 占位模板 -->
        <div class="player-placeholder">
            <div class="player-placeholder-top"></div>
            <div class="player-placeholder-bottom">
                <div class="player-placeholder-bottom-left"></div>
                <div class="player-placeholder-bottom-right"></div>
            </div>
        </div>
        <!-- 主体 -->
        <div class="player">
            <div class="player-primary-area">
                <!-- 视频播放区域 -->
                <div class="player-video-area" id="video-area"
                    :class="{ 'state-paused': pause, 'state-buff': buff && !pause }" :data-screen="screenType"
                    :data-ctrl-hidden="ctrlHidden" @mouseleave="ctrlHidden = true">
                    <!-- 视频 -->
                    <div class="player-video-perch">
                        <div class="player-video-wrap">
                            <!-- @timeupdate 由 currentTime 属性指示的播放时间已更新。 -->
                            <!-- @progress 在浏览器加载资源期间周期性触发。 -->
                            <video ref="videoPlayer" :src="videoUrl" muted @loadedmetadata="videoCanPlay"
                                @timeupdate="timeUpdate" @progress="updateBufferingBar" @waiting="buff = true"
                                @canplay="buff = false" @ended="ended" :loop="setting.loop">
                            </video>
                        </div>
                    </div>
                    <!-- 弹幕 -->
                    <div class="player-row-dm-wrap" :class="{ 'dm-show': danmuOpen }"></div>
                    <!-- 状态 （未完成）-->
                    <div class="player-state">
                        <div class="player-state-play"></div>
                        <div class="player-state-buff-icon">
                            <LoadingBuff></LoadingBuff>
                        </div>
                        <div class="player-state-buff-text">
                            <span>正在缓冲...</span>
                            <span>{{ bufferSpeed }}KB/s</span>
                        </div>
                    </div>
                    <!-- 加载 （后续补）-->
                    <div class="player-loading-panel" :style="canPlay ? 'display: none;' : 'display: block;'">
                        <PlayerLoading></PlayerLoading>
                    </div>
                    <!-- 蒙版 -->
                    <div class="player-masking" @mousemove="showCtrl" @click="handleClick" @dblclick="handleDblClick">
                    </div>
                    <!-- 顶部 -->
                    <div class="player-top-wrap">
                        <div class="player-top-left">
                            <div class="player-title">{{ title }}</div>
                            <div v-if="user.uid">
                                <div class="player-follow" @mouseenter="showCtrlAlweys">
                                    <img class="player-follow-face" :src="user.avatar_url" alt="">
                                    <svg t="1700578364917" class="icon player-follow-icon" viewBox="0 0 1024 1024"
                                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3687" width="12"
                                        height="12">
                                        <path
                                            d="M512 972.8a51.2 51.2 0 0 1-51.2-51.2V102.4a51.2 51.2 0 0 1 102.4 0v819.2a51.2 51.2 0 0 1-51.2 51.2z"
                                            p-id="3688" fill="#FFFFFF"></path>
                                        <path d="M921.6 512H102.4" fill="#FFFFFF" p-id="3689"></path>
                                        <path
                                            d="M921.6 563.2H102.4a51.2 51.2 0 0 1 0-102.4h819.2a51.2 51.2 0 0 1 0 102.4z"
                                            p-id="3690" fill="#FFFFFF"></path>
                                    </svg>
                                    <span class="player-follow-text">关注</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 控制器 -->
                    <div class="player-control-wrap" @mouseenter="showCtrlAlweys">
                        <div class="player-control-mask"></div>
                        <div class="player-control-entity">
                            <div class="player-control-top">
                                <PlayerProgress :currentPer="currentPer" :bufferPer="bufferPer"
                                    @changeCurrent="changeCurrentPer"></PlayerProgress>
                            </div>
                            <div class="player-control-bottom">
                                <div class="player-control-bottom-left">
                                    <div class="player-ctrl-btn player-ctrl-prev" v-if="false">
                                        <!-- 上一个 -->
                                        <div class="player-ctrl-btn-icon">
                                            <span class="common-svg-icon">
                                                <svg t="1700643760528" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3961"
                                                    width="22" height="22">
                                                    <path
                                                        d="M343.95259221 459.21031851L712.1969664 178.16268117c43.70934215-33.36821646 106.7137627-2.19481771 106.71376157 52.78865294v562.09527581c0 54.98347065-63.00442055 86.15892423-106.71376157 52.79070891L343.95259221 564.78968149c-34.81704221-26.57620082-34.81704221-79.00316103 0-105.57936298zM201.32437789 817.83284281V443.37392867v-187.23562268c0-22.33247517-6.71803278-68.8079451 19.40810752-86.29044906 29.04023267-19.42043762 67.97975097 1.37689885 67.97975096 36.31724544v561.69453681c0 22.33247517 6.73036288 68.80589027-19.39577628 86.29044907-29.05256391 19.42043762-67.99208221-1.37895367-67.9920822-36.31724544z"
                                                        fill="#FFFFFF" p-id="3962"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="player-ctrl-btn player-ctrl-play">
                                        <!-- 播放 -->
                                        <div class="player-ctrl-btn-icon player-ctrl-play-play"
                                            :style="pause ? '' : 'display: none;'" @click="playVideo">
                                            <span class="common-svg-icon">
                                                <svg t="1700644047374" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4206"
                                                    width="22" height="22">
                                                    <path
                                                        d="M847.52000001 429.80266667L344.50133334 101.152c-78.176-45.184-142.21866667-8.18133333-142.21866667 82.13333333v657.22666667c0 90.368 64.04266667 127.30666667 142.21866667 82.19733333L847.52000001 594.13333333c78.25066667-45.25866667 78.25066667-119.14666667 0-164.33066666z m0 0"
                                                        fill="#FFFFFF" p-id="4207"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <!-- 暂停 -->
                                        <div class="player-ctrl-btn-icon player-ctrl-play-pause"
                                            :style="!pause ? '' : 'display: none;'" @click="pauseVideo">
                                            <span class="common-svg-icon">
                                                <svg t="1700644104462" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4447"
                                                    width="22" height="22">
                                                    <path
                                                        d="M735.9 64.9c-51.2 0-96 44.7-96 95.8v702.6c0 51.1 44.8 95.8 96 95.8s96-44.7 96-95.8V160.7c0-51.1-44.8-95.8-96-95.8z m-447.8 0c-51.2 0-96 44.7-96 95.8v702.6c0 51.1 44.8 95.8 96 95.8s96-44.7 96-95.8V160.7c-0.1-51.1-44.9-95.8-96-95.8z"
                                                        p-id="4448" fill="#FFFFFF"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="player-ctrl-btn player-ctrl-next" v-if="false">
                                        <!-- 下一个 -->
                                        <div class="player-ctrl-btn-icon">
                                            <span class="common-svg-icon">
                                                <svg t="1700644237259" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4688"
                                                    width="22" height="22">
                                                    <path
                                                        d="M680.0474078 564.78968149L311.8030336 845.83731883c-43.70934215 33.36821646-106.7137627 2.19481771-106.71376157-52.78865295l0-562.0952758c0-54.98347065 63.00442055-86.15892423 106.71376157-52.79070891L680.0474078 459.21031851c34.81704221 26.57620082 34.81704221 79.00316103 0 105.57936298zM822.67562211 206.16715719L822.67562211 580.62607133l0 187.23562268c0 22.33247517 6.71803278 68.8079451-19.40810752 86.29044906-29.04023267 19.42043762-67.97975097-1.37689886-67.97975096-36.31724544l0-561.69453681c0-22.33247517-6.73036288-68.80589027 19.39577628-86.29044907 29.05256391-19.42043761 67.99208221 1.37895367 67.9920822 36.31724544z"
                                                        fill="#FFFFFF" p-id="4689"></path>
                                                </svg>
                                            </span>
                                        </div>

                                    </div>
                                    <div class="player-ctrl-btn player-ctrl-time">
                                        <div class="player-ctrl-time-label">
                                            <span class="player-ctrl-time-current">{{ handleTimeFn(currentTime)
                                                }}</span>
                                            <span class="player-ctrl-time-divide">/</span>
                                            <span class="player-ctrl-time-duration">{{ handleTimeFn(duration) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="player-control-bottom-center">
                                    <!-- 全屏发送弹幕 -->
                                    <div class="player-sending-bar" v-if="screenType !== 'normal'">
                                        <div class="player-dm-root">
                                            <!-- 弹幕开关 -->
                                            <el-tooltip :visible="dmTips" placement="top" :show-arrow="false"
                                                :append-to="'#video-area'">
                                                <template #content>
                                                    <span>{{ danmuOpen ? '关闭' : '开启' }}弹幕 (d)</span>
                                                </template>
                                                <div class="player-dm-switch player-dm-outside" @click="changeDanmu"
                                                    @mouseenter="dmTips = true" @mouseleave="dmTips = false">
                                                    <svg v-if="danmuOpen" t="1700487450055" class="icon"
                                                        viewBox="0 0 1024 1024" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg" p-id="7051" width="100%"
                                                        height="100%">
                                                        <path
                                                            d="M673.10933333 432.64H616.6755552v40.50488854h56.43377813v-40.50488854z m-106.95111146 0h-53.7031104v40.50488854h53.7031104v-40.50488854z m0 82.37511147h-53.7031104v38.22933333h53.7031104v-38.22933333z m106.95111146 0H616.6755552v38.22933333h56.43377813v-38.22933333z m-27.30666666-206.16533333l48.69688853 17.29422186c-10.0124448 23.66577813-21.39022187 44.60088853-33.67822187 63.2604448h57.344v207.0755552h-101.94488853v37.77422187h121.0595552v47.78666667l-0.45511147 0.45511146h-120.60444373l-0.45511147-0.45511146c-30.9475552-33.22311147-82.83022187-35.49866667-116.5084448-4.5511104l-5.00622186 5.00622186h-46.42133334v-48.24177813h117.41866667v-37.77422187h-99.66933333v-207.0755552h59.1644448a386.38933333 386.38933333 0 0 0-36.864-60.9848896l46.87644373-15.92888853c13.65333333 19.56977813 26.3964448 40.50488853 36.4088896 62.80533333l-30.94755627 13.65333334h68.26666667c14.5635552-24.576 26.3964448-51.88266667 37.31911147-80.0995552z m-212.08177814 21.84533333v151.552H344.97422187l-6.82666667 66.44622187h98.75911147c0 84.65066667-3.18577813 141.0844448-7.73688854 169.7564448-5.9164448 28.672-30.9475552 44.14577813-76.00355626 47.3315552-12.74311147 0-25.48622187-0.91022187-39.59466667-1.8204448l-13.19822187-47.78666667c12.74311147 1.36533333 26.8515552 2.2755552 40.50488854 2.27555627 24.576 0 38.6844448-7.73688853 41.87022293-23.66577814 3.64088853-15.92888853 5.46133333-49.60711147 5.46133333-101.94488853H285.35466667l13.65333333-154.28266667h83.28533333v-63.71555626H289.90577813v-43.69066667h143.8151104v-0.4551104z"
                                                            p-id="7052"></path>
                                                        <path
                                                            d="M792.9856 171.40622187a182.0444448 182.0444448 0 0 1 181.8624 172.94222293l0.1820448 9.10222187v113.77777813a45.51111147 45.51111147 0 0 1-90.7036448 5.27928854l-0.31857813-5.3248V353.45066667a91.02222187 91.02222187 0 0 0-84.1955552-90.7491552l-6.82666667-0.27306667H229.28497813a91.02222187 91.02222187 0 0 0-90.79466666 84.24106667l-0.22755627 6.82666667v427.30382186a91.02222187 91.02222187 0 0 0 84.19555627 90.79466667l6.82666666 0.2275552h300.55537707a45.51111147 45.51111147 0 0 1 5.3248 90.7036448l-5.3248 0.31857813H229.28497813a182.0444448 182.0444448 0 0 1-181.8168896-172.94222293l-0.2275552-9.10222187v-427.34933333a182.0444448 182.0444448 0 0 1 172.94222187-181.81688853l9.10222293-0.22755627h563.70062187z"
                                                            p-id="7053"></path>
                                                        <path
                                                            d="M286.76551147 48.2076448a45.51111147 45.51111147 0 0 1 60.07466666-3.77742293l4.27804374 3.77742293 136.53333333 136.53333334a45.51111147 45.51111147 0 0 1-60.07466667 68.17564373l-4.27804373-3.77742187-136.53333333-136.53333333a45.51111147 45.51111147 0 0 1 0-64.39822187z"
                                                            p-id="7054"></path>
                                                        <path
                                                            d="M715.20711147 48.2076448a45.51111147 45.51111147 0 0 0-60.07466667-3.77742293l-4.2780448 3.77742293-136.53333333 136.53333334a45.51111147 45.51111147 0 0 0 60.07466666 68.17564373l4.2780448-3.77742187 136.53333334-136.53333333a45.51111147 45.51111147 0 0 0 0-64.39822187z"
                                                            p-id="7055"></path>
                                                        <path
                                                            d="M896.3868448 596.02488854a45.51111147 45.51111147 0 0 1 69.95057707 57.9356448l-3.64088854 4.41457813-245.39591146 260.9152a45.51111147 45.51111147 0 0 1-61.53102187 4.36906667l-4.36906667-3.95946667-118.01031146-122.33386667a45.51111147 45.51111147 0 0 1 61.30346666-67.03786666l4.23253334 3.86844373 84.7872 87.88195627 212.67342293-226.0536896z"
                                                            fill="#FF6699" p-id="7056"></path>
                                                    </svg>
                                                    <svg v-else t="1700488288201" class="icon" viewBox="0 0 1024 1024"
                                                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7204"
                                                        width="100%" height="100%">
                                                        <path
                                                            d="M673.10933333 432.64H616.6755552v40.50488854h56.43377813v-40.50488854z m-106.95111146 0h-53.7031104v40.50488854h53.7031104v-40.50488854z m0 82.37511147h-53.7031104v38.22933333h53.7031104v-38.22933333z m106.95111146 0H616.6755552v38.22933333h56.43377813v-38.22933333z m-27.30666666-206.16533333l48.69688853 17.29422186c-10.0124448 23.66577813-21.39022187 44.60088853-33.67822187 63.2604448h57.344v207.0755552h-101.94488853v37.77422187h44.60088853l-15.01866666 48.24177813h-29.58222187l-0.45511147-0.45511146-121.51466666 0.45511146h-46.42133334v-48.24177813h117.41866667v-37.77422187h-99.66933333v-207.0755552h59.1644448a386.38933333 386.38933333 0 0 0-36.864-60.9848896l46.87644373-15.92888853c13.65333333 19.56977813 26.3964448 40.50488853 36.4088896 62.80533333l-30.94755627 13.65333334h68.26666667c14.5635552-24.576 26.3964448-51.88266667 37.31911147-80.0995552z m-212.08177814 21.84533333v151.552H344.97422187l-6.82666667 66.44622187h98.75911147c0 84.65066667-3.18577813 141.0844448-7.73688854 169.7564448-5.9164448 28.672-30.9475552 44.14577813-76.00355626 47.3315552-12.74311147 0-25.48622187-0.91022187-39.59466667-1.8204448l-13.19822187-47.78666667c12.74311147 1.36533333 26.8515552 2.2755552 40.50488854 2.27555627 24.576 0 38.6844448-7.73688853 41.87022293-23.66577814 3.64088853-15.92888853 5.46133333-49.60711147 5.46133333-101.94488853H285.35466667l13.65333333-154.28266667h83.28533333v-63.71555626H289.90577813v-43.69066667h143.8151104v-0.4551104z"
                                                            p-id="7205"></path>
                                                        <path
                                                            d="M792.9856 171.40622187a182.0444448 182.0444448 0 0 1 181.8624 172.94222293l0.1820448 9.10222187v79.18933333a45.51111147 45.51111147 0 0 1-90.7036448 5.3248l-0.31857813-5.3248v-79.18933333a91.02222187 91.02222187 0 0 0-84.1955552-90.7491552l-6.82666667-0.27306667H229.28497813a91.02222187 91.02222187 0 0 0-90.79466666 84.24106667l-0.22755627 6.82666667v427.30382186a91.02222187 91.02222187 0 0 0 84.19555627 90.79466667l6.82666666 0.2275552h300.55537707a45.51111147 45.51111147 0 0 1 5.3248 90.7036448l-5.3248 0.31857813H229.28497813a182.0444448 182.0444448 0 0 1-181.8168896-172.94222293l-0.2275552-9.10222187v-427.34933333a182.0444448 182.0444448 0 0 1 172.94222187-181.81688853l9.10222293-0.22755627h563.70062187z"
                                                            p-id="7206"></path>
                                                        <path
                                                            d="M286.76551147 48.2076448a45.51111147 45.51111147 0 0 1 60.07466666-3.77742293l4.27804374 3.77742293 136.53333333 136.53333334a45.51111147 45.51111147 0 0 1-60.07466667 68.17564373l-4.27804373-3.77742187-136.53333333-136.53333333a45.51111147 45.51111147 0 0 1 0-64.39822187z"
                                                            p-id="7207"></path>
                                                        <path
                                                            d="M715.20711147 48.2076448a45.51111147 45.51111147 0 0 0-60.07466667-3.77742293l-4.2780448 3.77742293-136.53333333 136.53333334a45.51111147 45.51111147 0 0 0 60.07466666 68.17564373l4.2780448-3.77742187 136.53333334-136.53333333a45.51111147 45.51111147 0 0 0 0-64.39822187z"
                                                            p-id="7208"></path>
                                                        <path
                                                            d="M785.06666667 490.66666667a227.5555552 227.5555552 0 1 0 0 455.11111147 227.5555552 227.5555552 0 0 0 0-455.11111147z m0 91.02222187a136.53333333 136.53333333 0 1 1 0 273.06666666 136.53333333 136.53333333 0 0 1 0-273.06666666z"
                                                            p-id="7209"></path>
                                                        <path
                                                            d="M870.94613333 571.99502187a45.51111147 45.51111147 0 0 1 66.7648 61.57653333l-3.8684448 4.18702294-229.28497706 219.31804373a45.51111147 45.51111147 0 0 1-66.7648-61.57653333l3.86844373-4.18702187 229.28497813-219.3635552z"
                                                            p-id="7210"></path>
                                                    </svg>
                                                </div>
                                            </el-tooltip>
                                            <!-- 弹幕显示设置 -->
                                            <div class="player-dm-setting player-dm-outside"
                                                @mouseenter="enterBtn('player-dm-setting', 0)"
                                                @mouseleave="leaveBtn('player-dm-setting', 0)">
                                                <svg t="1700490442936" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3841"
                                                    width="100%" height="100%">
                                                    <path
                                                        d="M167.25546667 293.9904h-54.61333333c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555555s33.10933333-73.95555555 73.95555555-73.95555556h54.61333333c40.84622222 0 73.95555555 33.10933333 73.95555555 73.95555556s-33.10933333 73.95555555-73.95555555 73.95555555zM732.73102222 293.9904h-366.36444444c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555555s33.10933333-73.95555555 73.95555555-73.95555556h366.36444444c40.84622222 0 73.95555555 33.10933333 73.95555557 73.95555556s-33.10933333 73.95555555-73.95555557 73.95555555zM367.50435555 589.81262222h-254.86222221c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555555s33.10933333-73.95555555 73.95555555-73.95555556h254.86222221c40.84622222 0 73.95555555 33.10933333 73.95555556 73.95555556s-33.10933333 73.95555555-73.95555556 73.95555555zM195.69991111 884.49706667h-83.05777777c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555556s33.10933333-73.95555555 73.95555555-73.95555556h83.05777777c40.84622222 0 73.95555555 33.10933333 73.95555556 73.95555556s-33.10933333 73.95555555-73.95555556 73.95555556zM392.53546667 884.49706667h-1.13777778c-40.84622222 0-73.95555555-33.10933333-73.95555556-73.95555556s33.10933333-73.95555555 73.95555556-73.95555556h1.13777778c40.84622222 0 73.95555555 33.10933333 73.95555555 73.95555556s-33.10933333 73.95555555-73.95555555 73.95555556zM995.83075556 599.1424l-106.26844445-184.06968889a67.34392889 67.34392889 0 0 0-58.33386666-33.67822222h-212.5368889a67.35758222 67.35758222 0 0 0-58.33386666 33.67822222l-106.26844443 184.06968889a67.38488889 67.38488889 0 0 0 0 67.35644445l106.26844443 184.06968888a67.34392889 67.34392889 0 0 0 58.33386666 33.67822222h212.54826667c24.064 0 46.29617778-12.83413333 58.33386667-33.67822222l106.26844445-184.06968888a67.35644445 67.35644445 0 0 0-0.01137778-67.35644445z m-270.87075555 108.97635555c-41.58577778 0-75.29813333-33.71235555-75.29813334-75.29813333 0-41.58577778 33.71235555-75.29813333 75.29813334-75.29813333 41.58577778 0 75.29813333 33.71235555 75.29813332 75.29813333 0 41.58577778-33.71235555 75.29813333-75.29813332 75.29813333z"
                                                        p-id="3842"></path>
                                                </svg>
                                                <div class="player-dm-setting-wrap">
                                                    <div class="player-dm-setting-box v-ui v-ui-panel v-ui-dark">
                                                        <div class="v-ui-area">
                                                            <div class="v-ui-panel-wrap"
                                                                style="width: 320px; height: 78px;">
                                                                <div class="v-ui-panel-move"
                                                                    style="width: 586px; transform: translateX(0px);">
                                                                    <div class="v-ui-panel-item v-ui-panel-item-active"
                                                                        style="width: 320px; height: 78px;">
                                                                        <div class="player-dm-setting-left">
                                                                            <div class="player-dm-setting-left-opacity">
                                                                                <div
                                                                                    class="player-dm-setting-left-title">
                                                                                    不透明度
                                                                                </div>
                                                                                <div
                                                                                    class="player-dm-setting-left-content">
                                                                                    <div class="v-ui"
                                                                                        style="height: 12px;">
                                                                                        <div class="v-ui-area">
                                                                                            <SliderRow
                                                                                                class="player-dm-setting-left-progress"
                                                                                                :currentPer="dmSetting.opacity / 100"
                                                                                                :sliderWidth="182"
                                                                                                v-model:order="dmOpacityOrder"
                                                                                                @changeCurrent="changeDmOpacity">
                                                                                            </SliderRow>
                                                                                            <div
                                                                                                class="player-dm-setting-left-value">
                                                                                                {{ dmSetting.opacity }}%
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="player-dm-setting-left-speed">
                                                                                <div
                                                                                    class="player-dm-setting-left-title">
                                                                                    弹幕速度
                                                                                </div>
                                                                                <div class="player-dm-setting-left-content"
                                                                                    style="height: 22px;">
                                                                                    <div class="dm-speed-items">
                                                                                        <div class="dm-speed-item"
                                                                                            :class="{ 'active': dmSetting.dmSpeed === 1 }"
                                                                                            @click="dmSetting.dmSpeed = 1">
                                                                                            慢</div>
                                                                                        <div class="dm-speed-item"
                                                                                            :class="{ 'active': dmSetting.dmSpeed === 2 }"
                                                                                            @click="dmSetting.dmSpeed = 2">
                                                                                            适中</div>
                                                                                        <div class="dm-speed-item"
                                                                                            :class="{ 'active': dmSetting.dmSpeed === 4 }"
                                                                                            @click="dmSetting.dmSpeed = 4">
                                                                                            快</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="player-dm-inputbar" v-if="showDmInput">
                                                <div class="player-video-inputbar-wrap">
                                                    <!-- 弹幕字体颜色 -->
                                                    <div class="player-dm-btn-font player-dm-outside"
                                                        @mouseenter="enterBtn('player-dm-btn-font', 1)"
                                                        @mouseleave="leaveBtn('player-dm-btn-font', 1)">
                                                        <svg t="1700493799646" class="icon" viewBox="0 0 1024 1024"
                                                            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6734"
                                                            width="20" height="20">
                                                            <path
                                                                d="M220.36510341 728.70570667h139.03341036l57.78818844-140.5868563h226.4147437l54.9143135 140.5868563h146.25693392L584.41515614 45.96622222H480.64496829l-260.27986488 682.73948445zM609.81399703 473.94057482H447.01286399L530.43291021 234.70990222 609.81399703 474.01824711zM166.30518518 819.65996563v136.54789689h728.17777778V819.58229333H166.30518518z"
                                                                p-id="6735"></path>
                                                        </svg>
                                                        <div class="player-mode-selection-container">
                                                            <div class="player-mode-selection-panel">
                                                                <div class="player-mode-selection-row">
                                                                    <div class="row-title">字号</div>
                                                                    <div class="row-selection">
                                                                        <div class="selection-span type-fontsize"
                                                                            :class="{ 'active': dmStyle.fontsize === 18 }"
                                                                            @click="dmStyle.fontsize = 18">
                                                                            <span class="selection-name">小</span>
                                                                        </div>
                                                                        <div class="selection-span type-fontsize"
                                                                            :class="{ 'active': dmStyle.fontsize === 25 }"
                                                                            @click="dmStyle.fontsize = 25">
                                                                            <span class="selection-name">标准</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="player-mode-selection-row">
                                                                    <div class="row-title">模式</div>
                                                                    <div class="row-selection">
                                                                        <div class="selection-span type-mode"
                                                                            :class="{ 'active': dmStyle.mode === 1 }"
                                                                            @click="dmStyle.mode = 1">
                                                                            <span class="selection-icon">
                                                                                <svg t="1700749596256" class="icon"
                                                                                    viewBox="0 0 1192 1024"
                                                                                    version="1.1"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    p-id="3991">
                                                                                    <path
                                                                                        d="M1067.17373094 1051.22149218H111.25014969C67.48417906 1051.22149218 32 1015.52238843 32 971.42686593V175.80179062C32 131.72776124 67.81373094 95.99999999 111.25014969 95.99999999h955.92358125c43.77313406 0 79.25731312 35.69910469 79.25731406 79.80179062v795.62507532c0 44.06686594-35.82089531 79.79462719-79.25731406 79.79462625z m-119.74925344-358.208955H390.208955a39.83283563 39.83283563 0 0 0-39.80417906 39.80417906A39.81850781 39.81850781 0 0 0 390.208955 772.61373093h557.2155225a39.81134344 39.81134344 0 0 0 39.79701469-39.79701469 39.81850781 39.81850781 0 0 0-39.79701469-39.80417906z m39.79701469-119.39820844a39.81850781 39.81850781 0 0 0-39.79701469-39.80417906H748.41791a39.82567125 39.82567125 0 0 0-39.80417906 39.80417906A39.81850781 39.81850781 0 0 0 748.41791 613.41134343h199.0065675a39.81134344 39.81134344 0 0 0 39.79701469-39.79701469z m-398.00596969-39.80417906H509.61432875a39.82567125 39.82567125 0 0 0-39.80417906 39.80417906 39.81850781 39.81850781 0 0 0 39.80417906 39.79701469h79.60119375a39.81134344 39.81134344 0 0 0 39.79701469-39.79701469 39.81850781 39.81850781 0 0 0-39.79701469-39.80417906z m398.00596969-119.40537375a39.81134344 39.81134344 0 0 0-39.79701469-39.79701469h-716.41791a39.81850781 39.81850781 0 0 0-39.80417906 39.79701469A39.82567125 39.82567125 0 0 0 231.0065675 454.20895499h716.41791a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906z"
                                                                                        p-id="3992"></path>
                                                                                </svg>
                                                                            </span>
                                                                            <span class="selection-name">滚动</span>
                                                                        </div>
                                                                        <div class="selection-span type-mode"
                                                                            :class="{ 'active': dmStyle.mode === 2 }"
                                                                            @click="dmStyle.mode = 2">
                                                                            <span class="selection-icon">
                                                                                <svg t="1700749716948" class="icon"
                                                                                    viewBox="0 0 1192 1024"
                                                                                    version="1.1"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    p-id="4232">
                                                                                    <path
                                                                                        d="M1066.82268688 95.99999999c43.93791 0 79.60835812 35.67044813 79.60835812 79.60119375v796.01910469c0 43.93791-35.67044813 79.60119375-79.60835812 79.60119375H111.60119375C67.67044813 1051.22149218 32 1015.55820937 32 971.62029843V175.60119374C32 131.67044812 67.67044813 95.99999999 111.60119375 95.99999999h955.22149312zM668.81671625 374.60776124H231.0065675a39.81850781 39.81850781 0 0 0-39.80417906 39.79701469A39.82567125 39.82567125 0 0 0 231.0065675 454.20895499h437.81014875a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906 39.81134344 39.81134344 0 0 0-39.79701469-39.79701469z m238.80358219 0h-79.60119375a39.81134344 39.81134344 0 0 0-39.79701469 39.79701469A39.81850781 39.81850781 0 0 0 828.01910469 454.20895499h79.60119375a39.82567125 39.82567125 0 0 0 39.80417906-39.80417906 39.81850781 39.81850781 0 0 0-39.80417906-39.79701469z m79.60119375-119.40537281a39.81134344 39.81134344 0 0 0-39.79701469-39.79701563h-716.41791a39.81850781 39.81850781 0 0 0-39.80417906 39.79701563 39.83283563 39.83283563 0 0 0 39.80417906 39.80417906h716.41791a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906z"
                                                                                        p-id="4233"></path>
                                                                                </svg>
                                                                            </span>
                                                                            <span class="selection-name">顶部</span>
                                                                        </div>
                                                                        <div class="selection-span type-mode"
                                                                            :class="{ 'active': dmStyle.mode === 3 }"
                                                                            @click="dmStyle.mode = 3">
                                                                            <span class="selection-icon">
                                                                                <svg t="1700749744954" class="icon"
                                                                                    viewBox="0 0 1192 1024"
                                                                                    version="1.1"
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    p-id="4427">
                                                                                    <path
                                                                                        d="M1066.82985031 95.99999999c43.93791 0 79.59403031 35.66328375 79.59403031 79.60119375v796.01910469c0 43.94507438-35.65611938 79.60119375-79.59403031 79.60119375H111.59403031C67.66328375 1051.22149218 32 1015.5653728 32 971.6274628V175.5940303C32 131.66328374 67.66328375 95.99999999 111.60119375 95.99999999h955.22865656z m-119.40537281 756.22209h-716.41791a39.81850781 39.81850781 0 0 0-39.80417906 39.79701469 39.81850781 39.81850781 0 0 0 39.80417906 39.80417906h716.41791a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906 39.81850781 39.81850781 0 0 0-39.79701469-39.79701469zM668.81671625 693.01253718H231.0065675a39.81850781 39.81850781 0 0 0-39.80417906 39.80417906 39.81850781 39.81850781 0 0 0 39.80417906 39.80417906h437.81014875a39.81850781 39.81850781 0 0 0 39.80417906-39.80417906 39.81850781 39.81850781 0 0 0-39.80417906-39.80417906z m238.80358219 0h-79.59402938a39.81850781 39.81850781 0 0 0-39.80417906 39.80417906 39.81850781 39.81850781 0 0 0 39.79701469 39.80417906h79.60119375a39.81850781 39.81850781 0 0 0 39.80417906-39.80417906 39.81850781 39.81850781 0 0 0-39.80417906-39.80417906z"
                                                                                        p-id="4428"></path>
                                                                                </svg>
                                                                            </span>
                                                                            <span class="selection-name">底部</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="player-mode-selection-row">
                                                                    <div class="row-title">颜色</div>
                                                                    <ColorPicker class="row-selection"
                                                                        v-model:color="dmStyle.color"></ColorPicker>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <!-- 弹幕输入框 -->
                                                    <el-input type="text" maxlength="100" placeholder="发个友善的弹幕见证当下"
                                                        class="player-dm-input" v-model="input" />
                                                </div>
                                                <div class="player-dm-btn-send" @click="sendDm">发送</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="player-control-bottom-right">
                                    <!-- 清晰度 -->
                                    <div class="player-ctrl-btn player-ctrl-quality" v-if="false"
                                        @mouseenter="enterBtn('player-ctrl-quality', 2)"
                                        @mouseleave="leaveBtn('player-ctrl-quality', 2)">
                                        <div class="player-ctrl-quality-result">{{ '720P 高清' }}</div>
                                    </div>
                                    <!-- 选集 -->
                                    <div class="player-ctrl-btn player-ctrl-eplist" v-if="false"
                                        @mouseenter="enterBtn('player-ctrl-eplist', 3)"
                                        @mouseleave="leaveBtn('player-ctrl-eplist', 3)">
                                        <div class="player-ctrl-eplist-result">选集</div>
                                    </div>
                                    <!-- 倍数 -->
                                    <div class="player-ctrl-btn player-ctrl-playbackrate"
                                        @mouseenter="enterBtn('player-ctrl-playbackrate', 4)"
                                        @mouseleave="leaveBtn('player-ctrl-playbackrate', 4)">
                                        <div class="player-ctrl-playbackrate-result">{{ playbackrate }}</div>
                                        <ul class="player-ctrl-playbackrate-menu">
                                            <li class="player-ctrl-playbackrate-menu-item"
                                                :class="{ 'state-active': playbackrate === '2.0x' }"
                                                @click="changePlaybackRate(2.0)">2.0x</li>
                                            <li class="player-ctrl-playbackrate-menu-item"
                                                :class="{ 'state-active': playbackrate === '1.5x' }"
                                                @click="changePlaybackRate(1.5)">1.5x</li>
                                            <li class="player-ctrl-playbackrate-menu-item"
                                                :class="{ 'state-active': playbackrate === '1.25x' }"
                                                @click="changePlaybackRate(1.25)">1.25x</li>
                                            <li class="player-ctrl-playbackrate-menu-item"
                                                :class="{ 'state-active': playbackrate === '倍速' }"
                                                @click="changePlaybackRate(1.0)">1.0x</li>
                                            <li class="player-ctrl-playbackrate-menu-item"
                                                :class="{ 'state-active': playbackrate === '0.75x' }"
                                                @click="changePlaybackRate(0.75)">0.75x</li>
                                            <li class="player-ctrl-playbackrate-menu-item"
                                                :class="{ 'state-active': playbackrate === '0.5x' }"
                                                @click="changePlaybackRate(0.5)">0.5x</li>
                                        </ul>
                                    </div>
                                    <!-- 设置 -->
                                    <div class="player-ctrl-btn player-ctrl-setting"
                                        @mouseenter="enterBtn('player-ctrl-setting', 5)"
                                        @mouseleave="leaveBtn('player-ctrl-setting', 5)">
                                        <div class="player-ctrl-btn-icon">
                                            <span class="common-svg-icon">
                                                <svg t="1700669811042" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7338"
                                                    width="22" height="22">
                                                    <path
                                                        d="M882.34150875 504.54345955c0-49.57218555 27.61681646-93.75909188 71.66563872-110.19109768-22.09345317-77.18900202-66.14227541-148.85464074-121.23782427-203.95018957-38.52545897 27.61681646-93.62100781 33.00209567-137.80791415 11.0467266-44.04882225-27.61681646-66.14227541-71.66563872-60.61891213-121.23782427-38.52545897-11.04672658-82.7123653-16.57008987-121.23782427-16.57008988-44.04882225 0-82.7123653 5.5233633-121.23782426 16.57008988 5.5233633 44.04882225-16.57008987 93.62100781-60.61891212 121.23782427s-99.14437109 22.09345317-137.80791414-11.0467266c-55.09554883 55.09554883-99.14437109 126.76118755-121.23782426 203.95018957 44.04882225 16.57008987 71.66563872 60.61891214 71.66563872 110.19109768s-27.61681646 93.62100781-71.66563872 110.19109769c22.09345317 77.18900202 66.14227541 148.85464074 121.23782426 203.95018957 38.52545897-27.61681646 93.62100781-33.00209567 137.80791414-11.0467266 44.04882225 27.61681646 66.14227541 71.66563872 60.61891212 121.23782426 38.52545897 11.04672658 82.7123653 16.57008987 121.23782426 16.5700899 44.04882225 0 82.7123653-5.5233633 121.23782427-16.5700899-5.5233633-44.04882225 16.57008987-93.62100781 60.61891213-121.23782426s99.14437109-22.09345317 137.80791415 11.0467266c55.09554883-55.09554883 99.14437109-126.76118755 121.23782427-203.95018957-44.18690634-16.43200579-71.66563872-60.61891214-71.66563872-110.19109769zM513.10467265 686.40019595c-104.66773438 0-187.3800997-82.7123653-187.38009967-181.8567364 0-99.14437109 82.7123653-181.85673639 187.38009967-181.85673638 104.66773438 0 187.3800997 82.7123653 187.3800997 181.85673638-0.13808409 99.28245518-82.7123653 181.85673639-187.3800997 181.8567364z m0-71.66563871c60.8950803 0 110.19109769-49.29601739 110.19109769-110.19109769 0-60.8950803-49.29601739-110.19109769-110.19109769-110.19109768-60.8950803 0-110.19109769 49.29601739-110.19109768 110.19109768-0.13808409 60.8950803 49.29601739 110.19109769 110.19109768 110.19109769z m0 0"
                                                        fill="#FFFFFF" p-id="7339"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div class="player-ctrl-setting-box">
                                            <div class="player-ctrl-setting-menu v-ui v-ui-panel v-ui-dark">
                                                <div class="v-ui-area">
                                                    <div class="v-ui-panel-wrap" style="width: 132px; height: 108px;">
                                                        <div class="v-ui-panel-move" style="width: 418px;">
                                                            <div class="v-ui-panel-item v-ui-panel-item-active"
                                                                style="width: 132px; height: 108px;">
                                                                <div class="player-ctrl-setting-menu-left">
                                                                    <div class="player-ctrl-setting-loop v-ui v-ui-switch"
                                                                        :class="{ 'checked': setting.loop }"
                                                                        @click="changeSetting(1)">
                                                                        <div class="v-ui-area">
                                                                            <div class="v-ui-switch-label">
                                                                                <span
                                                                                    class="v-ui-switch-name">洗脑循环</span>
                                                                                <span class="v-ui-switch-body">
                                                                                    <span
                                                                                        class="v-ui-switch-dot"><span></span></span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="player-ctrl-setting-autoplay v-ui v-ui-switch"
                                                                        :class="{ 'checked': setting.autoplay }"
                                                                        @click="changeSetting(2)">
                                                                        <div class="v-ui-area">
                                                                            <div class="v-ui-switch-label">
                                                                                <span
                                                                                    class="v-ui-switch-name">自动开播</span>
                                                                                <span class="v-ui-switch-body">
                                                                                    <span
                                                                                        class="v-ui-switch-dot"><span></span></span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="player-ctrl-setting-autonext v-ui v-ui-switch"
                                                                        :class="{ 'checked': setting.autonext }"
                                                                        @click="changeSetting(3)">
                                                                        <div class="v-ui-area">
                                                                            <div class="v-ui-switch-label">
                                                                                <span
                                                                                    class="v-ui-switch-name">自动切集</span>
                                                                                <span class="v-ui-switch-body">
                                                                                    <span
                                                                                        class="v-ui-switch-dot"><span></span></span>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 音量 -->
                                    <div class="player-ctrl-btn player-ctrl-volume"
                                        @mouseenter="enterBtn('player-ctrl-volume', 6)"
                                        @mouseleave="leaveBtn('player-ctrl-volume', 6)">
                                        <div class="player-ctrl-btn-icon" @click="changeMutedState">
                                            <span class="common-svg-icon">
                                                <svg v-if="isMuted" t="1700670251969" class="icon"
                                                    viewBox="0 0 1024 1024" version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg" p-id="4236" width="22"
                                                    height="22">
                                                    <path
                                                        d="M225.680461 326.598406c-0.419556-0.019443-0.818645-0.019443-1.237177-0.019443L101.812315 326.578963c-22.753213 0-40.876989 18.24248-40.876989 40.777729l0 286.336424c0 22.534226 18.302855 40.777729 40.876989 40.777729l122.629945 0c0.079818 0 0.119727 0 0.198521 0l0 0.157589 300.289204 194.444551c7.125281 6.108115 16.405645 9.781784 26.526143 9.781784 22.573111 0 40.874943-18.301831 40.874943-40.878013 0-1.87572-0.119727-3.711532-0.360204-5.509481L591.970868 168.58151c0.239454-1.795902 0.360204-3.632737 0.360204-5.509481 0-22.574135-18.302855-40.876989-40.874943-40.876989-9.301853 0-17.884322 3.113921-24.750707 8.343015L225.680461 326.598406zM859.567485 510.524392l91.952248-91.951225c11.495822-11.517311 11.576663-30.558993-0.13917-42.274826-11.795651-11.795651-30.636764-11.755742-42.273802-0.140193l-91.953272 91.953272-91.950202-91.953272c-11.639085-11.616572-30.479175-11.655458-42.275849 0.140193-11.715833 11.715833-11.633968 30.757514-0.13917 42.274826l91.952248 91.951225-91.952248 91.953272c-11.494799 11.515265-11.576663 30.556946 0.13917 42.272779 11.796674 11.796674 30.636764 11.756765 42.275849 0.140193l91.950202-91.951225 91.953272 91.951225c11.636015 11.617595 30.477129 11.657504 42.273802-0.140193 11.715833-11.714809 11.634991-30.757514 0.13917-42.272779L859.567485 510.524392z"
                                                        fill="#FFFFFF" p-id="4237"></path>
                                                </svg>
                                                <svg v-else t="1700670170727" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3989"
                                                    width="22" height="22">
                                                    <path
                                                        d="M218.495828 334.609871c-0.390903-0.019443-0.773619-0.019443-1.164522-0.019443L100.022553 334.590428c-21.744233 0-39.087227 17.448394-39.087227 39.001269l0 273.866415c0 21.551852 17.505699 38.999223 39.087227 38.999223l117.308753 0c0.057305 0 0.113587 0 0.171915 0l0 0.153496 287.22056 185.975668c6.824429 5.842055 15.691377 9.354042 25.370831 9.354042 21.590737 0 39.096437-17.505699 39.096437-39.095413 0-1.794879-0.124843-3.551896-0.354064-5.270027L568.836985 183.473685c0.229221-1.718131 0.354064-3.475148 0.354064-5.269004 0-21.590737-17.505699-39.096437-39.096437-39.096437-8.895601 0-17.105586 2.977821-23.682375 7.979742L218.495828 334.609871z"
                                                        fill="#FFFFFF" p-id="3990"></path>
                                                    <path
                                                        d="M757.858012 953.491133l0.085958 0.075725c123.876332-107.514689 202.211445-266.13329 202.211445-443.041442 0-177.214121-78.603219-336.062965-202.851011-443.61654l-0.11461 0.11461c-4.963035-3.817955-11.17655-6.109138-17.925255-6.109138-16.197914 0-29.322839 13.133112-29.322839 29.321816 0 6.757914 2.28095 12.981662 6.109138 17.926278l-0.333598 0.342808c0.821715 0.706081 1.641383 1.393743 2.462075 2.119267 1.173732 1.202385 2.452865 2.329045 3.817955 3.321652 110.054535 96.710622 179.51349 238.550071 179.51349 396.578224 0 158.02713-69.458955 299.866578-179.51349 396.577201-1.36509 0.99363-2.644223 2.118244-3.817955 3.321652-0.600681 0.533143-1.212618 1.048889-1.822508 1.564635l0.229221 0.230244c-4.152577 5.058203-6.643304 11.530614-6.643304 18.593474 0 16.188704 13.124925 29.321816 29.322839 29.321816C746.317165 960.134437 752.798786 957.651896 757.858012 953.491133z"
                                                        fill="#FFFFFF" p-id="3991"></path>
                                                    <path
                                                        d="M713.998085 729.35433l0.23843 0.24764c55.380308-56.43022 89.532129-133.76454 89.532129-219.077577 0-85.409229-34.228569-162.800853-89.704045-219.249493l-0.268106 0.267083c-4.886287-3.64604-10.966773-5.821589-17.543561-5.821589-16.197914 0-29.322839 13.133112-29.322839 29.321816 0 6.566556 2.166339 12.657274 5.822612 17.544585l-0.162706 0.170892c0.773619 0.782829 1.547239 1.584078 2.310625 2.38635 0.075725 0.076748 0.152473 0.171915 0.23843 0.248663 43.3626 45.587268 69.983911 107.248629 69.983911 175.132716 0 67.884087-26.621311 129.544425-69.983911 175.131693-0.085958 0.077771-0.162706 0.171915-0.23843 0.24764-0.706081 0.74599-1.422396 1.471514-2.13871 2.214435l0.144286 0.134053c-3.751441 4.926196-5.976108 11.092639-5.976108 17.754363 0 16.188704 13.124925 29.321816 29.322839 29.321816C702.925912 735.328391 709.072913 733.113957 713.998085 729.35433z"
                                                        fill="#FFFFFF" p-id="3992"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div class="player-ctrl-volume-box">
                                            <div class="player-ctrl-volume-number">{{ volume }}</div>
                                            <SliderColumn class="player-ctrl-volume-progress" :currentPer="volume / 100"
                                                :sliderHeight="60" v-model:order="volumeOrder"
                                                @changeCurrent="changeVolume"></SliderColumn>
                                        </div>
                                    </div>
                                    <!-- 全屏 -->
                                    <div class="player-ctrl-btn player-ctrl-full">
                                        <!-- 这里想挂载到#video-area上，但一直挂不上不知道为什么 -->
                                        <el-tooltip :visible="fullTips" placement="top-end" :show-arrow="false">
                                            <template #content>
                                                <span v-if="screenType === 'normal'">进入全屏 (f)</span>
                                                <span v-if="screenType === 'full'">退出全屏 (f)</span>
                                            </template>
                                            <div class="player-ctrl-btn-icon" @click="changeFullScreen"
                                                @mouseenter="fullTips = true" @mouseleave="fullTips = false">
                                                <span class="common-svg-icon">
                                                    <svg v-if="screenType === 'normal'" t="1700682460725" class="icon"
                                                        viewBox="0 0 1024 1024" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg" p-id="4481" width="22"
                                                        height="22">
                                                        <path
                                                            d="M992 392h-79.99999969V231.99999969h-160.00000031V152h240v240z m-240 480v-79.99999969h160.00000031v-160.00000031h79.99999969v240h-240zM32 632h79.99999969v160.00000031h160.00000031v79.99999969H32v-240zM272 152v79.99999969H111.99999969v160.00000031H32V152h240z m559.99999969 160.00000031H192.00000031v399.99999938h639.99999938V312.00000031z"
                                                            fill="#FFFFFF" p-id="4482"></path>
                                                    </svg>
                                                    <svg v-if="screenType === 'full'" t="1700682742461" class="icon"
                                                        viewBox="0 0 1024 1024" version="1.1"
                                                        xmlns="http://www.w3.org/2000/svg" p-id="4722" width="22"
                                                        height="22">
                                                        <path
                                                            d="M896 128H128a64.07 64.07 0 0 0-64 64v640a64.07 64.07 0 0 0 64 64h768a64.07 64.07 0 0 0 64-64V192a64.07 64.07 0 0 0-64-64zM448 672a32 32 0 0 1-64 0v-50.75L246.63 758.63a32 32 0 0 1-45.26-45.26L338.75 576H288a32 32 0 0 1 0-64h128a31.83 31.83 0 0 1 22.35 9.1l0.43 0.43A31.83 31.83 0 0 1 448 544z m374.63-361.37L685.25 448H736a32 32 0 0 1 0 64H608a31.83 31.83 0 0 1-22.35-9.1c-0.14-0.14-0.29-0.28-0.43-0.43A31.83 31.83 0 0 1 576 480V352a32 32 0 0 1 64 0v50.75l137.37-137.38a32 32 0 0 1 45.26 45.26z"
                                                            fill="#FFFFFF" p-id="4723"></path>
                                                    </svg>
                                                </span>
                                            </div>
                                        </el-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 隐蔽进度条 -->
                    <div class="player-shadow-progress-area">
                        <div class="player-shadow-progress-schedule-wrap">
                            <div class="player-progress-schedule">
                                <div class="player-progress-schedule-buffer"
                                    :style="`transform: scaleX(${bufferPer});`"></div>
                                <div class="player-progress-schedule-current"
                                    :style="`transform: scaleX(${currentPer});`"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 发送弹幕区域 -->
                <div class="player-sending-area">
                    <div class="player-video-info">
                        <div class="player-video-info-text">
                            {{ population }} 人正在观看，已装填 {{ dmList.length }} 条弹幕
                        </div>
                    </div>
                    <div class="player-dm-root">
                        <!-- 弹幕开关 -->
                        <el-tooltip :visible="dmTips" placement="top" :show-arrow="false">
                            <template #content>
                                <span>{{ danmuOpen ? '关闭' : '开启' }}弹幕 (d)</span>
                            </template>
                            <div class="player-dm-switch player-dm-outside" @click="changeDanmu"
                                @mouseenter="dmTips = true" @mouseleave="dmTips = false">
                                <svg v-if="danmuOpen" t="1700487450055" class="icon" viewBox="0 0 1024 1024"
                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7051" width="100%"
                                    height="100%">
                                    <path
                                        d="M673.10933333 432.64H616.6755552v40.50488854h56.43377813v-40.50488854z m-106.95111146 0h-53.7031104v40.50488854h53.7031104v-40.50488854z m0 82.37511147h-53.7031104v38.22933333h53.7031104v-38.22933333z m106.95111146 0H616.6755552v38.22933333h56.43377813v-38.22933333z m-27.30666666-206.16533333l48.69688853 17.29422186c-10.0124448 23.66577813-21.39022187 44.60088853-33.67822187 63.2604448h57.344v207.0755552h-101.94488853v37.77422187h121.0595552v47.78666667l-0.45511147 0.45511146h-120.60444373l-0.45511147-0.45511146c-30.9475552-33.22311147-82.83022187-35.49866667-116.5084448-4.5511104l-5.00622186 5.00622186h-46.42133334v-48.24177813h117.41866667v-37.77422187h-99.66933333v-207.0755552h59.1644448a386.38933333 386.38933333 0 0 0-36.864-60.9848896l46.87644373-15.92888853c13.65333333 19.56977813 26.3964448 40.50488853 36.4088896 62.80533333l-30.94755627 13.65333334h68.26666667c14.5635552-24.576 26.3964448-51.88266667 37.31911147-80.0995552z m-212.08177814 21.84533333v151.552H344.97422187l-6.82666667 66.44622187h98.75911147c0 84.65066667-3.18577813 141.0844448-7.73688854 169.7564448-5.9164448 28.672-30.9475552 44.14577813-76.00355626 47.3315552-12.74311147 0-25.48622187-0.91022187-39.59466667-1.8204448l-13.19822187-47.78666667c12.74311147 1.36533333 26.8515552 2.2755552 40.50488854 2.27555627 24.576 0 38.6844448-7.73688853 41.87022293-23.66577814 3.64088853-15.92888853 5.46133333-49.60711147 5.46133333-101.94488853H285.35466667l13.65333333-154.28266667h83.28533333v-63.71555626H289.90577813v-43.69066667h143.8151104v-0.4551104z"
                                        p-id="7052"></path>
                                    <path
                                        d="M792.9856 171.40622187a182.0444448 182.0444448 0 0 1 181.8624 172.94222293l0.1820448 9.10222187v113.77777813a45.51111147 45.51111147 0 0 1-90.7036448 5.27928854l-0.31857813-5.3248V353.45066667a91.02222187 91.02222187 0 0 0-84.1955552-90.7491552l-6.82666667-0.27306667H229.28497813a91.02222187 91.02222187 0 0 0-90.79466666 84.24106667l-0.22755627 6.82666667v427.30382186a91.02222187 91.02222187 0 0 0 84.19555627 90.79466667l6.82666666 0.2275552h300.55537707a45.51111147 45.51111147 0 0 1 5.3248 90.7036448l-5.3248 0.31857813H229.28497813a182.0444448 182.0444448 0 0 1-181.8168896-172.94222293l-0.2275552-9.10222187v-427.34933333a182.0444448 182.0444448 0 0 1 172.94222187-181.81688853l9.10222293-0.22755627h563.70062187z"
                                        p-id="7053"></path>
                                    <path
                                        d="M286.76551147 48.2076448a45.51111147 45.51111147 0 0 1 60.07466666-3.77742293l4.27804374 3.77742293 136.53333333 136.53333334a45.51111147 45.51111147 0 0 1-60.07466667 68.17564373l-4.27804373-3.77742187-136.53333333-136.53333333a45.51111147 45.51111147 0 0 1 0-64.39822187z"
                                        p-id="7054"></path>
                                    <path
                                        d="M715.20711147 48.2076448a45.51111147 45.51111147 0 0 0-60.07466667-3.77742293l-4.2780448 3.77742293-136.53333333 136.53333334a45.51111147 45.51111147 0 0 0 60.07466666 68.17564373l4.2780448-3.77742187 136.53333334-136.53333333a45.51111147 45.51111147 0 0 0 0-64.39822187z"
                                        p-id="7055"></path>
                                    <path
                                        d="M896.3868448 596.02488854a45.51111147 45.51111147 0 0 1 69.95057707 57.9356448l-3.64088854 4.41457813-245.39591146 260.9152a45.51111147 45.51111147 0 0 1-61.53102187 4.36906667l-4.36906667-3.95946667-118.01031146-122.33386667a45.51111147 45.51111147 0 0 1 61.30346666-67.03786666l4.23253334 3.86844373 84.7872 87.88195627 212.67342293-226.0536896z"
                                        fill="#FF6699" p-id="7056"></path>
                                </svg>
                                <svg v-else t="1700488288201" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" p-id="7204" width="100%" height="100%">
                                    <path
                                        d="M673.10933333 432.64H616.6755552v40.50488854h56.43377813v-40.50488854z m-106.95111146 0h-53.7031104v40.50488854h53.7031104v-40.50488854z m0 82.37511147h-53.7031104v38.22933333h53.7031104v-38.22933333z m106.95111146 0H616.6755552v38.22933333h56.43377813v-38.22933333z m-27.30666666-206.16533333l48.69688853 17.29422186c-10.0124448 23.66577813-21.39022187 44.60088853-33.67822187 63.2604448h57.344v207.0755552h-101.94488853v37.77422187h44.60088853l-15.01866666 48.24177813h-29.58222187l-0.45511147-0.45511146-121.51466666 0.45511146h-46.42133334v-48.24177813h117.41866667v-37.77422187h-99.66933333v-207.0755552h59.1644448a386.38933333 386.38933333 0 0 0-36.864-60.9848896l46.87644373-15.92888853c13.65333333 19.56977813 26.3964448 40.50488853 36.4088896 62.80533333l-30.94755627 13.65333334h68.26666667c14.5635552-24.576 26.3964448-51.88266667 37.31911147-80.0995552z m-212.08177814 21.84533333v151.552H344.97422187l-6.82666667 66.44622187h98.75911147c0 84.65066667-3.18577813 141.0844448-7.73688854 169.7564448-5.9164448 28.672-30.9475552 44.14577813-76.00355626 47.3315552-12.74311147 0-25.48622187-0.91022187-39.59466667-1.8204448l-13.19822187-47.78666667c12.74311147 1.36533333 26.8515552 2.2755552 40.50488854 2.27555627 24.576 0 38.6844448-7.73688853 41.87022293-23.66577814 3.64088853-15.92888853 5.46133333-49.60711147 5.46133333-101.94488853H285.35466667l13.65333333-154.28266667h83.28533333v-63.71555626H289.90577813v-43.69066667h143.8151104v-0.4551104z"
                                        p-id="7205"></path>
                                    <path
                                        d="M792.9856 171.40622187a182.0444448 182.0444448 0 0 1 181.8624 172.94222293l0.1820448 9.10222187v79.18933333a45.51111147 45.51111147 0 0 1-90.7036448 5.3248l-0.31857813-5.3248v-79.18933333a91.02222187 91.02222187 0 0 0-84.1955552-90.7491552l-6.82666667-0.27306667H229.28497813a91.02222187 91.02222187 0 0 0-90.79466666 84.24106667l-0.22755627 6.82666667v427.30382186a91.02222187 91.02222187 0 0 0 84.19555627 90.79466667l6.82666666 0.2275552h300.55537707a45.51111147 45.51111147 0 0 1 5.3248 90.7036448l-5.3248 0.31857813H229.28497813a182.0444448 182.0444448 0 0 1-181.8168896-172.94222293l-0.2275552-9.10222187v-427.34933333a182.0444448 182.0444448 0 0 1 172.94222187-181.81688853l9.10222293-0.22755627h563.70062187z"
                                        p-id="7206"></path>
                                    <path
                                        d="M286.76551147 48.2076448a45.51111147 45.51111147 0 0 1 60.07466666-3.77742293l4.27804374 3.77742293 136.53333333 136.53333334a45.51111147 45.51111147 0 0 1-60.07466667 68.17564373l-4.27804373-3.77742187-136.53333333-136.53333333a45.51111147 45.51111147 0 0 1 0-64.39822187z"
                                        p-id="7207"></path>
                                    <path
                                        d="M715.20711147 48.2076448a45.51111147 45.51111147 0 0 0-60.07466667-3.77742293l-4.2780448 3.77742293-136.53333333 136.53333334a45.51111147 45.51111147 0 0 0 60.07466666 68.17564373l4.2780448-3.77742187 136.53333334-136.53333333a45.51111147 45.51111147 0 0 0 0-64.39822187z"
                                        p-id="7208"></path>
                                    <path
                                        d="M785.06666667 490.66666667a227.5555552 227.5555552 0 1 0 0 455.11111147 227.5555552 227.5555552 0 0 0 0-455.11111147z m0 91.02222187a136.53333333 136.53333333 0 1 1 0 273.06666666 136.53333333 136.53333333 0 0 1 0-273.06666666z"
                                        p-id="7209"></path>
                                    <path
                                        d="M870.94613333 571.99502187a45.51111147 45.51111147 0 0 1 66.7648 61.57653333l-3.8684448 4.18702294-229.28497706 219.31804373a45.51111147 45.51111147 0 0 1-66.7648-61.57653333l3.86844373-4.18702187 229.28497813-219.3635552z"
                                        p-id="7210"></path>
                                </svg>
                            </div>
                        </el-tooltip>
                        <!-- 弹幕显示设置 -->
                        <div class="player-dm-setting player-dm-outside" @mouseenter="enterBtn('player-dm-setting', 0)"
                            @mouseleave="leaveBtn('player-dm-setting', 0)">
                            <svg t="1700490442936" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3841" width="100%" height="100%">
                                <path
                                    d="M167.25546667 293.9904h-54.61333333c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555555s33.10933333-73.95555555 73.95555555-73.95555556h54.61333333c40.84622222 0 73.95555555 33.10933333 73.95555555 73.95555556s-33.10933333 73.95555555-73.95555555 73.95555555zM732.73102222 293.9904h-366.36444444c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555555s33.10933333-73.95555555 73.95555555-73.95555556h366.36444444c40.84622222 0 73.95555555 33.10933333 73.95555557 73.95555556s-33.10933333 73.95555555-73.95555557 73.95555555zM367.50435555 589.81262222h-254.86222221c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555555s33.10933333-73.95555555 73.95555555-73.95555556h254.86222221c40.84622222 0 73.95555555 33.10933333 73.95555556 73.95555556s-33.10933333 73.95555555-73.95555556 73.95555555zM195.69991111 884.49706667h-83.05777777c-40.84622222 0-73.95555555-33.10933333-73.95555555-73.95555556s33.10933333-73.95555555 73.95555555-73.95555556h83.05777777c40.84622222 0 73.95555555 33.10933333 73.95555556 73.95555556s-33.10933333 73.95555555-73.95555556 73.95555556zM392.53546667 884.49706667h-1.13777778c-40.84622222 0-73.95555555-33.10933333-73.95555556-73.95555556s33.10933333-73.95555555 73.95555556-73.95555556h1.13777778c40.84622222 0 73.95555555 33.10933333 73.95555555 73.95555556s-33.10933333 73.95555555-73.95555555 73.95555556zM995.83075556 599.1424l-106.26844445-184.06968889a67.34392889 67.34392889 0 0 0-58.33386666-33.67822222h-212.5368889a67.35758222 67.35758222 0 0 0-58.33386666 33.67822222l-106.26844443 184.06968889a67.38488889 67.38488889 0 0 0 0 67.35644445l106.26844443 184.06968888a67.34392889 67.34392889 0 0 0 58.33386666 33.67822222h212.54826667c24.064 0 46.29617778-12.83413333 58.33386667-33.67822222l106.26844445-184.06968888a67.35644445 67.35644445 0 0 0-0.01137778-67.35644445z m-270.87075555 108.97635555c-41.58577778 0-75.29813333-33.71235555-75.29813334-75.29813333 0-41.58577778 33.71235555-75.29813333 75.29813334-75.29813333 41.58577778 0 75.29813333 33.71235555 75.29813332 75.29813333 0 41.58577778-33.71235555 75.29813333-75.29813332 75.29813333z"
                                    p-id="3842"></path>
                            </svg>
                            <div class="player-dm-setting-wrap">
                                <div class="player-dm-setting-box v-ui v-ui-panel v-ui-dark">
                                    <div class="v-ui-area">
                                        <div class="v-ui-panel-wrap" style="width: 320px; height: 78px;">
                                            <div class="v-ui-panel-move"
                                                style="width: 586px; transform: translateX(0px);">
                                                <div class="v-ui-panel-item v-ui-panel-item-active"
                                                    style="width: 320px; height: 78px;">
                                                    <div class="player-dm-setting-left">
                                                        <div class="player-dm-setting-left-opacity">
                                                            <div class="player-dm-setting-left-title">不透明度</div>
                                                            <div class="player-dm-setting-left-content">
                                                                <div class="v-ui" style="height: 12px;">
                                                                    <div class="v-ui-area">
                                                                        <SliderRow
                                                                            class="player-dm-setting-left-progress"
                                                                            :currentPer="dmSetting.opacity / 100"
                                                                            :sliderWidth="182"
                                                                            v-model:order="dmOpacityOrder"
                                                                            @changeCurrent="changeDmOpacity">
                                                                        </SliderRow>
                                                                        <div class="player-dm-setting-left-value">{{
                                                                            dmSetting.opacity
                                                                            }}%</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="player-dm-setting-left-speed">
                                                            <div class="player-dm-setting-left-title">弹幕速度</div>
                                                            <div class="player-dm-setting-left-content"
                                                                style="height: 22px;">
                                                                <div class="dm-speed-items">
                                                                    <div class="dm-speed-item"
                                                                        :class="{ 'active': dmSetting.dmSpeed === 1 }"
                                                                        @click="dmSetting.dmSpeed = 1">慢</div>
                                                                    <div class="dm-speed-item"
                                                                        :class="{ 'active': dmSetting.dmSpeed === 2 }"
                                                                        @click="dmSetting.dmSpeed = 2">适中</div>
                                                                    <div class="dm-speed-item"
                                                                        :class="{ 'active': dmSetting.dmSpeed === 4 }"
                                                                        @click="dmSetting.dmSpeed = 4">快</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="player-dm-inputbar">
                            <div class="player-video-inputbar-wrap">
                                <!-- 弹幕字体颜色 -->
                                <div class="player-dm-btn-font player-dm-outside"
                                    @mouseenter="enterBtn('player-dm-btn-font', 1)"
                                    @mouseleave="leaveBtn('player-dm-btn-font', 1)">
                                    <svg t="1700493799646" class="icon player-dm-btn-font-icon" viewBox="0 0 1024 1024"
                                        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6734" width="20"
                                        height="20">
                                        <path
                                            d="M220.36510341 728.70570667h139.03341036l57.78818844-140.5868563h226.4147437l54.9143135 140.5868563h146.25693392L584.41515614 45.96622222H480.64496829l-260.27986488 682.73948445zM609.81399703 473.94057482H447.01286399L530.43291021 234.70990222 609.81399703 474.01824711zM166.30518518 819.65996563v136.54789689h728.17777778V819.58229333H166.30518518z"
                                            p-id="6735"></path>
                                    </svg>
                                    <div class="player-mode-selection-container">
                                        <div class="player-mode-selection-panel">
                                            <div class="player-mode-selection-row">
                                                <div class="row-title">字号</div>
                                                <div class="row-selection">
                                                    <div class="selection-span type-fontsize"
                                                        :class="{ 'active': dmStyle.fontsize === 18 }"
                                                        @click="dmStyle.fontsize = 18">
                                                        <span class="selection-name">小</span>
                                                    </div>
                                                    <div class="selection-span type-fontsize"
                                                        :class="{ 'active': dmStyle.fontsize === 25 }"
                                                        @click="dmStyle.fontsize = 25">
                                                        <span class="selection-name">标准</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="player-mode-selection-row">
                                                <div class="row-title">模式</div>
                                                <div class="row-selection">
                                                    <div class="selection-span type-mode"
                                                        :class="{ 'active': dmStyle.mode === 1 }"
                                                        @click="dmStyle.mode = 1">
                                                        <span class="selection-icon">
                                                            <svg t="1700749596256" class="icon" viewBox="0 0 1192 1024"
                                                                version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                p-id="3991">
                                                                <path
                                                                    d="M1067.17373094 1051.22149218H111.25014969C67.48417906 1051.22149218 32 1015.52238843 32 971.42686593V175.80179062C32 131.72776124 67.81373094 95.99999999 111.25014969 95.99999999h955.92358125c43.77313406 0 79.25731312 35.69910469 79.25731406 79.80179062v795.62507532c0 44.06686594-35.82089531 79.79462719-79.25731406 79.79462625z m-119.74925344-358.208955H390.208955a39.83283563 39.83283563 0 0 0-39.80417906 39.80417906A39.81850781 39.81850781 0 0 0 390.208955 772.61373093h557.2155225a39.81134344 39.81134344 0 0 0 39.79701469-39.79701469 39.81850781 39.81850781 0 0 0-39.79701469-39.80417906z m39.79701469-119.39820844a39.81850781 39.81850781 0 0 0-39.79701469-39.80417906H748.41791a39.82567125 39.82567125 0 0 0-39.80417906 39.80417906A39.81850781 39.81850781 0 0 0 748.41791 613.41134343h199.0065675a39.81134344 39.81134344 0 0 0 39.79701469-39.79701469z m-398.00596969-39.80417906H509.61432875a39.82567125 39.82567125 0 0 0-39.80417906 39.80417906 39.81850781 39.81850781 0 0 0 39.80417906 39.79701469h79.60119375a39.81134344 39.81134344 0 0 0 39.79701469-39.79701469 39.81850781 39.81850781 0 0 0-39.79701469-39.80417906z m398.00596969-119.40537375a39.81134344 39.81134344 0 0 0-39.79701469-39.79701469h-716.41791a39.81850781 39.81850781 0 0 0-39.80417906 39.79701469A39.82567125 39.82567125 0 0 0 231.0065675 454.20895499h716.41791a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906z"
                                                                    p-id="3992"></path>
                                                            </svg>
                                                        </span>
                                                        <span class="selection-name">滚动</span>
                                                    </div>
                                                    <div class="selection-span type-mode"
                                                        :class="{ 'active': dmStyle.mode === 2 }"
                                                        @click="dmStyle.mode = 2">
                                                        <span class="selection-icon">
                                                            <svg t="1700749716948" class="icon" viewBox="0 0 1192 1024"
                                                                version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                p-id="4232">
                                                                <path
                                                                    d="M1066.82268688 95.99999999c43.93791 0 79.60835812 35.67044813 79.60835812 79.60119375v796.01910469c0 43.93791-35.67044813 79.60119375-79.60835812 79.60119375H111.60119375C67.67044813 1051.22149218 32 1015.55820937 32 971.62029843V175.60119374C32 131.67044812 67.67044813 95.99999999 111.60119375 95.99999999h955.22149312zM668.81671625 374.60776124H231.0065675a39.81850781 39.81850781 0 0 0-39.80417906 39.79701469A39.82567125 39.82567125 0 0 0 231.0065675 454.20895499h437.81014875a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906 39.81134344 39.81134344 0 0 0-39.79701469-39.79701469z m238.80358219 0h-79.60119375a39.81134344 39.81134344 0 0 0-39.79701469 39.79701469A39.81850781 39.81850781 0 0 0 828.01910469 454.20895499h79.60119375a39.82567125 39.82567125 0 0 0 39.80417906-39.80417906 39.81850781 39.81850781 0 0 0-39.80417906-39.79701469z m79.60119375-119.40537281a39.81134344 39.81134344 0 0 0-39.79701469-39.79701563h-716.41791a39.81850781 39.81850781 0 0 0-39.80417906 39.79701563 39.83283563 39.83283563 0 0 0 39.80417906 39.80417906h716.41791a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906z"
                                                                    p-id="4233"></path>
                                                            </svg>
                                                        </span>
                                                        <span class="selection-name">顶部</span>
                                                    </div>
                                                    <div class="selection-span type-mode"
                                                        :class="{ 'active': dmStyle.mode === 3 }"
                                                        @click="dmStyle.mode = 3">
                                                        <span class="selection-icon">
                                                            <svg t="1700749744954" class="icon" viewBox="0 0 1192 1024"
                                                                version="1.1" xmlns="http://www.w3.org/2000/svg"
                                                                p-id="4427">
                                                                <path
                                                                    d="M1066.82985031 95.99999999c43.93791 0 79.59403031 35.66328375 79.59403031 79.60119375v796.01910469c0 43.94507438-35.65611938 79.60119375-79.59403031 79.60119375H111.59403031C67.66328375 1051.22149218 32 1015.5653728 32 971.6274628V175.5940303C32 131.66328374 67.66328375 95.99999999 111.60119375 95.99999999h955.22865656z m-119.40537281 756.22209h-716.41791a39.81850781 39.81850781 0 0 0-39.80417906 39.79701469 39.81850781 39.81850781 0 0 0 39.80417906 39.80417906h716.41791a39.81850781 39.81850781 0 0 0 39.79701469-39.80417906 39.81850781 39.81850781 0 0 0-39.79701469-39.79701469zM668.81671625 693.01253718H231.0065675a39.81850781 39.81850781 0 0 0-39.80417906 39.80417906 39.81850781 39.81850781 0 0 0 39.80417906 39.80417906h437.81014875a39.81850781 39.81850781 0 0 0 39.80417906-39.80417906 39.81850781 39.81850781 0 0 0-39.80417906-39.80417906z m238.80358219 0h-79.59402938a39.81850781 39.81850781 0 0 0-39.80417906 39.80417906 39.81850781 39.81850781 0 0 0 39.79701469 39.80417906h79.60119375a39.81850781 39.81850781 0 0 0 39.80417906-39.80417906 39.81850781 39.81850781 0 0 0-39.80417906-39.80417906z"
                                                                    p-id="4428"></path>
                                                            </svg>
                                                        </span>
                                                        <span class="selection-name">底部</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="player-mode-selection-row">
                                                <div class="row-title">颜色</div>
                                                <ColorPicker class="row-selection" v-model:color="dmStyle.color">
                                                </ColorPicker>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 弹幕输入框 -->
                                <el-input type="text" maxlength="100" placeholder="发个友善的弹幕见证当下" class="player-dm-input"
                                    v-model="input" />
                            </div>
                            <div class="player-dm-btn-send" @click="sendDm">发送</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.player-wrap {
    position: relative;
    // background-color: aqua; //测试，后续删除
}

.player-placeholder {
    position: absolute;
    display: flex;
    z-index: 0;
    width: 100%;
    height: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
    box-shadow: 0 0 8px var(--bg3);
    border: 1px solid red; //测试，后续删除
}

.player-placeholder-top {
    flex: 1;
    overflow: hidden;
    position: relative;
    background-color: #0000;
    border: 1px solid blue; //测试，后续删除
}

.player-placeholder-bottom {
    position: relative;
    display: flex;
    height: 46px;
    align-items: center;
    padding: 0 12px;
    background: var(--bg1);
}

.player-placeholder-bottom-left {
    margin-right: 10px;
    width: 176px;
    height: 22px;
    background-color: rgba(0, 0, 0, 0.04);
}

.player-placeholder-bottom-right {
    height: 22px;
    flex-grow: 1;
    background-color: rgba(0, 0, 0, 0.04);
}

//主体

.player {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: blueviolet;
}

.player-primary-area {
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    height: 100%;
    width: 100%;
}

.player-video-area {
    -webkit-box-flex: 1;
    background-color: #000;
    -ms-flex: 1;
    flex: 1;
    overflow: hidden;
    position: relative;
}

.player-video-area[data-ctrl-hidden=true] {
    cursor: none;
}

.player-video-area * {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.player-video-perch {
    -webkit-box-flex: 0;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex: none;
    flex: none;
    height: 100%;
    justify-content: center;
    position: relative;
    width: 100%;
}

.player-video-wrap {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    height: 100%;
    width: 100%;
}

.player-video-wrap video {
    content-visibility: visible;
    display: block;
    height: 100%;
    margin: auto;
    width: 100%;
}

.player-row-dm-wrap {
    cursor: pointer;
    height: 100%;
    width: 100%;
    z-index: 2;
    top: 0;
    left: 0;
    -webkit-mask-position: center;
    mask-position: center;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.player-row-dm-wrap {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
}

.state-pause .player-state {
    position: absolute;
    bottom: 62px;
    pointer-events: none;
    right: 34px;
    z-index: 48;
}

.state-paused[data-screen=full] .player-state,
.state-paused[data-screen=web] .player-state {
    bottom: 107px;
}

.state-buff .player-state {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 48;
}

.player-state-buff-icon,
.player-state-buff-text,
.player-state-play {
    display: none;
}

.state-paused .player-state-play {
    background: url(~assets/imgs/play.svg) 50% no-repeat;
    display: block;
    height: 64px;
    width: 64px;
}

.player-masking {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 58;
}

.player-top-wrap {
    color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    left: 0;
    top: 0;
    pointer-events: none;
    position: absolute;
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    z-index: 59;
}

.player-video-area[data-ctrl-hidden=true] .player-top-wrap {
    opacity: 0;
    visibility: hidden;
}

.player-video-area[data-ctrl-hidden=false] .player-top-wrap {
    opacity: 1;
    visibility: visible;
}

.player-top-left {
    left: 12px;
    margin-top: 18px;
    position: absolute;
}

.player-title {
    font-size: 20px;
    font-weight: 500px;
    line-height: 24px;
    overflow: hidden;
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100% !important;
    z-index: 2;
}

.player-video-area[data-screen=normal] .player-title {
    display: none;
}

.player-follow {
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-box-flex: 0;
    align-items: center;
    background-color: rgba(0, 0, 0, .4);
    border-radius: 26px;
    cursor: pointer;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex: 0;
    flex: 0;
    font-size: 12px;
    font-weight: 400;
    height: 32px;
    line-height: 32px;
    margin-bottom: 8px;
    pointer-events: all;
    text-align: center;
    width: 89px;
    z-index: 2;
}

.player-follow:hover {
    background-color: rgba(0, 0, 0, .6);
}

.player-follow-face {
    -webkit-box-flex: 0;
    border-radius: 50%;
    -ms-flex: none;
    flex: none;
    height: 24px;
    margin-left: 4px;
    vertical-align: bottom;
    width: 24px;
}

.player-follow-icon {
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    height: 12px;
    line-height: 12px;
    margin-left: 8px;
    width: 12px;
}

.player-follow-text {
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: none;
    margin-left: 5px;
}

.player-control-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 75;
}

.player-control-mask {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100px;
    pointer-events: none;
    -webkit-transition: opacity .2s ease-in-out;
    transition: opacity .2s ease-in-out;
    z-index: -1;
    background: url(~assets/imgs/shadow.png) repeat-x bottom;
}

.player-control-top {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 44px;
    opacity: 1;
    -webkit-transition: opacity .2s ease-out;
    transition: opacity .2s ease-out;
    visibility: visible;
}

.player-control-bottom {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    height: 35px;
    justify-content: space-between;
    line-height: 22px;
    margin: 30px 0 0;
    -webkit-transition: all .2s ease-out;
    transition: all .2s ease-out;
    width: 100%;
}

.player-control-bottom,
.player-control-top {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0 12px;
}

.player-control-bottom-left {
    -webkit-box-flex: 0;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -ms-flex: none;
    flex: none;
}

.player-ctrl-btn {
    position: relative;
    fill: #fff;
    color: #fff;
    font-size: 0;
    height: 22px;
    line-height: 22px;
    outline: 0;
    text-align: center;
    width: 36px;
    z-index: 2;
    opacity: 0.8;

    &:hover {
        opacity: 1;
    }
}

.player-ctrl-btn-icon {
    cursor: pointer;
    width: 100%;
}

.common-svg-icon {
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    height: 100%;
    width: 100%;
}

.player-ctrl-btn-icon .common-svg-icon {
    height: 22px;
    opacity: .9;
    vertical-align: middle;
}

.common-svg-icon svg {
    -webkit-transition: fill .15s ease-in-out;
    transition: fill .15s ease-in-out;
    height: 100% !important;
    width: 100% !important;
}

.player-ctrl-time {
    font-size: 12px;
    margin-right: 10px;
    min-width: 90px;
}

.player-ctrl-time-label {
    height: 100%;
    position: absolute;
    text-align: center;
    white-space: nowrap;
    width: 100%;
}

.player-ctrl-time-divide {
    padding: 0 4px;
}

.player-sending-bar {
    -ms-flex-negative: 0;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 20px;
    padding: 0 12px;
    position: relative;
    -webkit-box-flex: 0;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 13px;
    justify-content: space-between;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
}

.player-dm-root {
    -webkit-box-flex: 1;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex: auto;
    flex: auto;
    height: 34px;
}

.player-dm-switch,
.player-dm-setting {
    cursor: pointer;
    height: 24px;
    line-height: 30px;
    margin-right: 12px;
    position: relative;
    width: 24px;
}

.player-dm-setting-wrap {
    display: none;
    background: none;
    border: none;
    border-radius: 4px 4px 0 0;
    bottom: 39px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: default;
    font-size: 12px;
    height: 359px;
    position: absolute;
    right: -149px;
    text-align: left;
    width: 320px;
    z-index: 1001;
}

.player-dm-setting.state-show .player-dm-setting-wrap {
    display: block;
}

.player-sending-bar .player-dm-outside {
    fill: hsla(0, 0%, 100%, .9);
}

.player-sending-area {
    -webkit-box-flex: 0;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    background: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    -ms-flex: none;
    flex: none;
    font-size: 12px;
    height: 46px;
    justify-content: space-between;
    padding: 0 12px;
    font-size: 13px;
}

.player-sending-area .player-dm-outside {
    fill: #61666D;
    transition: fill 0.1s;
}

.player-sending-area .player-dm-outside:hover {
    fill: var(--brand_pink);
}

.player-dm-setting-wrap {
    display: none;
    background: none;
    border: none;
    border-radius: 4px 4px 0 0;
    bottom: 39px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: default;
    font-size: 12px;
    height: 359px;
    position: absolute;
    right: -149px;
    text-align: left;
    width: 320px;
    z-index: 1001;
}

.player-dm-setting.state-show .player-dm-setting-wrap {
    display: block;
}

.player-dm-setting-box {
    border-radius: 2px;
    bottom: 0;
    position: absolute;
    right: 0;
}

.player-dm-setting-left {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    padding: 12px 20px;
    width: 100%;
}

.player-dm-setting-left-opacity {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 16px;
    line-height: 16px;
    margin-bottom: 16px;
    width: 100%;
}

.player-dm-setting-left-speed {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 22px;
    line-height: 22px;
    width: 100%;
}

.player-dm-setting-left-title {
    color: #fff;
    height: 16px;
    line-height: 15px;
    text-align: left;
}

.player-dm-setting-left-content {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 12px;
    margin-left: 10px;
    width: 200px;
}

.dm-speed-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-gap: 10px;
    width: 100%;
}

.dm-speed-item {
    background: hsla(0, 0%, 100%, .2);
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
    text-align: center;
}

.dm-speed-item.active {
    background: var(--brand_pink);
}

.player-dm-setting-left-progress {
    width: 182px !important;
    margin: auto;
}

.player-dm-inputbar {
    position: relative;
    display: flex;
    display: -webkit-box;
    display: -ms-flexbox;
    align-items: center;
    -ms-flex-align: center;
    flex-grow: 1;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    background: #F1F2F3;
    color: #999;
    border-radius: 8px;
    height: 32px;
    min-width: 300px;
    width: calc(100% - 72px);
}

.player-video-area[data-screen=full] .player-sending-bar .player-dm-inputbar,
.player-video-area[data-screen=web] .player-sending-bar .player-dm-inputbar {
    background: none;
    background-color: hsla(0, 0%, 100%, .3);
    color: hsla(0, 0%, 100%, .6);
    margin: 0 auto;
    padding: 0;
}

.player-video-inputbar-wrap {
    position: relative;
    display: flex;
    display: -webkit-box;
    display: -ms-flexbox;
    -webkit-box-align: center;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    align-items: center;
    -ms-flex-align: center;
    border-radius: 8px 0 0 8px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    width: 200px;
}

.player-dm-btn-send {
    border-radius: 0 8px 8px 0;
    height: 100%;
    line-height: 32px;
    min-width: 62px;
    font-size: 13px;
    overflow: hidden;
    text-align: center;
    width: 62px;
    z-index: 13;
    background-color: var(--brand_pink);
    color: #fff;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: 0.3s all;
}

.player-dm-btn-send:hover {
    background-color: var(--Pi4);
}

.player-dm-input {
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    flex-grow: 1;
    height: 28px;
    line-height: 28px;
    min-width: 100px;
    padding: 0 10px 0 5px;
    width: 100%;
    z-index: 12;
    outline: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border: 0;
}

.player-video-area[data-screen=full] .player-sending-bar .player-dm-input,
.player-video-area[data-screen=web] .player-sending-bar .player-dm-input {
    --el-text-color-placeholder: rgba(255, 255, 255, 0.6);
}

.player-dm-input ::v-deep .el-input__wrapper {
    padding: unset;
    box-shadow: none;
    width: 100%;
    background: none;
}

.player-dm-input ::v-deep .el-input__inner {
    height: inherit;
    line-height: inherit;
    color: #18191C;
}

.player-video-area[data-screen=full] .player-sending-bar .player-dm-input ::v-deep .el-input__inner,
.player-video-area[data-screen=web] .player-sending-bar .player-dm-input ::v-deep .el-input__inner {
    color: #fff;
}

.player-dm-btn-font {
    -webkit-box-flex: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    cursor: pointer;
    -ms-flex: none;
    flex: none;
    position: relative;
    text-align: center;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 6px;
}

.player-dm-btn-font:hover .player-dm-btn-font-icon {
    fill: var(--brand_pink);
}

.player-mode-selection-container {
    background: hsla(0, 0%, 8%, .9);
    border-radius: 2px;
    bottom: 39px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: none;
    height: auto;
    left: 50%;
    margin-left: -108px;
    padding: 2px 0 0;
    position: absolute;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 216px;
    z-index: 1001;
}

.player-dm-btn-font.state-show .player-mode-selection-container {
    display: block;
}

.player-mode-selection-panel {
    display: block;
    position: relative;
}

.player-mode-selection-row {
    font-size: 12px;
    line-height: 22px;
    margin: 10px 20px;
    min-height: 22px;
    position: relative;
    width: 176px;
}

.row-title {
    color: #fff;
    line-height: 16px;
    text-align: left;
}

.row-selection {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin: 8px -8px 0 0;
}

.selection-span {
    background: hsla(0, 0%, 100%, .2);
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
    margin-right: 8px;
    position: relative;
    text-align: center;
}

.selection-span:hover {
    background: hsla(0, 0%, 100%, .4);
}

.selection-span.type-fontsize {
    margin-bottom: 8px;
    width: 84px;
}

.selection-span.type-mode {
    fill: hsla(0, 0%, 100%, .8);
    background: transparent;
    color: hsla(0, 0%, 100%, .8);
    margin: -4px 22px 0 0;
}

.selection-span.type-mode:hover {
    fill: #fff;
    background: transparent;
    color: #fff;
}

.selection-span.active {
    background: var(--brand_pink);
    color: #fff;
}

.selection-span.active:hover {
    background: var(--brand_pink);
}

.selection-span.type-mode.active,
.selection-span.type-mode.active:hover {
    fill: var(--brand_pink);
    background: transparent;
    color: var(--brand_pink)
}

.selection-icon {
    border-radius: 2px;
    display: block;
    font-size: 26px;
    height: 26px;
    overflow: hidden;
    position: relative;
    text-align: center;
    width: 26px;
    z-index: 1;
}

.player-control-bottom-right {
    -webkit-box-pack: end;
    -ms-flex-pack: end;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    justify-content: flex-end;
}

.player-video-area[data-screen=full] .player-control-bottom-right,
.player-video-area[data-screen=web] .player-control-bottom-right {
    min-width: 378px;
}

.player-ctrl-playbackrate {
    font-size: 14px;
    width: 50px;
}

.player-ctrl-playbackrate-result {
    cursor: pointer;
    font-weight: 600;
    width: 100%;
}

.player-ctrl-playbackrate-menu {
    background-color: hsla(0, 0%, 8%, .9);
    border-radius: 2px;
    bottom: 41px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: none;
    left: 50%;
    margin: 0;
    padding: 0;
    position: absolute;
    text-align: center;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 70px;
}

.player-ctrl-playbackrate.state-show .player-ctrl-playbackrate-menu {
    display: block;
}

.player-ctrl-playbackrate-menu-item {
    cursor: pointer;
    list-style: none;
    height: 36px;
    line-height: 36px;
    position: relative;

    &:hover {
        background-color: hsla(0, 0%, 100%, .1);
    }
}

.player-ctrl-playbackrate-menu-item.state-active {
    color: var(--brand_pink);
}

.player-ctrl-setting-box {
    bottom: 41px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    display: none;
    font-size: 12px;
    position: absolute;
    right: -48px;
    text-align: left;
}

.player-ctrl-setting.state-show .player-ctrl-setting-box {
    display: block;
}

.player-ctrl-setting-menu {
    border-radius: 2px !important;
}

.player-ctrl-setting-menu-left {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
    padding: 6px 20px;
    width: 100%;
}

.player-ctrl-setting-loop,
.player-ctrl-setting-autoplay,
.player-ctrl-setting-autonext {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    height: 32px;
    line-height: 32px;
    width: 100%;
}

.player-ctrl-volume-box {
    background: hsla(0, 0%, 8%, .9);
    border-radius: 2px;
    bottom: 41px;
    display: none;
    height: 100px;
    left: 50%;
    margin-left: -16px;
    position: absolute;
    width: 32px;
}

.player-ctrl-volume.state-show .player-ctrl-volume-box {
    display: block;
}

.player-ctrl-volume-number {
    color: #e5e9ef;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    margin-bottom: 2px;
    text-align: center;
    width: 100%;
}

.player-ctrl-volume-progress {
    height: 60px !important;
    margin: 0 auto;
}

.player-ctrl-volume-progress ::v-deep .v-ui-area {
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
}

.player-video-area[data-ctrl-hidden=false] .player-shadow-progress-area,
.player-video-area[data-ctrl-hidden=true] .player-control-top {
    opacity: 0;
    visibility: hidden;
}

.player-shadow-progress-area {
    bottom: 0;
    height: 2px;
    left: 0;
    position: absolute;
    right: 0;
    -webkit-transition: opacity .4s ease-in;
    transition: opacity .4s ease-in;
}

.player-video-area[data-ctrl-hidden=true] .player-shadow-progress-area {
    opacity: 1;
    visibility: visible;
}

.player-shadow-progress-schedule-wrap {
    height: 100%;
    position: relative;
    width: 100%;
}

.player-progress-schedule {
    background-color: hsla(0, 0%, 100%, .2);
    border-radius: 1.5px;
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: absolute;
    right: 0;
    top: 0;
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

.player-progress-schedule-buffer {
    background-color: hsla(0, 0%, 100%, .3);
}

.player-progress-schedule-current {
    background-color: var(--brand_pink);
}

@media (min-width:750px) {

    .player-video-area[data-screen=full] .player-control-bottom-center,
    .player-video-area[data-screen=web] .player-control-bottom-center {
        -webkit-box-flex: 1;
        -ms-flex-positive: 1;
        flex-grow: 1;
        height: 34px;
        line-height: 34px;
        padding: 0 60px;
    }

    .player-video-area[data-screen=full] .player-control-bottom-right,
    .player-video-area[data-screen=web] .player-control-bottom-right {
        min-width: 370px;
    }
}

@media (min-width:1681px) {

    .player-dm-switch,
    .player-dm-setting {
        margin-right: 18px;
    }

    .player-dm-inputbar {
        height: 40px;
        width: calc(100% - 84px);
    }

    .player-dm-btn-send {
        width: 64px;
        font-size: 14px;
        line-height: 40px;
    }

    .player-sending-area {
        font-size: 14px;
        height: 56px;
    }
}

@media (max-width:1200px) {

    .player-video-area[data-screen=full] .player-control-bottom-center,
    .player-video-area[data-screen=web] .player-control-bottom-center {
        padding: 0;
    }

    .player-video-area[data-screen=full] .player-control-bottom-right,
    .player-video-area[data-screen=web] .player-control-bottom-right {
        min-width: 272px;
    }
}

@media (max-width:1366px) {}
</style>