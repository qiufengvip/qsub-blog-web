<!--标签管理-->
<template>
  <div class="top-center-bottom">
    <div class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.name" style="width: 200px" size="small" placeholder="名称">
            <template #prepend>名称</template>
          </el-input>
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button type="primary" size="small" @click="getList(true)">查询</el-button>
          <el-button type="danger" size="small" @click="deleted">删除</el-button>
        </div>
      </div>
    </div>
    <div class="center">
      <el-table border :data="tableData" style="height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column fixed type="index" width="60" label="序号" align="center" />
        <el-table-column prop="postNumber" label="关联文章" width="100" align="center" />
        <el-table-column prop="name" label="标签名称" />
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
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { onActivated, onMounted, ref } from 'vue';
import { getLabelList, deleted as deletedByIds } from '@/http/interface/admin/postList';
const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val.map((item: any) => item.id);
};
interface pagination {
  pageSize: number; //每页多少条
  total: number; //共多少条
  pageNum: number; //当前页
}

interface queryParam {
  name: string;
}

const queryParam = ref<queryParam>({
  name: '',
});
onActivated(() => {
  getList();
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

const getList = (init: boolean = false) => {
  if (init) {
    pagination.value.pageNum = 1;
  }
  let param: any = {};
  param.search = queryParam.value;
  param.pageSize = pagination.value.pageSize;
  param.pageNum = pagination.value.pageNum;
  getLabelList(param).then((data: any) => {
    tableData.value = data.list;
    pagination.value.pageNum = data.pageNum;
    pagination.value.total = data.total;
  });
};
const deleted = (row: any) => {
  ElMessageBox.confirm('确定要删除所选中的标签吗，与文章的关联关系也会被删除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deletedByIds({ id: multipleSelection.value }).then((res: any) => {
        ElMessage.success('删除成功');
        getList();
      });
    })
    .catch(() => {});
};
// 每页条数被改变
const handleSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize; //每页多少条被改变
  handleCurrentChange(1);
  getList();
}; //换页
const handleCurrentChange = (currentPage: number) => {
  pagination.value.pageNum = currentPage;
  multipleSelection.value = [];
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
