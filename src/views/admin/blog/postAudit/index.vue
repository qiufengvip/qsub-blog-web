<template>
  <div ref="main" class="top-center-bottom">
    <div ref="queryParamMain" class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.nickname" placeholder="用户昵称" size="small" style="width: 300px">
            <template #prepend>用户</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-input v-model="queryParam.content" placeholder="标题、子标题、正文" size="small" style="width: 300px">
            <template #prepend>内容</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-date-picker
            v-model="queryParam.startTime"
            end-placeholder="选择时间"
            format="YYYY-MM-DD"
            placeholder="更新时间"
            range-separator="到"
            size="small"
            start-placeholder="更新时间"
            type="daterange"
            unlink-panels
            value-format="YYYY-MM-DD"
          />
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button size="small" type="success" @click="getList()">查询</el-button>
        </div>
        <!--                <div class="query-param">-->
        <!--                    <el-button type="primary" size="small">修改密码</el-button>-->
        <!--                </div>-->
        <!--                <div class="query-param">-->
        <!--                    <el-button type="warning" size="small">封禁账户</el-button>-->
        <!--                </div>-->
        <!--                <div class="query-param">-->
        <!--                    <el-button type="danger" size="small">删除用户</el-button>-->
        <!--                </div>-->
      </div>
    </div>
    <div ref="centerMain" class="center">
      <el-table ref="userTable" :data="tableData" border style="height: 100%">
        <el-table-column fixed label="序号" type="index" width="60" align="center" />
        <el-table-column fixed label="用户名" prop="nickname" width="120" />
        <el-table-column fixed label="缩略图" width="175">
          <template #default="scope">
            <el-image :src="scope.row.postImg" fit="cover" style="width: 150px; height: 100px" viewer="scope.row.title">
              <template #error>
                <div class="img-error">暂无缩略图</div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column fixed label="文章标题" prop="title" width="300" />
        <el-table-column fixed prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="概括" prop="subtitle">
          <template #default="scope">
            <el-text line-clamp="4">{{ scope.row.subtitle }}</el-text>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="160" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="edits(scope.row)">审核</el-button>
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
          layout="prev, pager, next"
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
  <post-audit v-if="postAuditShow" :post-id="postId" @exit="postAuditExit"></post-audit>
</template>

<script lang="ts" setup>
import { onActivated, onMounted, ref } from 'vue';
import { selectConstantData } from '@/http/interface/api';
import { getAuditList } from '@/http/interface/admin/postAudit';
import postAudit from '@/components/admin/blog/postAudit/index.vue';

const postAuditShow = ref(false);
const postAuditExit = (isAudit: boolean) => {
  postAuditShow.value = false;
  if (isAudit) {
    getList();
  }
};
const postId = ref(0);
const queryParam = ref({
  nickname: null,
  content: null,
  startTime: [],
});
const stateList = ref([]);
const tableData = ref<any[]>([]);
const pagination = ref({
  pageSize: 5, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});

const getList = () => {
  getAuditList({
    ...pagination.value,
    search: queryParam.value,
  }).then((data: any) => {
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
};
//换页
const handleCurrentChange = (currentPage: any) => {
  pagination.value.pageNum = currentPage;
  getList();
};

const edits = (item: any) => {
  postId.value = item.id;
  postAuditShow.value = true;
};
const init = async () => {
  stateList.value = await selectConstantData({ code: 'userState' });
  getList();
};
onActivated(() => {
  getList();
});

onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
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

.img-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--content-color);
}
</style>
