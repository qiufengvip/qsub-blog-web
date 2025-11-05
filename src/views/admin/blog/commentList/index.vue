<!--标签管理-->
<template>
  <div class="top-center-bottom">
    <div class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.nickname" style="width: 200px" size="small" placeholder="名称">
            <template #prepend>用户昵称</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.content" style="width: 200px" size="small" placeholder="名称">
            <template #prepend>评论内容</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-date-picker
            v-model="queryParam.startTime"
            end-placeholder="选择时间"
            format="YYYY-MM-DD"
            placeholder="发布时间"
            range-separator="到"
            size="small"
            start-placeholder="发布时间"
            type="daterange"
            unlink-panels
            value-format="YYYY-MM-DD"
          />
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button type="primary" size="small" @click="getList(true)">查询</el-button>
          <el-button type="danger" size="small" @click="deleted">删除</el-button>
        </div>
      </div>

      <div class="query-popconfirm">
        <el-popover placement="bottom" :width="300" trigger="click">
          <template #reference>
            <el-button size="small" class="" :icon="Filter">筛选</el-button>
          </template>
          <div class="query-popconfirm-query">
            <el-form>
              <el-form-item label="用户昵称">
                <el-input v-model="queryParam.nickname" style="width: 200px" size="small" placeholder="名称"> </el-input>
              </el-form-item>
              <el-form-item label="评论内容">
                <el-input v-model="queryParam.content" style="width: 200px" size="small" placeholder="名称"> </el-input>
              </el-form-item>
              <el-form-item label="发布时间">
                <el-date-picker
                  v-model="queryParam.startTime"
                  end-placeholder="选择时间"
                  format="YYYY-MM-DD"
                  placeholder="发布时间"
                  range-separator="到"
                  size="small"
                  start-placeholder="发布时间"
                  type="daterange"
                  unlink-panels
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-form>
            <div class="query-popconfirm-foot">
              <el-button size="small" type="success" @click="getList(true)">查询</el-button>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="center">
      <div class="mobile-table">
        <el-card v-for="(rowData, index) in tableData" :key="index" style="margin: 5px">
          <template #header>
            <div class="card-header">
              <el-text size="large" line-clamp="1">{{ rowData.nickname }}</el-text>
              <div class="card-header-tag">
                <el-tag v-if="rowData.postId > 0" type="success">文章</el-tag>
                <el-tag v-else-if="rowData.postId == -1" type="warning">留言板</el-tag>
                <el-tag v-else-if="rowData.postId == -2" type="primary">朋友</el-tag>
                <el-tag v-else-if="rowData.postId == -3" type="info">关于</el-tag>
                <el-tag v-else type="danger">未知</el-tag>
              </div>
            </div>
          </template>
          <el-text style="margin-top: 10px; line-height: 150%" line-clamp="3">{{ rowData.content }} </el-text>
          <template #footer>
            <el-button size="small" type="danger" @click="deleted(rowData.id)">删除</el-button>
          </template>
        </el-card>
      </div>
      <el-table border class="pc-table" :data="tableData" style="height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column fixed type="index" width="60" label="序号" align="center" />
        <el-table-column prop="nickname" label="发布人" width="160" />
        <el-table-column label="发布位置" width="100" align="center">
          <template #default="scope">
            <span v-if="scope.row.postId > 0">文章</span>
            <span v-else-if="scope.row.postId == -1">留言板</span>
            <span v-else-if="scope.row.postId == -2">朋友</span>
            <span v-else-if="scope.row.postId == -3">关于</span>
            <span v-else>未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评论内容" />
        <el-table-column prop="ip" label="发布IP" width="100" />
        <el-table-column prop="ipPlace" label="位置信息" width="100" />
        <el-table-column prop="createTime" label="发布时间" width="180" />
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
import { onMounted, ref } from 'vue';
import { getCommentList, deleted as deletedById } from '@/http/interface/admin/commentList';
import { Filter } from '@element-plus/icons';
interface pagination {
  pageSize: number; //每页多少条
  total: number; //共多少条
  pageNum: number; //当前页
}

interface queryParam {
  content: string;
  startTime: [];
  nickname: string;
}

const queryParam = ref<queryParam>({
  content: '',
  nickname: '',
  startTime: [],
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
  getCommentList(param).then((data: any) => {
    tableData.value = data.list;
    pagination.value.pageNum = data.pageNum;
    pagination.value.total = data.total;
  });
};
const multipleSelection = ref([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val.map((item: any) => item.id);
};
const deleted = (id?: any) => {
  let idList: any[] = [];
  if (id) {
    idList.push(id);
  } else {
    idList = multipleSelection.value;
  }
  ElMessageBox.confirm('确定要删除嘛?', 'Warning', {
    confirmButtonText: '对',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deletedById({ id: idList }).then((res: any) => {
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
  getList();
};
</script>

<style lang="scss" scoped>
:deep(.el-card__header) {
  padding: 15px 10px;
}
:deep(.el-card__body) {
  padding: 10px;
}
:deep(.el-card__footer) {
  padding: 10px;
}
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

.query-popconfirm {
  padding: 5px 10px 0;
  display: none;
  justify-content: flex-end;
}
.el-form-item {
  margin-bottom: 0;
}
:deep(.el-card__footer) {
  display: flex;
  justify-content: flex-end;
}
.query-popconfirm-query {
}
.query-popconfirm-foot {
  display: flex;
  margin: 5px;
  justify-content: flex-end;
}
.mobile-table {
  display: none;
}
.pc-table {
  display: block;
}
.card-header {
  display: flex;
  justify-content: space-between;
  .card-header-tag {
    display: flex;
    justify-content: center;
    span {
      margin-left: 5px;
    }
  }
}
// 媒体查询
@media (max-width: 800px) {
  .query-popconfirm {
    display: flex;
  }
  .query-param-term {
    display: none;
  }
  .query-param-function {
    display: none;
  }
  .mobile-table {
    display: block;
  }
  .pc-table {
    display: none;
  }
  .qsub-pagination {
    justify-content: center;
  }
}
</style>
