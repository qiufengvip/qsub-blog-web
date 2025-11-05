<template>
  <el-dialog v-model="dialogOverflowVisible" width="350" draggable overflow @close="close(false)">
    <transition name="el-zoom-in-center">
      <div v-show="show" class="signup">
        <Login v-if="tab === 0" @loginSuccess="close(true)"></Login>
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
  </el-dialog>
</template>
<script setup lang="ts">
import Login from '@/components/admin/signup/Login.vue';
import { onMounted, provide, ref } from 'vue';
import SingIn from '@/components/admin/signup/SingIn.vue';
import { UserLogin } from '@/utils/interface/base';
const dialogOverflowVisible = ref(true);
onMounted(() => {
  dialogOverflowVisible.value = true;
});
const userLogin = ref<UserLogin>({ userName: '', password: '', verify: '' });
provide('userLogin', userLogin);
const show = ref(true);
const tab = ref(0);
const emit = defineEmits(['exit']);
const close = (status: boolean) => {
  emit('exit', status);
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
<style lang="scss" scoped>
:deep(.login-main) {
  width: 100%;
  .title {
    color: var(--text-color);
  }
}
.signup {
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.control {
  margin-top: 10px;
}
</style>
