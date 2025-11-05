<!--系统变量-->
<template>
  <div ref="main" class="top-center-bottom">
    <div ref="queryParamMain" class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.code" placeholder="代码" size="small" style="width: 200px">
            <template #prepend>变量代码</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.name" placeholder="名称" size="small" style="width: 200px">
            <template #prepend>变量名称</template>
          </el-input>
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button size="small" type="success" @click="getList">查询</el-button>
        </div>
        <div class="query-param">
          <el-button size="small" type="primary" @click="addConstant">添加变量</el-button>
        </div>
      </div>
    </div>
    <div ref="centerMain" class="center">
      <el-table ref="userTable" :data="tableData" border style="height: 100%">
        <el-table-column fixed label="序号" type="index" width="60" />
        <el-table-column fixed label="代码" prop="code" width="150" />
        <el-table-column fixed label="名称" prop="name" width="150" />
        <el-table-column label="介绍" prop="explanation" />
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button size="small" type="success" @click="getConstantData(scope.row.id)">查看常量值</el-button>
            <el-button size="small" type="primary" @click="exitConstantData(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleted(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

  <el-dialog v-model="addConstantVisible" :title="addConstantTable" width="500px">
    <el-form ref="ruleForm" :model="constantData" label-width="100px">
      <div>
        <el-form-item label="code" prop="name">
          <el-input v-model="constantData.code" size="default" />
        </el-form-item>
        <el-form-item label="变量名称" prop="name">
          <el-input v-model="constantData.name" size="default" />
        </el-form-item>
        <el-form-item label="变量介绍" prop="name">
          <el-input v-model="constantData.explanation" size="default" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" type="danger" @click="addConstantVisible = false">取消</el-button>
        <el-button size="small" type="primary" @click="addConstantSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="addConstantDataVisible" :title="addConstantDataTable" width="600px">
    <div ref="queryParamMain" class="query-param-main">
      <div class="query-param-term"></div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button size="small" type="primary" @click="addConstantData">添加值</el-button>
        </div>
      </div>
    </div>
    <el-table ref="userTable" :data="constantDataList" border style="height: 100%">
      <!--            <el-table-column fixed type="index" width="50" label="序号"/>-->
      <el-table-column fixed label="值" prop="value" width="150" />
      <el-table-column label="介绍" prop="label" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button size="small" type="primary" @click="exitData(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteData(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" type="primary" @click="addConstantDataVisible = false">确定</el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="addData" :title="addDataTable" width="500px">
    <el-form ref="ruleForm" :model="addDataForm" label-width="100px">
      <div>
        <el-form-item label="值(整数)" prop="name">
          <el-input v-model="addDataForm.value" size="small" />
        </el-form-item>
        <el-form-item label="解释" prop="name">
          <el-input v-model="addDataForm.label" size="small" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" type="danger" @click="addData = false">取消</el-button>
        <el-button size="small" type="primary" @click="addDataSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';
import { requestConstantAdd, requestConstantAddData, requestConstantDelete, requestConstantDeleteData, requestConstantSelectData, requestConstantSelectList } from '@/http/interface/api';

const queryParam = ref({
  name: '',
});
const tableData = ref([]);
const addConstantVisible = ref(false);
const addConstantTable = ref('添加常量');
const constantData = ref<any>({ name: '' });
const addConstantDataVisible = ref(false);
const addConstantDataTable = ref('查看变量情况');
const constantDataList = ref([]);

const addData = ref(false); //添加变量值框
const addDataTable = ref('添加变量值');
const addDataForm = ref<any>({
  value: '',
  label: '',
  constantId: '',
});
const currentConstantValue = ref();

onMounted(() => {
  getList();
});

const getList = () => {
  requestConstantSelectList(queryParam.value).then((res: any) => {
    tableData.value = res;
  });
};
//添加常量
const addConstant = () => {
  addConstantVisible.value = true;
  addConstantTable.value = '添加常量';
  constantData.value = {};
}; //添加变量提交
const addConstantSubmit = () => {
  requestConstantAdd(constantData.value).then((res: any) => {
    ElMessage.success(constantData.value?.id ? '修改成功' : '添加成功');
    //刷新列表
    addConstantVisible.value = false;
    getList();
  });
}; //删除整个变量
const deleted = (id: string) => {
  requestConstantDelete({ id: id }).then((res: any) => {
    ElMessage.success('删除成功');
    getList();
  });
};
//修改常量值
const exitConstantData = (row: any) => {
  addConstantVisible.value = true;
  addConstantTable.value = '修改常量';
  constantData.value = JSON.parse(JSON.stringify(row));
};
//查看常量值
const getConstantData = (id: string = '') => {
  currentConstantValue.value = id;
  console.log(id);
  requestConstantSelectData({ id: id }).then((res: any) => {
    currentConstantValue.value = id;
    constantDataList.value = res;
    addConstantDataVisible.value = true;
  });
};
//添加变量值
const addConstantData = () => {
  addData.value = true;
  addDataForm.value = {};
  addDataForm.value.constantId = currentConstantValue.value;
};
const addDataSubmit = () => {
  requestConstantAddData(addDataForm.value).then((res: any) => {
    getConstantData(addDataForm.value.constantId);
    ElMessage.success(addDataForm.value?.id ? '修改成功' : '添加成功');
    addData.value = false;
  });
};
//修改值
const exitData = (row: any) => {
  addData.value = true;
  addDataTable.value = '修改变量值';
  addDataForm.value = JSON.parse(JSON.stringify(row));
};
const deleteData = (id: string) => {
  requestConstantDeleteData({ id: id }).then((res: any) => {
    getConstantData(currentConstantValue.value);
    ElMessage.success('删除成功');
  });
};
</script>

<style scoped></style>
