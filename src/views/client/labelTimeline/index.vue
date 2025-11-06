<!-- 分类专栏管理 -->
<template>
  <view-frame>
    <div class="top">
      <div class="top-img" :style="{ background: img }">
        <div class="top-title">标签详情</div>
        <div class="top-sub-title">
          <div v-if="labelData?.name">共计{{ labelData.postNumber }}篇文章</div>
        </div>
      </div>
    </div>
    <div v-loading="showLoading" class="body">
      <div v-if="labelData?.name" class="timeline-main">
        <div class="tag-name">
          <div class="tag-name-label">{{ labelData.name }}</div>
          <el-divider> </el-divider>
        </div>
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in postList" :key="index" size="large" :icon="Postcard" :hollow="true" :timestamp="activity.date">
            <div class="post" @click="openPost(activity.id)">
              <div class="post-title">{{ activity.title }}</div>
              <el-text v-if="activity.subtitle" class="post-content" line-clamp="3">
                {{ activity.subtitle }}
              </el-text>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div v-else class="error">
        <span class="error-title">标签回归喵星啦</span>
        <a href="/" class="error-uri">返回首页</a>
      </div>
      <div v-if="labelData?.name">
        <div v-loading="loading" class="load-more" @click="getDataList">加载更多...</div>
      </div>
    </div>
  </view-frame>
</template>
<script lang="ts" setup>
import { Postcard } from '@element-plus/icons-vue';
import { ref } from 'vue';
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { getLabelPostList } from '@/http/interface/client/post';
import { useRoute } from 'vue-router';
import { openPost } from '@/utils/openPage';
import { detail } from '@/http/interface/client/label';
import { setWebTitle } from '@/utils/dataDispose';

const img = ref('url(http://file.qsub.cn/blog/2024/8/d563c1f1e3e84dc5a4cd73ba838af26e.jpg) center center / 100% no-repeat');
const loading = ref(false);
const postList = ref<any[]>([]);
const route = useRoute();
// 标签id
const labelId = route.params.id as string;
const showLoading = ref(true);

// 分页配置
let PageInfo = {
  search: { labelId: labelId },
  pageNum: 0,
  pageSize: 10,
};
const getDataList = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  PageInfo.pageNum += 1;
  try {
    const res: any = await getLabelPostList(PageInfo);
    showLoading.value = false;
    const data: any[] = res.list || [];
    if (data.length > 0) {
      postList.value.push(...data);
    } else {
      PageInfo.pageNum -= 1;
    }
  } catch (error) {
    console.error('获取标签文章列表失败:', error);
    PageInfo.pageNum -= 1;
    showLoading.value = false;
  } finally {
    loading.value = false;
  }
};
const labelData = ref<any>({});
const fetchLabelDetail = async () => {
  try {
    const res = await detail({
      id: labelId,
    });
    labelData.value = res;
    if (res?.name) {
      setWebTitle(res.name);
    }
  } catch (error) {
    console.error('获取标签详情失败:', error);
    labelData.value = undefined;
    showLoading.value = false;
  }
};

if (labelId) {
  await fetchLabelDetail();
  if (labelData.value?.name) {
    await getDataList();
  }
} else {
  showLoading.value = false;
}
</script>

<style lang="scss" scoped>
:deep(.el-main) {
  padding: 0;
}
.top {
  width: 100%;
}
.top-img {
  width: 100%;
  height: 15rem;
  letter-spacing: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  color: #c8c8c8;
}
.body {
  margin: 10px;
  border-radius: 10px;
  background: var(--bg-brand-color);
  display: flex;
  justify-content: flex-start;
  min-height: 500px;
  flex-direction: column;
  align-items: center;
  width: 1300px;

  .error {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;

    .error-title {
      color: var(--text-color);
      margin-right: 10px;
    }
    .error-uri {
      color: #007fff;
    }
  }
  .load-more {
    background: var(--content-color);
    border-radius: 5px;
    padding: 10px 20px;
    color: var(--text-color);
    cursor: pointer;
    -webkit-user-select: none;
  }
  .load-more:hover {
    background: var(--border-box-color);
  }
  .load-more:active {
    background: var(--content-color);
  }

  .timeline-main {
    margin: 50px;
    width: calc(100% - 100px);
    :deep(.el-timeline-item__node.is-hollow) {
      border-width: 12px;
    }
    :deep(.el-timeline-item__node--large) {
      left: -6px;
    }
    .tag-name {
      .tag-name-label {
        width: 100%;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
      }
    }
    .post {
      cursor: pointer;
      padding: 8px;
      border-radius: 5px;
      width: 100%;
      .post-title {
        font-weight: bold;
        padding-bottom: 10px;
      }
      .post-content {
        line-height: 150%;
      }
    }
    .post:hover {
      background: var(--content-color);
    }
  }
}
:deep(.el-timeline-item .el-timeline-item__icon) {
  color: var(--text-color);
}

@media screen and (max-width: 1300px) {
  .body {
    width: 100%;
  }
}
</style>
