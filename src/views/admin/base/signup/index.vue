<template>
  <div class="body">
    <transition name="el-zoom-in-center">
      <div v-show="show" class="signup">
        <Login v-if="tab === 0" @loginSuccess="loginSuccess"></Login>
        <SingIn v-if="tab === 1"></SingIn>
        <div class="control">
          <el-button size="default" link type="warning">无法登陆?点击找回密码</el-button>
        </div>
        <div class="control">
          <el-button size="default" link type="primary">用户协议</el-button>
          <el-button v-show="tab === 0" size="default" link type="primary" @click="singIn">注册</el-button>
          <el-button v-show="tab === 1" size="default" link type="primary" @click="loginPage">返回登录</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import Login from '@/components/admin/signup/Login.vue';
import { provide, ref } from 'vue';
import SingIn from '@/components/admin/signup/SingIn.vue';
import { UserLogin } from '@/utils/interface/base';
import { useRouter } from 'vue-router';

let router = useRouter();
const userLogin = ref<UserLogin>({ userName: '', password: '', verify: '' });
provide('userLogin', userLogin);
const show = ref(true);
const tab = ref(0);
const loginSuccess = () => {
  router.push({ path: '/admin' });
};
const singIn = () => {
  tab.value = 1;
  show.value = false;

  setTimeout(() => {
    show.value = true;
  }, 200);
};
const loginPage = () => {
  tab.value = 0;
  show.value = false;
  setTimeout(() => {
    show.value = true;
  }, 200);
};
provide('loginPage', loginPage);
</script>

<style scoped lang="scss">
.body {
  overflow-x: hidden;
  overflow-y: hidden;
  height: 100vh;
  min-height: 700px;
  background: url(../../../../assets/img/login.jpg) 50% fixed no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  .signup {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    width: 400px;
    background: rgba(31, 31, 31, 0.36);
    margin-right: 10%;
    padding: 20px;
  }
  .control {
    margin-top: 10px;
  }
}

@media screen and (max-width: 800px) {
  .signup {
    margin-left: 10%;
  }
}
</style>
