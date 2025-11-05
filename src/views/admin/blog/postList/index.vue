<template>
  <div ref="main" class="top-center-bottom">
    <div ref="queryParamMain" class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.title" placeholder="文章标题" size="small" style="width: 300px">
            <template #prepend>文章标题</template>
          </el-input>
        </div>
        <div class="query-param">
          <el-select v-model="queryParam.state" placeholder="发布状态" size="small" clearable style="width: 150px">
            <el-option v-for="item in postStateList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="query-param">
          <el-select v-model="queryParam.releases" placeholder="审核状态" size="small" clearable style="width: 150px">
            <el-option v-for="item in postReleaseList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
          <el-button size="small" type="primary" @click="addPost()">新建文章</el-button>
        </div>
      </div>
      <div class="query-popconfirm">
        <el-popover placement="bottom" :width="300" trigger="click">
          <template #reference>
            <el-button size="small" :icon="Filter">筛选</el-button>
          </template>
          <div class="query-popconfirm-query">
            <el-form>
              <el-form-item label="文章标题">
                <el-input v-model="queryParam.title" placeholder="文章标题" size="small" style="width: 300px"> </el-input>
              </el-form-item>
              <el-form-item label="发布状态">
                <el-select v-model="queryParam.state" placeholder="发布状态" size="small" clearable style="width: 150px">
                  <el-option v-for="item in postStateList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="审核状态">
                <el-select v-model="queryParam.releases" placeholder="审核状态" size="small" clearable style="width: 150px">
                  <el-option v-for="item in postReleaseList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="更新时间">
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
              </el-form-item>
            </el-form>
            <div class="query-popconfirm-foot">
              <el-button size="small" type="success" @click="getList()">查询</el-button>
            </div>
          </div>
        </el-popover>

        <el-button size="small" type="primary" @click="addPost()">新建文章</el-button>
      </div>
    </div>
    <div ref="centerMain" class="center">
      <div class="mobile-table">
        <el-card v-for="(rowData, index) in tableData" :key="index" style="margin: 5px">
          <template #header>
            <div class="card-header">
              <el-text size="large" line-clamp="1">{{ rowData.title }}</el-text>
              <div class="card-header-tag">
                <template v-for="(item, key) in postStateList">
                  <el-tag v-if="item.value === rowData.state" :key="key" :type="item.value === 'RELEASE' ? 'success' : 'warning'">
                    {{ item.label }}
                  </el-tag>
                </template>
                <template v-for="(item, key) in postReleaseList">
                  <el-tag v-if="item.value === rowData.releases" :key="key" :type="item.value === 'AUDIT_PASS' ? 'success' : 'warning'">
                    {{ item.label }}
                  </el-tag>
                </template>
              </div>
            </div>
          </template>
          <el-image :src="rowData.postImg" fit="cover" style="width: 100%; height: 200px" viewer="scope.row.title">
            <template #error>
              <div class="img-error">暂无缩略图</div>
            </template>
          </el-image>
          <el-text style="margin-top: 10px; line-height: 150%" line-clamp="3">{{ rowData.subtitle }} </el-text>
          <template #footer>
            <el-button size="small" type="primary" @click="edits(rowData)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleted(rowData.id)">删除</el-button>
          </template>
        </el-card>
      </div>

      <el-table ref="userTable" v-loading="loading" class="pc-table" :data="tableData" border style="height: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed label="序号" type="index" width="60" />
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
        <el-table-column label="发布" prop="state" width="80">
          <template #default="scope">
            <template v-for="(item, key) in postStateList">
              <div v-if="item.value === scope.row.state" :key="key" class="tree-resourceType">
                {{ item.label }}
              </div>
            </template>
          </template>
        </el-table-column>

        <el-table-column label="审核" prop="state" width="80">
          <template #default="scope">
            <template v-for="(item, key) in postReleaseList">
              <div v-if="item.value === scope.row.releases" :key="key" class="tree-resourceType">
                {{ item.label }}
              </div>
            </template>
          </template>
        </el-table-column>
        <el-table-column fixed prop="createTime" label="创建时间" width="180"> </el-table-column>
        <el-table-column label="简述" prop="subtitle">
          <template #default="scope">
            <el-text line-clamp="4">{{ scope.row.subtitle }}</el-text>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="160">
          <template #default="scope">
            <el-button size="small" type="primary" @click="edits(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleted(scope.row.id)">删除</el-button>
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
</template>

<script lang="ts" setup>
import { onActivated, onMounted, ref } from 'vue';
import { selectConstantData } from '@/http/interface/api';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { deleted as deleteById, getPostList, saveOrUpdate } from '@/http/interface/blog/psot';
import { Filter } from '@element-plus/icons';

const postReleaseList = ref<any>([]); // 发布草稿 状态
const postStateList = ref<any>([]); //审核状态 列表
const queryParam = ref<any>({
  title: null,
  state: null,
  releases: null,
  startTime: [],
});
const stateList = ref([]);
const tableData = ref<any[]>([]);
const pagination = ref({
  pageSize: 5, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});
const startTime = ref([]);
const multipleSelection = ref([]);

const handleClick = (click: any) => {
  console.log(click);
};
let router = useRouter();
/**
 * @desc 新建文章
 */
const addPost = () => {
  saveOrUpdate({}).then((data: any) => {
    router.push({
      path: `/admin/postAdd/${data.id}`,
      query: { tagName: '新建文章' },
    });
  });
};
const loading = ref(false);
const getList = () => {
  loading.value = true;
  getPostList({
    ...pagination.value,
    search: queryParam.value,
  })
    .then((data: any) => {
      loading.value = false;
      tableData.value = data.list;
      pagination.value.pageNum = data.pageNum;
      pagination.value.total = data.total;
    })
    .catch((e) => {
      loading.value = false;
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
  router.push({
    path: `/admin/postAdd/${item.id}`,
    query: { tagName: '编辑文章' },
  });
};

//删除
const deleted = (id: number) => {
  ElMessageBox.confirm('确定要删除所选文章吗?删除后无法恢复。')
    .then(() => {
      deleteById([id]).then((data) => {
        ElMessage.success('删除成功');
        getList();
      });
    })
    .catch(() => {
      // catch error
    });
};
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const init = async () => {
  // 文章发布状态
  postReleaseList.value = await selectConstantData({ code: 'postRelease' });
  // 文章审核状态
  postStateList.value = await selectConstantData({ code: 'postState' });
  stateList.value = await selectConstantData({ code: 'userState' });
};
onActivated(() => {
  getList();
});

onMounted(() => {
  init();
});
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
