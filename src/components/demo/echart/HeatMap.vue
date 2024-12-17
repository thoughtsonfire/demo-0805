<!-- 区域分级 -->

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
const echartBox = ref()
const loadGeoJSON = async () => {
    const response: any = await fetch('/maps/china.json')
    return response.json();
};
const setChart = async () => {
    const myChart = echarts.init(echartBox.value)
    const geoJson = await loadGeoJSON()
    let arr: any = []
    geoJson.features.forEach((item: any) => {
        let obj = {
            name: item.properties.name,
            id: (item.properties && item.properties.id) || item.id,
        };
        arr.push(obj);
    });
    console.log(arr);
    echarts.registerMap('china', geoJson);
    // option：echart的核心配置对象，通过它可以全面控制图表的内容和样式
    const option = {
        title: {
            left: 'center',
            text: '区域分级',
            top: '10%'
        },
        //series 是用来配置图表中具体数据系列的部分，多组数据则是将多组数据在同一张图上显示                    
        series: [
            {
                type: 'map',
                map: 'china',
                data: [
                    {
                        name: "阿坝藏族羌族自治州",
                        //自定义区域的颜色
                        itemStyle: {
                            areaColor: '#F50508',
                            borderColor: '#1773c3', // 区域边框
                            shadowColor: '#1773c3', // 阴影
                        }
                    }
                ]
            }
        ]
    }
    myChart.setOption(option)
    window.addEventListener('resize', () => {
        myChart.resize()
    })
    myChart.on('click', params => {
        console.log(params);

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