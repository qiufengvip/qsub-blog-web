<template>
  <el-form ref="formRef" class="user-edit" :model="userForm" label-position="left" size="default" label-width="auto" :rules="rules" style="margin: 10px">
    <el-form-item label="头像">
      <el-upload :before-upload="beforeImgUpload" :on-success="userImgSuccess" :show-file-list="false" action="/api/base/sysFile/upload" class="avatar-uploader">
        <el-avatar :size="100" :src="userForm.avatar" />
      </el-upload>
    </el-form-item>

    <el-form-item label="登录名">
      <el-input v-model="userForm.userName" disabled size="small" />
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="userForm.nickname" size="small" />
    </el-form-item>

    <el-form-item label="邮箱">
      <el-input v-model="userForm.email" disabled size="small" />
    </el-form-item>

    <el-form-item label="生日">
      <el-date-picker v-model="userForm.birthday" type="date" style="width: 100%" value-format="YYYY-MM-DD" placeholder="生日" />
    </el-form-item>

    <el-form-item label="性别">
      <el-radio-group v-model="userForm.gender" placeholder="性别">
        <el-radio v-for="item in sexList" :key="item.value" size="small" :value="parseInt(item.value)" :label="item.value" border>{{ item.label }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="个性签名">
      <el-input v-model="userForm.motto" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" size="small" />
    </el-form-item>

    <el-form-item label="用户积分">
      <el-input-number v-model="userForm.score" size="small" disabled />
    </el-form-item>

    <el-form-item label="github">
      <el-input v-model="userForm.github" size="small" />
    </el-form-item>

    <el-form-item label="gitee">
      <el-input v-model="userForm.gitee" size="small" />
    </el-form-item>
    <div class="action-bar">
      <el-button type="primary" @click="saveData">保存</el-button>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { User } from '@/utils/interface/base';
import { selectConstantData } from '@/http/interface/api';
import { ElMessage, FormRules } from 'element-plus';
import { checkLogin, imgFileType, verifyNickName } from '@/utils/dataDispose';
import { getMeInfo, saveMeInfo } from '@/http/interface/admin/user';
const formRef = ref();
const userForm = ref<User>({
  auditFree: 0,
  avatar: '',
  birthday: '',
  blockedTime: '',
  createTime: '',
  deleted: false,
  email: '',
  gender: 0,
  gitee: '',
  github: '',
  id: 0,
  ip: '',
  lastLoginTime: '',
  motto: '',
  nickname: '',
  password: '',
  phone: '',
  rn: '',
  score: 0,
  userName: '',
});
const sexList = ref<any[]>([]);
const getUserData = async () => {
  selectConstantData({ code: 'sex' }).then((data: any) => {
    sexList.value = data;
  });
};
const validateNickname = (rule: any, value: any, callback: any) => {
  if (verifyNickName.test(value)) {
    callback();
  } else {
    callback(new Error('昵称应为2到14位(字母、汉字、下划线)'));
  }
};
const rules = reactive<FormRules>({
  nickname: [
    {
      validator: validateNickname,
      trigger: 'blur',
      required: true,
    },
  ],
});
/**
 * 初始化
 */
const init = () => {
  getMeInfo().then((res: any) => {
    userForm.value = res.userData;
  });
};

const saveData = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean, fields) => {
    if (valid) {
      saveMeInfo(userForm.value)
        .then((data) => {
          ElMessage.success('修改成功');
          checkLogin();
        })
        .catch((err) => {});
    }
  });
};

onMounted(() => {
  getUserData();
  init();
});
//文件上传前 验证函数
const beforeImgUpload = (rawFile: any) => {
  console.log(rawFile.type);
  if (rawFile.type in imgFileType) {
    //判断文件类型
    ElMessage.error('文件格式只能为' + imgFileType);
    return false;
  } else if (rawFile.size / 1024 / 1024 > 1) {
    // 判断文件大小
    ElMessage.error('文件最大为 1MB!');
    return false;
  }
  return true;
};
const userImgSuccess = (response: any, uploadFile: any, uploadFiles: any) => {
  if (response) {
    if (response.code == 0) {
      ElMessage.success(response.msg);
      userForm.value.avatar = response.data;
    } else {
      ElMessage.error(response.msg);
    }
  } else {
    ElMessage.error('上传失败,网络异常');
  }
  console.log(response, uploadFile, uploadFiles);
};
</script>

<style scoped lang="scss">
.action-bar {
  width: 100%;
  text-align: center;
}
</style>
