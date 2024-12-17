<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/request/api'
const url = ref("")
const list = ref([
    1,
    2,
    3,
    4,
    5
])
onMounted(() => {

    // 获取文件输入元素
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    // 处理文件选择事件
    fileInput.addEventListener('change', (event) => {
        const files = (event.target as HTMLInputElement).files;

        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();

            // 文件读取完成后的回调
            reader.onload = () => {
                // 获取Base64字符串
                const base64String = reader.result as string;
                url.value = base64String
                // 输出到控制台或日志
                console.log('Base64 String:', base64String);
            };

            // 读取文件为Data URL（Base64编码）
            reader.readAsDataURL(file);
        }
    });

    const box = document.getElementById('box')
    box?.addEventListener('scroll', () => {

        const boxRect = box.getBoundingClientRect()
        const height = boxRect.height
        const scrollHeight = box.scrollHeight - box.scrollTop
        // console.log();


        if (scrollHeight - height < 300) {
            let temp = JSON.parse(JSON.stringify(list.value))
            list.value = [...list.value, ...temp]
            console.log(list.value);

            console.log('111');

        }




    })

    const data = [{ a: 1 }];

    const grouped = data.reduce((acc: any, item) => {
        // 获取属性 a 的值
        const key = item.a;

        // 如果键不存在于累加器对象中，则初始化为空数组
        if (!acc[key]) {
            acc[key] = [];
        }

        // 将当前项添加到对应的数组中
        acc[key].push(item);

        return acc;
    }, {});
    console.log(grouped, 'grouped');

    // 将对象转换为数组
    const result = Object.values(grouped);

    console.log(result);
})
</script>

<template>
    <input type="file" id="fileInput" />
    <img :src="url" alt="" style="width:100px;height: 100px;">
    <div id="box">
        <div class="item" v-for="(item, index) in list" :key="item">

        </div>
    </div>
</template>

<style scoped>
#box {
    width: 100px;
    height: 200px;
    /* background: red; */
    overflow-y: scroll;
}

.item {
    height: 50px;
    margin-bottom: 10px;
    background: blue;
}
</style>