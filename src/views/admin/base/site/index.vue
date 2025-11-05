<!-- 站点属性 -->
<template>
  <div class="top-center-bottom">
    <div class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.name" placeholder="名称" size="small" style="width: 200px">
            <template #prepend>名称</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.code" placeholder="编码" size="small" style="width: 200px">
            <template #prepend>编码</template>
          </el-input>
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button size="small" type="primary" @click="getList">查询</el-button>
          <el-button size="small" type="success" @click="add">添加</el-button>
        </div>
      </div>
    </div>

    <div class="center">
      <el-table :data="tableData" border style="height: 100%">
        <el-table-column label="配置项code" prop="code" width="200" />
        <el-table-column label="配置项名称" prop="name" width="200" />
        <el-table-column label="配置项值" prop="value">
          <template #default="scope">
            <el-text line-clamp="4">{{ scope.row.value }}</el-text>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button size="small" type="primary" @click="exit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleted(scope.row)">删除</el-button>
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
        layout="total, sizes, prev, pager, next"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>

  <el-dialog v-model="addVisible" :title="addTable" width="500px">
    <el-form ref="siteConfigForm" :model="datas" :rules="rules" label-width="100px" status-icon>
      <div>
        <el-form-item label="名称" prop="name">
          <el-input v-model="datas.name" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="datas.code" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="datas.value" type="textarea" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { requestConfigDeletedBlogConfig, requestConfigGetConfigList, requestConfigUpdateBlogConfig } from '@/http/interface/api';

const siteConfigForm = ref<FormInstance>(); // 修改或 新增表单
const tableData = ref([]); //角色list
const addVisible = ref(false); //添加角色框
const datas = ref({ name: '', code: '' }); //添加或修改data
const addTable = ref('添加配置'); //添加或修改标题
const queryParam = ref({
  //搜索条件
  name: '',
  code: '',
  page: {
    pageSize: 5, //每页多少条
    total: 0, //共多少条
    pageNum: 1, //当前页
  },
});
const pagination = ref({
  pageSize: 20, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});
onMounted(() => {
  getList();
});

const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请填写变量名称',
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: '请填写变量编码',
      trigger: 'blur',
    },
  ],
  value: [
    {
      required: true,
      message: '请填写变量内容',
      trigger: 'blur',
    },
  ],
});

const getList = () => {
  queryParam.value.page = pagination.value;
  requestConfigGetConfigList(queryParam.value).then((data: any) => {
    tableData.value = data.list;
    pagination.value.pageNum = data.pageNum;
    pagination.value.pageSize = data.pageSize;
    pagination.value.total = data.total;
  });
}; // 删除
const deleted = (row: any) => {
  let ids = [];
  ids.push(row.id);
  let data = {
    id: ids,
  };
  requestConfigDeletedBlogConfig(data).then((res: any) => {
    getList();
  });
};
//添加或修改 站点设置
const addSubmit = () => {
  // 表单验证
  if (siteConfigForm.value) {
    siteConfigForm.value.validate((valid) => {
      if (valid) {
        requestConfigUpdateBlogConfig(datas.value).then((res: any) => {
          getList();
          addVisible.value = false;
          datas.value.name = '';
        });
      } else {
        console.log('表单校验失败');
        return false;
      }
    });
  }
};
//添加
const add = () => {
  addTable.value = '添加配置';
  datas.value = { name: '', code: '' };
  addVisible.value = true;
}; // 修改
const exit = (row: any) => {
  console.log(row);
  addTable.value = '修改配置';
  datas.value = {
    id: row.id,
    name: row.name,
    code: row.code,
    value: row.value,
  };
  console.log(datas.value);
  addVisible.value = true;
};
// 每页条数被改变
const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize; //每页多少条被改变
  handleCurrentChange(1);
  getList();
}; //换页
const handleCurrentChange = (currentPage: number) => {
  pagination.value.pageNum = currentPage;
  getList();
};
</script>

<style lang="scss" scoped>
.top-center-bottom {
  display: flex;
  flex-direction: column;
  height: 100%;

  .center {
    flex: 1;
    max-height: calc(100% - 78px) !important;
  }
}
</style>
