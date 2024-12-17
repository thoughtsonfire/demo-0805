<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { userInfoStore } from './stores/userInfo';
const userStore = userInfoStore()
onMounted(() => {
  let userBaseInfo = localStorage.getItem('userBaseInfo')
  if (userBaseInfo) {
    userBaseInfo = JSON.parse(userBaseInfo)
    userStore.setIsloading(true)
    userStore.setUserBaseInfo(userBaseInfo)
  }
})
</script>

<template>
  <RouterView />
</template>

<style>
#app {
  margin: 0 auto;
  max-width: var(--v-max-w);
  background-color: var(--bg1);
}
</style>
