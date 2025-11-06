<!-- 分类专栏管理 -->
<template>
  <view-frame>
    <div class="top">
      <div class="top-img" :style="{ background: img }">
        <div>{{ title }}</div>
      </div>
    </div>
    <div v-loading="loading" class="body">
      <div class="top-label">
        <div class="top-label-item">
          <div><svg-icon name="catalog-label" /></div>
          <span>相关标签</span>
        </div>
        <a v-for="(item, key) in label" :key="key" :href="getUri(item.id)" class="top-label-item top-label-item-hover" @click.prevent @click="openLabelTImeLine(item.id)">
          {{ item.name }}
        </a>
      </div>
      <div class="main">
        <div class="left">
          <post-list :param="paramData"></post-list>
        </div>
        <div class="right">
          <HotPost></HotPost>
          <HotComments></HotComments>
        </div>
      </div>
    </div>
  </view-frame>
</template>
<script lang="ts" setup>
import PostList from '@/components/blog/PostList.vue';
import HotPost from '@/components/blog/HotPost.vue';
import HotComments from '@/components/blog/HotComments.vue';
import { ref } from 'vue';
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { useRoute } from 'vue-router';
import { detail } from '@/http/interface/client/catalog';
import { openLabelTImeLine } from '@/utils/openPage';
import { setWebTitle } from '@/utils/dataDispose';
import useElementPlusInjections from '@/views/client/useElementPlusInjections';
import { readSSRState, writeSSRState, snapshotState } from '@/ssr/state';

useElementPlusInjections();
const route = useRoute();
// 分类专栏id
const catalogId = route.params.id as string;

const getUri = (id: number) => {
  return `/tagTimeline/${id}`;
};
const loading = ref(false);
// 参数
const paramData = ref({
  catalogId: catalogId,
});
const img = ref('url(http://file.qsub.cn/blog/2024/8/0f3b998114f04097bc3446ea9cb2c282.jpg) center center / 100% no-repeat');
const title = ref('');
const label = ref<any[]>([]);

/**
 * 分类专栏初始化
 */
const STATE_KEY = `client-catalog-${catalogId}`;

type CatalogHydrationState = {
  title?: string;
  labelList?: any[];
};

const hydrated = readSSRState<CatalogHydrationState>(STATE_KEY);

if (hydrated) {
  title.value = hydrated.title || '';
  if (title.value) {
    setWebTitle(title.value);
  }
  label.value = Array.isArray(hydrated.labelList) ? [...hydrated.labelList] : [];
} else {
  try {
    const response: any = await detail(paramData.value);
    title.value = response.catalogName;
    if (title.value) {
      setWebTitle(title.value);
    }
    label.value = response.labelList;
  } catch (error) {
    console.error('获取专栏详情失败:', error);
  } finally {
    writeSSRState(STATE_KEY, {
      title: title.value,
      labelList: snapshotState(label.value),
    });
  }
}
</script>

<style lang="scss" scoped>
.top {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;

  .top-img {
    width: 100%;
    height: 15rem;
    line-height: 15vh;
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.body {
  width: 1340px;

  .top-label {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    margin-top: 10px;
    margin-right: 20px;
    width: calc(100% - 40px);
    padding: 10px 10px;
    top: -10px;
    border-radius: 5px;
    background: var(--bg-brand-color);
    a {
      color: var(--text-color);
    }
    svg {
      width: 13px;
      height: 13px;
    }
    .top-label-item {
      display: flex;
      align-items: center;
      padding: 5px;
      font-size: 13px;
      border-radius: 5px;
      margin: 2px;
    }

    .top-label-item:first-child {
      border: var(--border-box-color) solid 1px;
      background: var(--content-color);
    }
    .top-label-item-hover {
      cursor: pointer;
    }
    .top-label-item-hover:hover {
      background: var(--content-color);
    }
  }

  .main {
    display: flex;

    .left {
      width: 900px;
      padding-top: 10px;
    }

    .right {
      width: 400px;
      padding: 10px 20px;
    }
  }
}
@media screen and (max-width: 1400px) {
  .body {
    padding: 10px;
    width: calc(100% - 20px);

    .top-label {
      width: calc(100% - 20px);
    }
    .main {
      flex-direction: column;
      width: 100%;

      .left {
        width: 100%;
      }

      .right {
        width: 100%;
        padding: 0;
      }
    }
  }
}
</style>
