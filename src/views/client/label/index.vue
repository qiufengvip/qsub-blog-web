<!-- 分类专栏管理 -->
<template>
  <view-frame v-loading="loading">
    <div class="top">
      <div class="top-img" :style="{ background: img }">
        <div class="top-body">
          <div class="top-title">{{ title }}</div>
          <div class="top-sub-title">
            <div>共计{{ labelNumber }}个标签</div>
            <div>{{ postNumber }}篇文章</div>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <!--        主体-->
      <div class="label-main">
        <template v-for="(item, key) in label" :key="key">
          <div class="label-item" :style="{ color: getType(item.id), fontSize: 12 + (item.postNumber > 40 ? 50 : item.postNumber) + 'px' }">
            <div :key="key" class="label-item-title" @click="openLabelTImeLine(item.id)">{{ item.name }}</div>
          </div>
        </template>
      </div>
    </div>
  </view-frame>
</template>
<script lang="ts" setup>
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { ref } from 'vue';
import { getLabelList } from '@/http/interface/client/label';
import { openLabelTImeLine } from '@/utils/openPage';
import { setWebTitle } from '@/utils/dataDispose';
import useElementPlusInjections from '@/views/client/useElementPlusInjections';

useElementPlusInjections();
const img = ref('url(http://file.qsub.cn/blog/2024/8/e7a984a09f0b4cb68af458357bbdfbe0.jpg) center center / 100% no-repeat');
const title = ref('标签云');
setWebTitle(title.value);
const label = ref<any>([]);
const loading = ref(false);
const postNumber = ref(0);
const labelNumber = ref(0);
const getType = (id: any) => {
  // 将整数映射到 1, 2, 3, 4
  let number = (id % 5) + 1;
  switch (number) {
    case 1:
      return 'rgba(64,158,255,1)';
    case 2:
      return 'rgba(103,194,58,1)';
    case 3:
      return 'rgba(230,162,60,1)';
    case 4:
      return 'rgba(245,108,108,1)';
    default:
      return 'rgba(144,147,153,1)';
  }
};
const fetchLabels = async () => {
  loading.value = true;
  try {
    const res: any = await getLabelList();
    postNumber.value = res.postNumber;
    labelNumber.value = res.labelNumber;
    label.value = res.labelList;
  } catch (error) {
    console.error('获取标签列表失败:', error);
  } finally {
    loading.value = false;
  }
};

await fetchLabels();
</script>

<style lang="scss" scoped>
:deep(.el-main) {
  padding: 0;
}
.top {
  width: 100%;
  .top-img {
    width: 100%;
    height: 15rem;
    letter-spacing: 10px;
    .top-body {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: #00000050;
      width: 100%;
      height: 100%;
    }
  }
  .top-title {
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    color: #ffffff;
    padding: 15px;
  }
  .top-sub-title {
    display: flex;
    font-size: 15px;
    font-weight: bold;
    color: #ffffff;
  }
}

.body {
  .label-main {
    width: 1340px;
    margin: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .label-item {
      background: var(--bg-brand-color) -menu;
      padding: 4px 5px;
      margin-top: 10px;
      border-radius: 10px;
      margin-right: 15px;
      display: flex;
      align-items: center;
      color: var(--bg-background-color);
      font-size: 15px;
      font-weight: bold;
      border: 1px solid #878787;
      .label-item-title {
        cursor: pointer;
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .body {
    .label-main {
      margin: 0;
      padding: 10px 5px 10px 10px;
      width: calc(100% - 15px);
      .label-item {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
}
</style>
