<!-- 水波 -->

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const echartBox = ref()
const loadGeoJSON = async () => {
    const response = await fetch('/maps/china.json')
    return response.json();
};
const setChart = async () => {
    const myChart = echarts.init(echartBox.value)
    const geoJson = await loadGeoJSON()
    echarts.registerMap('china', geoJson);
    // option：echart的核心配置对象，通过它可以全面控制图表的内容和样式
    const option = {
        title: {
            left: 'center',
            text: '水波',
            top: '10%'
        },
        geo: {
            map: 'china',
            show: true,
            roam: true,
            label: {
                emphasis: {
                    show: false
                }
            },
            // 地图的背景色
            itemStyle: {
                normal: {
                    areaColor: '#091632',
                    borderColor: '#9adcfa',
                    shadowColor: '#09184F',
                    shadowBlur: 20
                }
            }
        },
        //series 是用来配置图表中具体数据系列的部分，多组数据则是将多组数据在同一张图上显示                    
        series: [
            {
                type: 'map',
                map: 'china',
            },
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',  //使用地理坐标系
                //要有对应的经纬度才显示，先经度再维度
                data: [{ name: '阿坝藏族羌族自治州', value: [102.221374, 31.899792] }],
                showEffectOn: 'render',  //绘制完成后显示特效
                rippleEffect: {
                    scale: 4, // 波纹的最大缩放比例
                    brushType: 'stroke'
                },
                hoverAnimation: true,
                label: {  //图形上的文本标签
                    show: true,
                    formatter: '{b}',
                    position: 'right',
                    fontWeight: 500,
                    fontSize: 10
                },
                //默认样式
                itemStyle: {
                    color: '#32cd32',
                    shadowBlur: 10,
                    shadowColor: '#333'
                },
                //鼠标移入时样式
                emphasis: {
                    itemStyle: {
                        color: '#f4e925' // 高亮颜色
                    }
                },
                zlevel: 1
            }
        ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => {
        myChart.resize()
    })
}
onMounted(() => {
    setChart()
})

</script>

<template>
    <div id="echartBox" ref="echartBox"></div>
</template>

<style scoped lang="scss">
#echartBox {
    width: 100vw;
    height: 100vh;
}
</style>