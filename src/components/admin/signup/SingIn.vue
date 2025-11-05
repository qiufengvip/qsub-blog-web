<template>
  <div class="login-main">
    <div class="title">🍁欢迎注册🍁</div>
    <el-form ref="formEl" size="default" :model="user" :rules="rules" class="form">
      <el-form-item class="form-item" prop="nickname">
        <el-input v-model="user.nickname" size="default" :prefix-icon="Brush" class="form-input" placeholder="请输入昵称" />
      </el-form-item>

      <el-form-item class="form-item" prop="userName">
        <el-input v-model="user.userName" size="default" :prefix-icon="User" class="form-input" placeholder="请输入用户名(用于登录)" />
      </el-form-item>

      <el-form ref="formElSub" :model="user" :rules="rulesSub" class="item-form">
        <el-form-item class="form-item" prop="mail">
          <el-input v-model="user.mail" size="default" :prefix-icon="Message" class="form-input" placeholder="请输入邮箱" />
        </el-form-item>
        <div class="form-item-verify">
          <el-form-item prop="verify">
            <el-input v-model="user.verify" size="default" :prefix-icon="ScaleToOriginal" class="form-input-verify" placeholder="验证码" />
          </el-form-item>
          <div class="verify-img">
            <el-tooltip size="default" class="box-item" content="看不清?点击更换" placement="bottom-start">
              <img v-if="verifyCode" :src="verifyCode" alt="verify" @click="getVerifyCode" />
            </el-tooltip>
          </div>
        </div>
      </el-form>

      <div class="form-item-verify">
        <el-form-item prop="mailVerify">
          <el-input v-model="user.mailVerify" size="default" :prefix-icon="ScaleToOriginal" class="form-input-verify" placeholder="邮箱验证码" />
        </el-form-item>
        <div class="verify-img">
          <el-button size="default" :loading="sendLoading" style="width: 100%" type="primary" @click="sendCode(formElSub)">
            {{ sendCountdown }}
          </el-button>
        </div>
      </div>
      <el-form-item class="form-item" prop="password">
        <el-input v-model="user.password" size="default" :prefix-icon="Lock" class="form-input" placeholder="请输入密码" show-password />
      </el-form-item>

      <el-form-item class="form-item" prop="confirmPassword">
        <el-input v-model="user.confirmPassword" size="default" :prefix-icon="Lock" class="form-input" placeholder="确认密码" show-password />
      </el-form-item>
    </el-form>
    <div class="operation">
      <el-button size="default" :loading="loginLoading" class="login-button" color="#626aef" type="primary" @click="singInSubmit(formEl)">注册 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { requestGetMailCode, requestGetVerifyCode, requestSignUp } from '@/http/interface/api';
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';
import { inject, onMounted, reactive, Ref, ref } from 'vue';
import { Brush, Lock, Message, ScaleToOriginal, User } from '@element-plus/icons';
import { UserLogin, UserSingIn } from '@/utils/interface/base';
import { verifyMail, verifyNickName, verifyPassword, verifyUserName } from '@/utils/dataDispose';

const userLogin = inject('userLogin') as Ref<UserLogin>;

const user = ref<UserSingIn>({
  confirmPassword: '',
  mail: '',
  mailVerify: '',
  nickname: '',
  password: userLogin.value.password,
  userName: userLogin.value.userName,
  verify: '',
});
const sendCountdown = ref('获取');
const formEl = ref<FormInstance>();
const formElSub = ref<FormInstance>();
const loginLoading = ref(false);
const sendLoading = ref(false);
const verifyCode = ref();

let router = useRouter();

onMounted(() => {
  getVerifyCode();
});
const validateNickname = (rule: any, value: any, callback: any) => {
  if (verifyNickName.test(value)) {
    callback();
  } else {
    callback(new Error('昵称应为2到14位(字母、汉字、下划线)'));
  }
};
const validateUserName = (rule: any, value: any, callback: any) => {
  if (verifyUserName.test(value)) {
    callback();
  } else {
    callback(new Error('用户名应为4到16位(字母,数字,下划线,减号)'));
  }
};

const validatePassword = (rule: any, value: any, callback: any) => {
  if (verifyPassword.test(value)) {
    callback();
  } else {
    callback(new Error('密码大于6位包含(大小写字母,数字,特殊符号)'));
  }
};

const validatePasswordAffirm = (rule: any, value: any, callback: any) => {
  if (user.value.password == user.value.confirmPassword) {
    callback();
  } else {
    callback(new Error('两次输入的密码不一致'));
  }
};

const rules = reactive<FormRules>({
  nickname: [
    {
      validator: validateNickname,
      trigger: 'blur',
    },
  ],
  userName: [
    {
      validator: validateUserName,
      trigger: 'blur',
    },
  ],
  password: [
    {
      validator: validatePassword,
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    {
      validator: validatePasswordAffirm,
      trigger: 'blur',
    },
  ],
  mailVerify: [
    { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '邮箱验证码为六位字符', trigger: 'blur' },
  ],
});
const validateMail = (rule: any, value: any, callback: any) => {
  if (verifyMail.test(value)) {
    callback();
  } else {
    callback(new Error('邮箱不正确'));
  }
};

const rulesSub = reactive<FormRules>({
  mail: [
    {
      validator: validateMail,
      trigger: 'blur',
    },
  ],
  verify: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 4, message: '验证码为四位字符', trigger: 'blur' },
  ],
});
let countTime: number = 60;
// 倒计时
let timer: any;

const task = () => {
  console.log('倒计时');
  if (countTime == 0) {
    clearInterval(timer);
    sendCountdown.value = '获取';
    sendLoading.value = false;
  } else {
    countTime--;
    sendCountdown.value = '获取(' + countTime + ')';
  }
};
const sendCode = async (form: FormInstance | undefined) => {
  if (!form) return;
  await form.validate(async (valid, fields) => {
    if (valid) {
      sendLoading.value = true;
      console.log('执行');
      countTime = 60;
      timer = setInterval(task, 1000);
      let params = {
        mail: user.value.mail,
        verify: user.value.verify,
      };
      console.log(params);
      await requestGetMailCode(params).then(() => {
        getVerifyCode();
      });
      ElMessage.success('发送成功');
    }
  });
};

/**
 * 获取验证码
 */
const getVerifyCode = async () => {
  console.log('刷新验证码');
  let imgBlob: any = await requestGetVerifyCode();
  verifyCode.value = URL.createObjectURL(imgBlob);
};

const loginPage = inject('loginPage') as any;
const singInSubmit = async (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  await formRef.validate((valid, fields) => {
    if (valid) {
      loginLoading.value = true;
      requestSignUp(user.value)
        .then((data: any) => {
          if (data == 100001) {
            getVerifyCode();
            loginLoading.value = false;
            return;
          }
          userLogin.value.userName = user.value.userName;
          userLogin.value.password = user.value.password;
          loginPage();
          ElMessage.success('注册成功!');
          loginLoading.value = false;
        })
        .catch(() => {
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

    .item-form {
      padding: 0;
      width: 100%;
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
