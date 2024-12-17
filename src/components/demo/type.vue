<script setup lang="tsx">
import { ref, computed } from 'vue'
import { CountData } from './introduced.vue';
import HelloWorld from './jsx.vue'
import HellowTSX from './tsx.vue'
type FooType = {
    id: string
}
const emit = ref<number>(0)
const bar = ref<FooType | null>(null)

const count = computed(() => CountData.count)
const increment = () => {
    CountData.count++
}
const testEmit = (data: number) => {
    emit.value = data
    console.log(emit.value);

}

const Header = (
    <div>
        header
    </div>
)
</script>

<template>
    <Header></Header>
    <div>
        <div>{{ count }}</div>
        <button @click="increment">+</button>
    </div>
    <HelloWorld></HelloWorld>
    <div>emit:{{ emit }}</div>
    <HellowTSX :testProp="count" @testEmit="testEmit">
        <template #testSlot>
            <div>父组件在插槽中写的内容</div>
        </template>
    </HellowTSX>
    <div class="box">
        <div class="item">
            <div class="test"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@layer base {
    .box {
        width: 500px;
        height: 500px;
        background-color: red;

        .item {
            width: 300px;
            height: 300px;
            background-color: green;

            .test {
                width: 100px;
                height: 100px;
                background-color: blue;
            }
        }
    }
}

@layer responsive {
    @media (min-width: 1000px) {
        .test {
            background-color: black;
        }
    }
}
</style>