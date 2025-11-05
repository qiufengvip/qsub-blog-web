<!--标签管理-->
<template>
  <div class="top-center-bottom">
    <div class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.linkName" style="width: 200px" size="small" placeholder="输入网站名称">
            <template #prepend>网站名称</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.linkUrl" style="width: 200px" size="small" placeholder="输入网址">
            <template #prepend>网址</template>
          </el-input>
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button type="primary" size="small" @click="getList">查询</el-button>
          <el-button type="success" size="small" @click="addLink">新建</el-button>
          <el-button type="danger" size="small" @click="deletedLink">删除</el-button>
        </div>
      </div>
    </div>
    <div class="center">
      <el-table border :data="tableData" style="height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column fixed type="index" width="60" label="序号" align="center" />
        <el-table-column prop="fileUrl" label="头像" width="80" align="center">
          <template #default="scope">
            <el-avatar :src="scope.row.fileUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="linkName" label="网站名称" width="200" />
        <el-table-column prop="linkUrl" label="网站地址" width="200" />
        <el-table-column prop="motto" label="座右铭" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="warning" size="small" @click="updateLink(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div ref="bottomMain" class="bottom">
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
  </div>

  <el-dialog v-model="addVisible" :title="addTable" width="500px">
    <el-form ref="formRef" :model="dataEntity" :rules="rules" label-width="100px" status-icon>
      <div>
        <el-form-item label="网站名称" prop="linkName">
          <el-input v-model="dataEntity.linkName" />
        </el-form-item>
        <el-form-item label="头像地址" prop="fileUrl">
          <el-input v-model="dataEntity.fileUrl" />
        </el-form-item>
        <el-form-item label="网站地址" prop="linkUrl">
          <el-input v-model="dataEntity.linkUrl" />
        </el-form-item>
        <el-form-item label="座右铭" prop="motto">
          <el-input v-model="dataEntity.motto" />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input v-model="dataEntity.remark" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="addVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';
import { deleted, detail, getPageList, saveOrUpdate } from '@/http/interface/blog/link';

const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val.map((item: any) => item.id);
};
const formRef = ref();

const updateLink = (id: number) => {
  detail({ id: id })
    .then((res) => {
      dataEntity.value = res;
      addTable.value = '修改友链';
      addVisible.value = true;
    })
    .catch((e) => {});
};
/**
 * 添加友情链接
 */
const addLink = () => {
  addTable.value = '新增友链';
  dataEntity.value = {};
  addVisible.value = true;
};
const addVisible = ref(false);
const addTable = ref('新建友链');

const rules = ref({
  linkName: [
    {
      required: true,
      message: '网站名称不能为空',
      trigger: 'blur',
    },
  ],
  fileUrl: [
    {
      required: true,
      message: '头像地址不能为空',
      trigger: 'blur',
    },
  ],
  linkUrl: [
    {
      required: true,
      message: '网站地址不能为空',
      trigger: 'blur',
    },
  ],
});

const submit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      saveOrUpdate(dataEntity.value)
        .then((res) => {
          ElMessage.success(addTable.value + '成功');
          addVisible.value = false;
          getList();
        })
        .catch();
    }
  });
};

interface linkData {
  id: number | null;
  fileUrl: string;
  linkName: string;
  linkUrl: string;
  motto: string;
  remark: string;
}

const dataEntity = ref<linkData>({
  id: null,
  fileUrl: '',
  linkName: '',
  linkUrl: '',
  motto: '',
  remark: '',
});

interface pagination {
  pageSize: number; //每页多少条
  total: number; //共多少条
  pageNum: number; //当前页
}

interface queryParam {
  linkName: string;
  linkUrl: string;
}
const deletedLink = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.error('请选择要删除的数据');
    return;
  }
  ElMessageBox.confirm('确定要删除嘛?', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleted({ id: multipleSelection.value }).then((res) => {
      getList();
    });
  });
};
const queryParam = ref<queryParam>({
  linkName: '',
  linkUrl: '',
});
const tableData = ref([]);
const pagination = ref<pagination>({
  pageSize: 20, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});

onMounted(() => {
  getList();
});

const getList = () => {
  let param: any = {};
  param.search = queryParam.value;
  param.pageSize = pagination.value.pageSize;
  param.pageNum = pagination.value.pageNum;
  getPageList(param).then((data: any) => {
    tableData.value = data.list;
    pagination.value.pageNum = data.pageNum;
    pagination.value.total = data.total;
  });
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

<style scoped>
.top-center-bottom {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.top-center-bottom .top {
  height: 60px;
}

.top-center-bottom .center {
  flex: 1;
}
</style>
