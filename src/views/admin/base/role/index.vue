<!-- 角色管理 -->
<template>
  <div class="top-center-bottom">
    <div class="query-param-main">
      <div class="query-param-term"></div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button size="small" type="primary" @click="getRoleList">查询</el-button>
          <el-button size="small" type="success" @click="addRole">添加</el-button>
          <el-button size="small" type="danger" @click="deleted">删除</el-button>
        </div>
      </div>
    </div>
    <div class="center">
      <el-table :data="tableData" border style="" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="id" prop="id" width="300" />
        <el-table-column label="角色code" prop="roleCode" width="200" />
        <el-table-column label="角色名称" prop="roleName" width="200" />
        <el-table-column label="角色类型" prop="roleType">
          <template #default="scope">
            <template v-for="item in roleType">
              <div v-if="item.value === scope.row.roleType" class="tree-resourceType">
                {{ item.label }}
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button size="small" type="primary" @click="exitRole(scope.row)">编辑</el-button>
            <el-button size="small" type="success" @click="addUser(scope.row)">添加人员</el-button>
            <el-button size="small" type="danger" @click="deleted(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom"></div>
  </div>

  <el-dialog v-model="addRoleVisible" :title="addRoleTable" width="400px">
    <el-form ref="ruleForm" size="small" :model="roleData" label-width="100px">
      <div>
        <el-form-item label="角色code编码" prop="roleCode">
          <el-input v-model="roleData.roleCode" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleData.roleName" />
        </el-form-item>
        <el-form-item label="角色类型" prop="roleType">
          <el-select v-model="roleData.roleType" placeholder="角色类型">
            <el-option v-for="(item, idx) in roleType" :key="idx" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" size="small" @click="addRoleVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="addRuleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="addUserToRoleVisible" :title="addUserToRole" width="700px">
    <div class="dialog-main">
      <el-transfer
        v-model="transferValue"
        :data="transferData"
        :props="{
          key: 'virtualUserId',
          label: 'userName',
        }"
        :titles="['未添加', '已添加']"
      />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" size="small" @click="addUserToRoleVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="addUserToRoleCom">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { requestRuleAddRole, requestRuleDeleted, requestRuleGetRoleList, requestUserGetUserList, requestUserRoleGetUserRole } from '@/http/interface/api';
import { User } from '@/utils/interface/base';

const tableData = ref([]); //角色list
const roleType = ref([
  {
    //角色 Type
    label: '普通角色',
    value: 1,
  },
]);
const addRoleVisible = ref(false); //添加角色框
const roleData = ref<any>({ roleName: '', roleCode: '', roleType: 1 }); //添加或修改角色data
const addRoleTable = ref('添加角色'); //添加或修改角色标题
const addUserToRole = ref('添加用户'); //添加用户框标题
const addUserToRoleVisible = ref(false); // 添加用户框
const transferData = ref([]); //添加用户穿梭框data
const transferValue = ref([]); //已经添加用户
const roleId = ref(''); //当前选中的roleId

onMounted(() => {
  getRoleList();
});

const multipleSelection = ref<any[]>([]);
const handleSelectionChange = (val: User[]) => {
  multipleSelection.value = val;
};

const getRoleList = () => {
  requestRuleGetRoleList({}).then((data: any) => {
    tableData.value = data;
  });
}; // 删除
const deleted = (row: any) => {
  if (row) {
    ElMessageBox.confirm('您要将' + row.roleName + '角色删除吗?')
      .then(() => {
        let ids = [];
        ids.push(row.id);
        let data = {
          id: ids,
        };
        requestRuleDeleted(data).then((res: any) => {
          getRoleList();
        });
      })
      .catch(() => {});
  } else {
    ElMessageBox.confirm('您要将您所选择' + multipleSelection.value.length + '个角色删除吗?')
      .then(() => {
        let data = {
          id: multipleSelection.value.map((o) => {
            return o.id;
          }),
        };
        requestRuleDeleted(data).then((res: any) => {
          getRoleList();
        });
      })
      .catch(() => {});
  }
};
//添加角色 提交
const addRuleSubmit = () => {
  if (!roleData.value.roleName) {
    ElMessage.error('请填写角色名');
    return;
  }
  requestRuleAddRole(roleData).then((res: any) => {
    ElMessage.success('添加成功');
    getRoleList();
    addRoleVisible.value = false;
    roleData.value.roleName = '';
  });
};
//添加角色
const addRole = () => {
  addRoleTable.value = '添加角色';
  roleData.value = {};
  addRoleVisible.value = true;
}; // 修改角色
const exitRole = (row: any) => {
  console.log(row);
  addRoleTable.value = '修改角色';
  roleData.value = {
    id: row.id,
    roleName: row.roleName,
    roleCode: row.roleCode,
  };
  console.log(roleData);
  addRoleVisible.value = true;
};
//
const addUserToRoleCom = () => {
  let roleIds = [];
  roleIds.push(roleId.value);
  let data = {
    roleIds: JSON.stringify(roleIds),
    userIds: JSON.stringify(transferValue.value),
  };
  requestUserRoleGetUserRole(data).then((res: any) => {
    if (res.code === 0) {
      ElMessage.success(res.msg);
      addUserToRoleVisible.value = false;
    } else {
      ElMessage.error(res.msg);
    }
  });
  console.log(transferValue);
};
//获取用户
const getTransferData = () => {
  requestUserGetUserList({ pageSizeZero: true, pageSize: 0 }).then((res: any) => {
    if (res.code) {
      ElMessage.error(res.msg);
    } else {
      transferData.value = res.list;
      // _this.transferValue = res.list[0].id;
    }
  });
};
const addUser = (row: any) => {
  roleId.value = row.id;
  requestUserRoleGetUserRole({ roleId: row.id }).then((res: any) => {
    if (res.code === 0) {
      addUserToRoleVisible.value = true;
      transferData.value = res.data.list;
      transferValue.value = res.data.includeList;
    } else {
      ElMessage.error(res.code);
    }
  });
};
</script>

<style scoped></style>
