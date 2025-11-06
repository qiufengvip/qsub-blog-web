<!--标签管理-->
<template>
  <div class="top-center-bottom">
    <div class="query-param-main">
      <div class="query-param-term">
        <div class="query-param">
          <el-input v-model="queryParam.name" style="width: 200px" size="small" placeholder="请输入关键词">
            <template #prepend>搜索</template>
          </el-input>
        </div>
      </div>
      <div class="query-param-function">
        <div class="query-param">
          <el-button type="primary" size="small" @click="getList">GO</el-button>
        </div>
      </div>
    </div>
    <div class="center">
      <el-form label-width="auto" style="max-width: 600px">
        <el-form-item label="公司名称">
          <el-select v-model="auto" placeholder="选择或者键入新的公司名称">
            <el-option label="中国人寿" value="中国人寿" />
            <el-option label="太平洋人寿" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="产品标签">
          <el-select v-model="tag" multiple placeholder="Select" style="width: 240px">
            <el-option label="个险" value="1"></el-option>
            <el-option label="终身寿险" value="2"></el-option>
          </el-select>
          <el-button type="primary"> +添加标签</el-button>
        </el-form-item>

        <el-form-item label="附件列表">
          <el-button type="primary"> +添加附件</el-button>
          <el-table border :data="tableData[0].file" style="height: 100%">
            <el-table-column fixed type="index" width="60" label="序号" />
            <el-table-column prop="fileName" label="附件名称" />
            <el-table-column fixed="right" label="操作" width="90">
              <template #default="scope">
                <el-button type="danger" size="small" @click="deleted(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>

      <el-table border :data="tableData" style="height: 100%">
        <el-table-column fixed type="index" width="60" label="序号" />
        <el-table-column prop="companyName" label="公司名称" width="200" />
        <el-table-column prop="productName" label="产品名称">
          <template #default="{ row }">
            <span v-html="row.productName"></span>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品标签" width="300">
          <template #default="{ row }">
            <el-tag v-for="item in row.tag" style="margin-left: 10px" effect="plain">
              <span v-html="item"></span>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="附件列表" width="300">
          <template #default="scope">
            <el-button type="" size="small" @click="deleted(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div ref="bottomMain" class="bottom">
      <div ref="bottomMain" class="qsub-pagination">
        <el-pagination
          background
          :page-sizes="[20, 60, 100, 300]"
          layout="prev, pager, next"
          small
          :total="pagination.total"
          :page-size="pagination.pageSize"
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
import { requestConfigDeletedLabel, requestConfigGetLabelList } from '@/http/interface/api';
import useElementPlusInjections from '@/views/client/useElementPlusInjections';

useElementPlusInjections();
interface pagination {
  pageSize: number; //每页多少条
  total: number; //共多少条
  pageNum: number; //当前页
}
const tag = ref();
const auto = ref();
interface queryParam {
  name: string;
}

const queryParam = ref<queryParam>({
  name: '',
});
const tableData = ref([
  {
    id: '',
    companyName: '中国人寿',
    productName: '国寿鑫鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '终身寿险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '100_国寿鑫鸿宝<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkydgvbu',
      },
      {
        fileName: '110_国寿鑫鸿宝<red>两全保险</red>(分红型)基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyktrjhjnksdgvbu',
      },
      {
        fileName: '121_国寿鑫鸿宝<red>两全保险</red>(分红型)现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyktrjhdgdsgaefpoergyjnksdgvbu',
      },
      {
        fileName: '300_国寿鑫鸿宝<red>两全保险</red>(分红型)产品说明书.pdf',
        fileKey: 'efbjkfejkbsdvsjkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },

  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
  {
    id: '',
    companyName: '太平洋人寿',
    productName: '太平洋鸿宝<red>两全保险</red>（分红型）',
    tag: ['个险', '<red>两全保险</red>'],
    file: [
      {
        fileName: '太平洋<red>两全保险</red>(分红型)条款.pdf',
        fileKey: 'asdasfajkdvbvsdbkjsdvsDFuigwefpoergyjnksdgvbu',
      },
      {
        fileName: '太平洋基本保险金额表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjypoergyjnksdgvbu',
      },
      {
        fileName: '太平洋现金价值表.pdf',
        fileKey: 'asdasfasfggdgfhghghtjykuytktrkyknksdgvbu',
      },
      {
        fileName: '太平洋产品说明书.pdf',
        fileKey: 'asdasfasfggdgfhghghtjyknksdgvbu',
      },
    ],
  },
]);
const pagination = ref<pagination>({
  pageSize: 20, //每页多少条
  total: 0, //共多少条
  pageNum: 1, //当前页
});

onMounted(() => {
  getList();
});

const getList = () => {
  queryParam.value.pageSize = pagination.value.pageSize;
  queryParam.value.pageNum = pagination.value.pageNum;
  requestConfigGetLabelList(queryParam.value).then((data: any) => {
    tableData.value = data.list;
    pagination.value.pageNum = data.pageNum;
    pagination.value.total = data.total;
  });
};
const deleted = (row: any) => {
  ElMessageBox.confirm('确定要删除嘛?', 'Warning', {
    confirmButtonText: '对',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      requestConfigDeletedLabel({ id: row.id }).then((res: any) => {
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
<style>
red {
  background: #b80734 !important;
  color: #ffffff;
}
</style>
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
