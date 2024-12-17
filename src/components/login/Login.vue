<script setup lang="ts">
import { ref, defineExpose, nextTick } from 'vue';
import { userInfoStore } from '@/stores/userInfo';
import api from '@/request/api'
import { ElMessage } from 'element-plus'
const userStore = userInfoStore()
const loginDialogVisible = ref<boolean>(false)
const userNameLogin = ref<string>("")
const passWordLogin = ref<string>("")
function submitLogin() {
    let params = {
        "userName": userNameLogin.value,
        "passWord": passWordLogin.value
    }
    api.login(params).then((res: any) => {
        if (res.data.token) {
            localStorage.setItem('Authorization', res.data.token)
            localStorage.setItem('userBaseInfo', JSON.stringify(res.data.user))
            userStore.setUserBaseInfo(res.data.user)
            userStore.setIsloading(true)
            loginDialogVisible.value = false
        } else if (res.status === 401) {
            ElMessage.error(res.message)
        }
    })
}


defineExpose({ loginDialogVisible });
</script>

<template>
    <el-dialog v-model="loginDialogVisible">
        <div class="login-register">
            <div class="canvas-wrapper">

            </div>
            <div class="login-register-container">
                <el-tabs class="login-tabs">
                    <el-tab-pane label="登录">
                        <div class="login-box">
                            <el-input class="input" type="text" clearable placeholder="请输入账号"
                                v-model="userNameLogin"></el-input>
                            <el-input class="input" type="password" show-password placeholder="请输入密码"
                                v-model="passWordLogin"></el-input>
                            <div class="submit" @click="submitLogin">登录</div>
                            <div class="tips">登录即代表你同意我们的<span class="agreement">用户协议</span></div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="注册">
                        <div class="register-box"></div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </el-dialog>
</template>

<style scoped lang="scss">
.login-register {
    display: flex;
}

.canvas-wrapper {
    width: 360px;
    height: 360px;
}

.login-register-container {
    width: 360px;
    height: 360px;
    padding: 30px 40px;
}

.log-tabs {
    width: 80%;
    margin: 0 auto;
}

.login-box,
.register-box {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input,
.submit,
.tips {
    margin-top: 30px;
    width: 100%;
}

.submit {
    color: #fff;
    border-radius: 4px;
    background-color: var(--brand_pink);
    text-align: center;
    padding: 10px 15px;
    letter-spacing: 14px;
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: var(--brand_pink_hover);
    }
}

.tips {
    color: var(--text2);
    font-size: 12px;
    text-align: center;
}

.agreement {
    color: var(--brand_blue);
    margin-left: 14px;
    cursor: pointer;
}

/* element 元素 */
.el-input {
    --el-input-focus-border: #ccc;
    --el-input-focus-border-color: #ccc;
    --el-input-border-radius: 10px;
    --el-input-height: 40px;
}

.el-input ::v-deep .el-input__inner {
    padding: 8px 15px;
}

.el-input ::v-deep .el-input__icon {
    margin-right: 8px;
}

.login-register-container ::v-deep .el-tabs__active-bar {
    height: 3px;
}

.login-register-container ::v-deep .el-tabs__nav-wrap::after {
    height: 0;
}

.login-register-container ::v-deep .el-tabs__item {
    font-size: 17px;
}
</style>