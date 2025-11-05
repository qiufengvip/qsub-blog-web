<!-- 分类管理 -->
<template>
  <div class="authority-main">
    <div class="authority-left">
      <div class="qsub-left-head">
        <div class="head-title">
          <span>分类列表</span>
        </div>
        <el-divider>
          <el-icon>
            <SvgIcon name="heart"></SvgIcon>
          </el-icon>
        </el-divider>
      </div>
      <el-tree ref="ruleTree" :current-node-key="currentNode" :data="treeData" :highlight-current="true" :props="treeProps" node-key="id" @node-click="nodeClick"></el-tree>
    </div>
    <el-divider direction="vertical" style="height: 100%" />
    <div class="authority-right">
      <div class="top-center-bottom">
        <div class="query-param-main">
          <div class="query-param-term">
            <div class="query-param"></div>
          </div>
          <div class="query-param-function">
            <div class="query-param">
              <el-button type="primary" size="small" @click="getList">查询</el-button>
              <el-button :disabled="!currentNode" type="success" size="small" @click="add">新建</el-button>
              <el-button :disabled="multipleSelection.length !== 1" type="warning" size="small" @click="edit">编辑</el-button>
              <el-button :disabled="multipleSelection.length === 0" type="danger" size="small" @click="deleted">删除</el-button>
            </div>
          </div>
        </div>
        <div class="center">
          <el-table v-loading="loading" border :data="tableData" style="height: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column fixed type="index" width="60" label="序号" />
            <el-table-column prop="typeName" label="分类名称" />
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
    </div>
    <EditType :id="id" :show="editTypeShow" :resourceId="currentNode" @canceled="editTypeShow = false" @saved="saved"></EditType>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { getTypeResources } from '@/http/interface/api';
import { ElMessage, ElMessageBox, FormRules } from 'element-plus';
import { deletedType } from '@/http/interface/blog/type';
import EditType from '@/components/admin/blog/type/editType/index.vue';

const multipleSelection = ref<any[]>([]);
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const treeProps = ref({
  children: 'children', //子集 这里不用
  label: 'serverName',
});
const loading = ref(false);
const id = ref('');
const editTypeShow = ref(false);
const saved = () => {
  editTypeShow.value = false;
  getList();
};
/**
 * 删除分类
 */
const deleted = () => {
  ElMessageBox.confirm('确定要删除嘛?', 'Warning', {
    confirmButtonText: '对',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deletedType(
      multipleSelection.value.map((item) => {
        return item.id;
      })
    ).then((res) => {
      ElMessage.success('删除成功' + res);
      getList();
    });
  });
};
/**
 * 添加
 */
const add = () => {
  id.value = '';
  editTypeShow.value = true;
};
/**
 * 修改
 */
const edit = () => {
  id.value = multipleSelection.value[0].id;
  editTypeShow.value = true;
};

/**
 * 添加分类
 */
const addSubmit = () => {};
const nodeClick = (node: any) => {
  currentNode.value = node.id;
  getList();
};
const currentNode = ref<number>(0);
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请填写分类名称',
      trigger: 'change',
    },
  ],
});
/**
 * 获取右侧列表数据
 */
const getList = () => {
  getPageList({ search: { resourceId: currentNode.value }, ...pagination.value }).then((res: any) => {
    if (res?.list) {
      tableData.value = res.list;
    }
    console.log(res);
  });
  loading.value = false;
};
interface pagination {
  pageSize: number; //每页多少条
  total: number; //共多少条
  pageNum: number; //当前页
}

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
const tableData = ref([]);
const pagination = ref<pagination>({
  pageSize: 20, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});

const treeData = ref<any>([]);
const init = () => {
  loading.value = true;
  getTypeResources().then((res: any) => {
    treeData.value = res;
    // 打开默认分类
    if (res?.length > 0) {
      currentNode.value = res[0].id;
      getList();
    } else {
      ElMessage.error('未找到分类');
      loading.value = false;
    }
  });
};

onMounted(() => {
  init();
});
</script>
<style lang="scss" scoped>
.authority-main {
  height: 100%;
  display: flex;

  .authority-left {
    width: 200px;
  }

  .authority-right {
    flex-grow: 1;
    height: 100%;
  }

  :deep(.el-card__header) {
    padding: 5px 10px;
  }

  :deep(.el-card__body) {
    padding: 0;
  }
}

.qsub-resource-tabs {
  height: calc(100% - 20px);
  margin-top: 10px;
}

:deep(.el-tabs__content) {
  height: calc(100% - 60px);
}

:deep(.el-tab-pane) {
  height: 100%;
  overflow: scroll;
}

.left-head {
  color: var(--text-color);
  overflow: scroll;
}

.head-title {
  margin-top: 20px;
  display: flex;
  width: 100%;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
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
