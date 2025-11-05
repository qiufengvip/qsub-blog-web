<template>
  <div ref="main" class="top-center-bottom">
    <div ref="queryParamMain" class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.nickname" placeholder="昵称" size="small" style="width: 200px">
            <template #prepend>昵称</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.userName" placeholder="用户名" size="small" style="width: 200px">
            <template #prepend>用户名</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.phone" placeholder="手机号" size="small" style="width: 230px">
            <template #prepend>手机号</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.email" placeholder="邮箱" size="small" style="width: 250px">
            <template #prepend>邮箱</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-select v-model="queryParam.state" placeholder="账户状态" size="small" style="width: 150px">
            <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button size="small" type="success" @click="getUserList">查询</el-button>
        </div>
        <div class="query-param">
          <el-button :disabled="!(multipleSelection.length > 0)" size="small" type="primary" @click="changePassword"> 修改密码 </el-button>
        </div>
        <div class="query-param">
          <el-button :disabled="!(multipleSelection.length > 0)" size="small" type="primary" @click="liftBanned"> 解封账户 </el-button>
        </div>
        <div class="query-param">
          <el-button :disabled="!(multipleSelection.length > 0)" size="small" type="warning" @click="updateBannedVisible = true">封禁账户 </el-button>
        </div>

        <div class="query-param">
          <el-button :disabled="!(multipleSelection.length > 0)" size="small" type="danger" @click="removeUser"> 删除用户 </el-button>
        </div>
      </div>
    </div>
    <div ref="centerMain" class="center">
      <el-table ref="userTable" :data="tableData" :row-class-name="tableRowClassName" border stripe style="height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" width="100" />
        <el-table-column fixed label="头像" width="70">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column fixed label="昵称" prop="nickname" width="150" />
        <el-table-column fixed label="用户名" prop="userName" width="150" />
        <el-table-column label="邮箱" prop="email" width="200" />
        <el-table-column label="用户积分" prop="score" width="100" />
        <el-table-column label="注册地址" width="150" prop="ip" />
        <el-table-column label="封禁到期时间" prop="blockedTime" min-width="200" />
        <el-table-column fixed="right" label="操作" width="160">
          <template #default="scope">
            <el-button size="small" type="primary" @click="editUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleClick">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div ref="bottomMain" class="qsub-pagination">
      <el-pagination
        :page-size="pagination.pageSize"
        :page-sizes="[20, 60, 100, 300]"
        :total="pagination.total"
        background
        layout="prev, pager, next"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <user-edit v-if="userEditShow" :userId="userId" @canceled="canceled"></user-edit>
    <el-dialog v-model="updateBannedVisible" :width="500" title="批量封禁用户">
      <el-form-item label="封禁到期时间">
        <el-date-picker v-model="blockedTime" placeholder="封禁到期时间" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" />
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="updateBannedVisible = false">取消</el-button>
          <el-button type="primary" @click="submitBanned">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { requestUserGetUserList, requestUserRemove, requestUserUpdateBanned, requestUserUpdateLiftBanned, requestUserUpdatePassword, selectConstantData } from '@/http/interface/api';
import { onMounted, ref } from 'vue';
import { User } from '@/utils/interface/base';
import { ElMessage, ElMessageBox } from 'element-plus';
import { verifyPassword } from '@/utils/dataDispose';
import userEdit from '@/components/admin/user/userEdit.vue';

const queryParam = ref<any>({});
const stateList = ref([]);
const tableData = ref([]);
const pagination = ref({
  pageSize: 20, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});
const userEditShow = ref(false);

const canceled = () => {
  userEditShow.value = false;
  getUserList();
};

onMounted(() => {
  selectConstantData({ code: 'userState' }).then((data: any) => {
    stateList.value = data;
    getUserList();
  });
});

// account:"秋枫"
// deleted:false
// email:null
// gitee:null
// github:null
// avatar:"http://file.qsub.cn/userimg.png"
// id:"53353e20741246ec93f044d202ec647e"
// ip:"127.0.0.1"
// password:"deaa8ba7b5880ae4ec3c42d531205689"
// phone:"18510960070"
// rn:0
// userName:"秋枫"

const userId = ref<number>(0);
/**
 * @desc 修改用户
 */
const editUser = (row: User) => {
  // row.id
  userId.value = row.id;
  userEditShow.value = true;
};
const multipleSelection = ref<User[]>([]);
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};
const updateBannedVisible = ref<boolean>(false);
/**
 * @desc 单元格的状态 区分正常用户和封禁用户(success-row)与 注销(warning-row)用户
 */
const tableRowClassName = ({ row, rowIndex }: { row: User; rowIndex: number }) => {
  console.log(row);
  if (row.deleted) {
    console.log(row);
    return 'info-row';
  } else if (new Date() < new Date(row.blockedTime)) {
    return 'warning-row';
  }
  return '';
};
const handleClick = (click: any) => {
  console.log(click);
};
/**
 * @desc 获取用户列表
 */
const getUserList = () => {
  queryParam.value.pageSize = pagination.value.pageSize;
  queryParam.value.pageNum = pagination.value.pageNum;
  requestUserGetUserList(queryParam.value).then((res: any) => {
    tableData.value = res.list;
    pagination.value.pageNum = res.pageNum;
    pagination.value.total = res.total;
  });
};
/**
 * @desc 每页条数被改变
 * @param pageSize
 */
const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize; //每页多少条被改变
  handleCurrentChange(1);
  getUserList();
};

/**
 * @desc 换页
 * @param currentPage
 */
const handleCurrentChange = (currentPage: number) => {
  pagination.value.pageNum = currentPage;
  getUserList();
};
/**
 * 解封账户
 */
const liftBanned = () => {
  ElMessageBox.confirm('您要将您所选择的用户解除封禁吗?')
    .then(() => {
      requestUserUpdateLiftBanned({
        id: multipleSelection.value.map((o) => {
          return o.id;
        }),
      }).then(() => {
        ElMessage.success('解封成功');
        getUserList();
      });
    })
    .catch(() => {});
};

/**
 * @desc 修改密码
 */
const changePassword = () => {
  ElMessageBox.prompt('请输入新密码,历史密码不可找回', '修改用户密码', {
    confirmButtonText: '确认修改',
    cancelButtonText: '取消',
    buttonSize: 'small',
    inputPattern: verifyPassword, //密码校验正则表达式
    inputErrorMessage: '最少6位，包括至少1个字母，1个数字，1个特殊字符',
  })
    .then(({ value: str }) => {
      console.log('密码', str);
      let parent = {
        id: multipleSelection.value.map((o) => o.id),
        password: str,
      };

      requestUserUpdatePassword(parent).then((data) => {
        ElMessage.success('修改成功');
      });
    })
    .catch(() => {});
};
/**
 * @desc 删除用户
 */
const removeUser = () => {
  ElMessageBox.confirm('您要将您所选择的用户全部删除吗?')
    .then(() => {
      requestUserRemove({
        id: multipleSelection.value.map((o) => {
          return o.id;
        }),
      }).then(() => {
        ElMessage.success('删除成功');
        getUserList();
      });
    })
    .catch(() => {});
};

const blockedTime = ref();

const submitBanned = () => {
  let blocked = new Date(blockedTime.value);
  let time = new Date();
  let number = blocked.getTime() - time.getTime();
  if (number < 0) {
    ElMessage.error('选择的时间应该大于当前时间!');
    return '';
  }
  console.log(number);
  number = number / 1000; // 秒
  let d = parseInt(number / (60 * 60 * 24)); //天
  let h = parseInt((number - d * 60 * 60 * 24) / (60 * 60)); // 小时
  let m = parseInt((number - d * 60 * 60 * 24 - h * 60 * 60) / 60); // 分
  let s = parseInt(number - d * 60 * 60 * 24 - h * 60 * 60 - m * 60); // 秒
  console.log(d, h, m, s);
  let timeString = '';
  if (d != 0) {
    timeString += d + '天';
  }
  if (h != 0) {
    timeString += h + '小时';
  }
  if (m != 0) {
    timeString += m + '分';
  }
  if (s != 0) {
    timeString += s + '秒';
  }
  ElMessageBox.confirm('您要将您所选择的用户封禁' + timeString + '吗?')
    .then(() => {
      requestUserUpdateBanned({
        blockedTime: blockedTime.value,
        id: multipleSelection.value.map((o) => {
          return o.id;
        }),
      }).then(() => {
        ElMessage.error('已封禁' + multipleSelection.value.length + '个用户');
      });
      updateBannedVisible.value = false;
      getUserList();
    })
    .catch(() => {});
};
</script>

<style lang="scss" scoped>
:deep(.warning-row) {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);

  .el-table-fixed-column--left,
  .el-table-fixed-column--right {
    background: var(--el-color-warning-light-9);
  }
}

:deep(.info-row) {
  --el-table-tr-bg-color: var(--el-color-info-light-9);

  .el-table-fixed-column--left,
  .el-table-fixed-column--right {
    background: var(--el-color-info-light-9);
  }
}

.common-layout {
  height: 100%;
}

.example-pagination-block .example-demonstration {
  margin-bottom: 16px;
}

.el-container {
  display: flex;
  flex-direction: column;
}

.el-header {
  height: 100px;
}

.qsub-main {
  flex: 1;
}

.el-footer {
  height: 100px;
}

.top-center-bottom {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-center-bottom .top {
  height: 60px;
}

.top-center-bottom .center {
  flex: 1;
}
</style>
