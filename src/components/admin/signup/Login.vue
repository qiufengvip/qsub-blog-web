<template>
  <div class="login-main">
    <div class="title">欢迎登录</div>
    <el-form ref="formEl" size="default" :model="user" :rules="rules" class="form">
      <el-form-item class="form-item" prop="userName">
        <el-input v-model="user.userName" size="default" :prefix-icon="UserFilled" class="form-input" placeholder="请输入账号" width="50px" />
      </el-form-item>
      <el-form-item class="form-item" prop="password">
        <el-input v-model="user.password" size="default" :prefix-icon="Lock" class="form-input" placeholder="请输入密码" show-password width="50px" />
      </el-form-item>

      <div class="form-item-verify">
        <el-form-item prop="verify">
          <el-input v-model="user.verify" size="default" :prefix-icon="ScaleToOriginal" class="form-input-verify" placeholder="验证码" />
        </el-form-item>
        <div class="verify-img">
          <el-tooltip class="box-item" content="看不清?点击更换" placement="bottom-start">
            <img v-if="verifyCode" :src="verifyCode" alt="verify" @click="getVerifyCode" />
          </el-tooltip>
        </div>
      </div>
    </el-form>
    <div class="operation">
      <el-button size="default" :loading="loginLoading" class="login-button" color="#626aef" type="primary" @click="loginSubmit(formEl)">登录 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { requestGetVerifyCode, requestLogin } from '@/http/interface/api';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { inject, onMounted, reactive, Ref, ref } from 'vue';
import { Lock, ScaleToOriginal, UserFilled } from '@element-plus/icons';
import { UserLogin } from '@/utils/interface/base';
import { ApplicationError } from '@/utils/error';

const user = inject('userLogin') as Ref<UserLogin>;
const emit = defineEmits(['loginSuccess']);
const formEl = ref<FormInstance>();
const loginLoading = ref(false);
const verifyCode = ref();

onMounted(() => {
  getVerifyCode();
});

const rules = reactive<FormRules>({
  userName: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
  verify: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码为四位字符', trigger: 'change' },
  ],
});

/**
 * 获取验证码
 */
const getVerifyCode = async () => {
  console.log('刷新验证码');
  let imgBlob: any = await requestGetVerifyCode();
  verifyCode.value = URL.createObjectURL(imgBlob);
};

const loginSubmit = async (formRef: FormInstance | undefined) => {
  console.log('登录');
  if (!formRef) return;
  console.log('登录吖');
  await formRef.validate((valid, fields) => {
    if (valid) {
      loginLoading.value = true;
      requestLogin(user.value)
        .then((data: any) => {
          ElMessage.success('登录成功');
          let userData: any = { name: data.tokenName, value: data.tokenValue };
          sessionStorage.setItem('token', JSON.stringify(userData));
          sessionStorage.setItem('user', JSON.stringify(data.user));
          sessionStorage.setItem('admin-menu', JSON.stringify(data.menuList));
          emit('loginSuccess');
        })
        .catch((e) => {
          if (e instanceof ApplicationError) {
            console.log(e.getError());
            getVerifyCode();
          }
          loginLoading.value = false;
        });
    }
  });
};
</script>

<style lang="scss" scoped>
.login-main {
  width: 250px;

  .title {
    color: white;
    //width: 100%;
    text-align: center;
    padding: 20px;
    font-size: 23px;
    font-weight: bold;
    border-bottom: 1px solid var(--content-color);
  }

  .form {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 10px;

    .form-item-verify {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .form-input-verify {
        width: 120px;
      }

      .verify-img {
        width: 90px;
        height: 32px;
        border-radius: 5px;

        img {
          border-radius: 5px;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
    }

    .form-item {
      display: flex;
      //justify-content: center;
      align-items: center;
      width: 100%;
      //padding: 10px;

      .form-input {
        width: 100%;
      }
    }
  }

  .login-button {
    width: 100%;
  }

  .operation {
    display: flex;
    //width: 100%;
    align-items: center;
    justify-content: space-around;
    padding: 0 10px 0 10px;
  }
}
</style>
