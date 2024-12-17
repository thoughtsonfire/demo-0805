<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
const mapRef = ref()
const loadGeoJSON = async () => {
    const response = await fetch('/maps/china.json');
    return response.json();
};
const setChart = async () => {
    const myChart = echarts.init(mapRef.value)
    const geoJson = await loadGeoJSON();
    echarts.registerMap('china', geoJson);
    const data = [
        { name: '阿坝藏族羌族自治州' }
    ]
    const points = [
        { name: '阿坝藏族羌族自治州', value: [102.221374, 31.899792], info: "aaaaaa" }
    ];
    const option = {
        title: {
            text: "大屏地图测试",
            left: 'center'
        },
        tooltip: {

        },
        geo: {
            type: 'map',
            map: 'china',
            data: data, // 将数据添加到系列中
            zoom: 12, // 设置缩放级别
            center: [102.221374, 31.899792], // 调整中心位置
            itemStyle: { // 地图样式
                areaColor: '#282C34',  //区域颜色
                borderColor: '#ffffff',  //边框颜色
                borderWidth: 1
            },
            emphasis: {
                itemStyle: {
                    areaColor: '#4adcf0',
                    borderColor: '#404a59',
                    borderWidth: 2 // 可以调整边框宽度和颜色
                }
            },
            select: {
                itemStyle: { // 地图样式
                    areaColor: '#282C34',  //区域颜色
                    borderColor: '#ffffff',  //边框颜色
                    borderWidth: 1
                },
                label: {
                    color: 'black'
                }
            }
        },
        series: [
            {
                type: 'map',
                map: 'china',
                data: data, // 将数据添加到系列中
                zoom: 12, // 设置缩放级别
                center: [102.221374, 31.899792], // 调整中心位置
                itemStyle: { // 地图样式
                    areaColor: '#282C34',  //区域颜色
                    borderColor: '#ffffff',  //边框颜色
                    borderWidth: 1
                },
                emphasis: {
                    itemStyle: {
                        areaColor: '#4adcf0',
                        borderColor: '#404a59',
                        borderWidth: 2 // 可以调整边框宽度和颜色
                    }
                },
                select: {
                    itemStyle: { // 地图样式
                        areaColor: '#282C34',  //区域颜色
                        borderColor: '#ffffff',  //边框颜色
                        borderWidth: 1
                    },
                    label: {
                        color: 'black'
                    }
                }
            },
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: points,
                symbolSize: 20,
                itemStyle: {
                    color: 'red'
                }
            }
        ]
    }

    myChart.setOption(option);
    myChart.dispatchAction({
        type: 'highlight', //高亮
        seriesIndex: 0,
        dataIndex: 0, //数据index,要显示的区域
    })
    mapRef.value.addEventListener("mouseenter", () => {
        myChart.dispatchAction({
            type: 'downplay',
            seriesIndex: 0,
            dataIndex: 0
        })
    })
    mapRef.value.addEventListener("mouseleave", () => {
        myChart.dispatchAction({
            type: 'highlight', //高亮
            seriesIndex: 0,
            dataIndex: 0, //数据index,要显示的区域
        })
    })
    // 添加点击事件监听器
    myChart.on('click', (params) => {
        if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
            const clickedPoint = points[params.dataIndex];
            if (clickedPoint) {
                console.log(`Clicked Point: ${clickedPoint.name}, Coordinates: ${clickedPoint.value}`);
                alert(`Clicked Point: ${clickedPoint.name}\nCoordinates: ${clickedPoint.value}`);
            }
        }
    });
}

onMounted(() => {
    setChart()
})
</script>

<template>
    <div id="map" ref="mapRef"></div>
</template>

<style scoped>
#map {
    width: 100%;
    height: 100vh;
    /* 设置地图高度为视口高度 */
}
</style>