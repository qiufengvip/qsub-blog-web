<template>
  <el-dialog v-model="dialogVisible" width="600" title="编辑用户" :before-close="cancel">
    <el-form ref="formEl" class="user-edit" :model="userForm" size="default" label-width="120px" :rules="rules">
      <el-tabs type="border-card" class="demo-tabs">
        <el-tab-pane label="人员编辑">
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
            <el-date-picker v-model="userForm.birthday" type="date" value-format="YYYY-MM-DD" placeholder="生日" />
          </el-form-item>

          <el-form-item label="性别">
            <el-radio-group v-model="userForm.gender" placeholder="性别">
              <el-radio v-for="item in sexList" :key="item.value" :label="item.value" border>{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="免审核">
            <el-switch v-model="userForm.auditFree" inline-prompt active-text="开" inactive-text="关" />
          </el-form-item>

          <el-form-item label="个性签名">
            <el-input v-model="userForm.motto" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" size="small" />
          </el-form-item>

          <el-form-item label="用户积分">
            <el-input-number v-model="userForm.score" />
          </el-form-item>

          <el-form-item label="github">
            <el-input v-model="userForm.github" size="small" />
          </el-form-item>

          <el-form-item label="gitee">
            <el-input v-model="userForm.gitee" size="small" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="账户状态">
          <el-alert title="封禁时间如果小于此刻则为正常状态" type="warning" effect="dark" />
          <el-form-item label="用户状态">
            <el-select v-model="userForm.deleted" placeholder="用户移除状态">
              <el-option label="移除" :value="true" />
              <el-option label="正常" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="封禁到期时间">
            <el-date-picker v-model="userForm.blockedTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime" placeholder="封禁到期时间" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="角色管理">
          <el-alert title="请谨慎分配管理员等高权限角色" type="warning" effect="dark" />
          <el-checkbox-group v-model="userRole" :min="1">
            <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id" border>{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit(formEl)"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox, FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { requestRuleGetRoleList, requestUserGetUserInfo, requestUserUpdateUserInfo, selectConstantData } from '@/http/interface/api';
import { User } from '@/utils/interface/base';
import { imgFileType, verifyNickName } from '@/utils/dataDispose';

const props = defineProps({
  userId: {
    type: Number,
    default: 0,
  },
});
const dialogVisible = ref(true);
const userForm = ref<User>({});
const sexList = ref();
const roleList = ref();
const userRole = ref();
const userEditVisible = ref();
const formEl = ref<FormInstance>();

const emits = defineEmits(['canceled']);

//新建/编辑时取消
const cancel = () => {
  ElMessageBox.confirm('您编辑的内容还未保存确定要关闭窗口吗?')
    .then(() => {
      emits('canceled'); //回调给列表执行取消后方法
    })
    .catch(() => {
      // catch error
    });
};

onMounted(() => {
  getUserData();
});
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
    },
  ],
});

const getUserData = async () => {
  selectConstantData({ code: 'sex' }).then((data: any) => {
    sexList.value = data;
  });
  requestRuleGetRoleList({}).then((data: any) => {
    roleList.value = data;
  });
  await requestUserGetUserInfo({ id: props.userId })
    .then((item: any) => {
      userForm.value = item.userData;
      userRole.value = item.roles.map((o: any) => o.id);
    })
    .catch((e) => {});
};

/**
 * 关闭修改用户页
 */
const userEditClose = () => {
  ElMessageBox.confirm('您编辑的内容还未保存确定要关闭窗口吗?')
    .then(() => {
      userEditVisible.value = false;
    })
    .catch(() => {
      // catch error
    });
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

const submit = async (formRef: FormInstance | undefined) => {
  if (!formRef) return;
  await formRef.validate((valid, fields) => {
    if (valid) {
      let parent: any = userForm.value;
      parent.userRole = userRole.value;
      requestUserUpdateUserInfo(parent).then((data) => {
        ElMessage.success('修改成功');
        emits('canceled'); //回调给列表执行取消后方法
      });
    } else {
      ElMessage.error('用户昵称编辑错误');
    }
  });
};
</script>

<style scoped>
:deep(.el-tabs__content) {
  height: 500px;
  overflow: auto;
}
.el-alert {
  margin-bottom: 10px;
}
</style>
