import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'

export const userInfoStore = defineStore('userInfo',()=>{
    const isLoading = ref<boolean>(false)

    const userBaseInfo = ref<any>(null)

    const setIsloading = (data:boolean)=>{
        isLoading.value=data
    }

    const setUserBaseInfo = (data:any)=>{

        userBaseInfo.value=data
    }

    return {isLoading,userBaseInfo,setIsloading,setUserBaseInfo}
})