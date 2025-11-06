<template>
  <view-frame>
    <!--顶部 -->
    <div class="top selected" :style="w / h > 1.66 ? 'background-size:' + (100 + scrollTop) + '% auto' : 'background-size:auto ' + (100 + scrollTop) + '%'">
      <div class="chicken-soup-for-the-soul" v-text="data.centerpiece"></div>
      <p class="down" @click="toMain"><svg-icon class="down-ico" name="down"></svg-icon></p>
    </div>

    <div ref="main" class="main">
      <div class="left">
        <div class="left-main">
          <div class="q-nav-main selected">
            <div v-for="(item, index) in navList" :key="index" :style="nav === item.id ? 'background: var(--content-color)' : ''" class="q-nav-item" @click="navClick(item.id)">{{ item.label }}</div>
          </div>
          <div v-if="postList.length" class="post-list">
            <a v-for="(item, key) in postList" :key="key" :href="getUri(item)" @click.prevent @click="openPost(item.id)">
              <div class="list-main">
                <div class="list-vessel">
                  <div v-if="item.postImg" class="list-left selected">
                    <div :style="'background: url(' + item.postImg + ') center center no-repeat;'" class="img"></div>
                  </div>
                  <div class="list-right">
                    <div class="list-top">
                      <div class="list-title">{{ item.title }}</div>
                      <div class="list-content">{{ item.subtitle }}</div>
                    </div>
                    <div class="list-belw selected">
                      <div class="list-belw-item">
                        <el-icon class="qsub-icon">
                          <Clock />
                        </el-icon>
                        {{ item.createTime }}
                      </div>
                      <div class="post-stats">
                        <div class="list-belw-item">
                          <svg-icon name="post-post_list_like" />
                          {{ item?.stats?.likeNumber }}
                        </div>
                        <div class="list-belw-item">
                          <svg-icon name="post-post_list_view" />
                          {{ item?.stats?.viewNumber }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="list-vessel-move">
                  <div v-if="item.postImg" class="list-left selected">
                    <div :style="'background: url(' + item.postImg + ') center center no-repeat;'" class="img"></div>
                  </div>
                  <div class="list-right">
                    <div class="list-top">
                      <div class="list-title">{{ item.title }}</div>
                      <div class="list-belw selected">
                        <div class="list-belw-item">
                          <el-icon class="qsub-icon">
                            <Clock />
                          </el-icon>
                          {{ item.createTime }}
                        </div>
                        <div class="post-stats">
                          <div class="list-belw-item">
                            <svg-icon name="post-post_list_like" />
                            {{ item?.stats?.likeNumber }}
                          </div>
                          <div class="list-belw-item">
                            <svg-icon name="post-post_list_view" />
                            {{ item?.stats?.viewNumber }}
                          </div>
                        </div>
                      </div>
                      <div v-if="item.subtitle" class="list-content">{{ item.subtitle }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
          <div v-else class="post-list empty">{{ loading }}</div>
          <div class="qsub-data-loading" :class="{ disabled: !hasMore, loading: loadingData }" @click="loadMore">
            {{ loading }}
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-main">
          <hot-post></hot-post>
          <hot-comments></hot-comments>
        </div>
      </div>
    </div>
  </view-frame>
</template>

<script lang="ts" setup>
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import HotPost from '@/components/blog/HotPost.vue';
import HotComments from '@/components/blog/HotComments.vue';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import { getConfigData, setWebTitle } from '@/utils/dataDispose';
import { getCatalogPostList, getHotPostList, getNewestPostList } from '@/http/interface/client/post';
import { Clock } from '@element-plus/icons';
import { BlogPostSketch } from '@/utils/interface/blogPostSketch';
import { openPost } from '@/utils/openPage';
import useElementPlusInjections from '@/views/client/useElementPlusInjections';
import { readSSRState, writeSSRState, snapshotState } from '@/ssr/state';

useElementPlusInjections();
const nav = ref('getNewestPostList');
setWebTitle('');
const navList = ref([
  {
    id: 'getNewestPostList',
    label: '最新',
  },
  {
    id: 'getHotPostList',
    label: '最热',
  },
  {
    id: '7',
    label: '前端',
  },
  {
    id: '6',
    label: '后端',
  },
  {
    id: '32',
    label: '随笔',
  },
  {
    id: '101',
    label: '生活',
  },
]);
/**
 * 分类被点击
 */
const postList = ref<BlogPostSketch[]>([]);
const loading = ref('查看更多 (｡・`ω´･)');
const loadingData = ref(false);
const hasMore = ref(true);

const requestMap: Record<string, Function> = {
  getNewestPostList,
  getHotPostList,
};

const pageInfo = ref({
  search: {} as Record<string, any>,
  pageNum: 0,
  pageSize: 10,
});

const getUri = (item: BlogPostSketch) => `/post/${item.id}`;

const resolveRequest = (id: string) => requestMap[id] || getCatalogPostList;

const resolveSearch = (id: string) => {
  if (id === 'getNewestPostList' || id === 'getHotPostList') {
    return {};
  }
  return {
    catalogId: Number(id),
  };
};

let activeNav = nav.value;

const resetPagination = (id: string) => {
  pageInfo.value = {
    search: resolveSearch(id),
    pageNum: 0,
    pageSize: 10,
  };
  postList.value = [];
  hasMore.value = true;
  loading.value = '查看更多 (｡・`ω´･)';
};

const fetchPostList = async (id: string) => {
  if (loadingData.value || !hasMore.value) {
    return;
  }
  loadingData.value = true;
  loading.value = '加载中...';
  const request = resolveRequest(id);
  try {
    const payload = {
      search: pageInfo.value.search,
      pageNum: pageInfo.value.pageNum + 1,
      pageSize: pageInfo.value.pageSize,
    };
    const response: any = await request(payload);
    if (activeNav !== id) {
      return;
    }
    if (response) {
      pageInfo.value.pageNum = response.pageNum ?? payload.pageNum;
      pageInfo.value.pageSize = response.pageSize ?? payload.pageSize;
      if (Array.isArray(response.list) && response.list.length > 0) {
        postList.value.push(...response.list);
        loading.value = '查看更多 (｡・`ω´･)';
      } else {
        hasMore.value = false;
        loading.value = '没有更多啦 (｡・`ω´･)';
      }
    } else {
      hasMore.value = false;
      loading.value = '没有更多啦 (｡・`ω´･)';
    }
  } catch (error) {
    console.error('加载文章列表失败:', error);
    loading.value = '加载失败，点击重试';
  } finally {
    loadingData.value = false;
    persistState();
  }
};

const showPostList = async (id: string) => {
  activeNav = id;
  resetPagination(id);
  await fetchPostList(id);
};

const loadMore = () => {
  if (loadingData.value) return;
  fetchPostList(activeNav);
};

const navClick = (id: string) => {
  if (nav.value === id) {
    if (!loadingData.value && hasMore.value) {
      fetchPostList(id);
    }
    return;
  }
  nav.value = id;
  showPostList(id);
};

const scrollTop = ref(0); //导航头
const data = ref({ centerpiece: getConfigData('centerpiece') }); //导航头
const isClient = typeof window !== 'undefined';
const w = ref(isClient ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth : 0); //导航头
const h = ref<any>(isClient ? window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight : 0);
const main = ref();

type MainViewHydrationState = {
  nav: string;
  postList: BlogPostSketch[];
  pageInfo: typeof pageInfo.value;
  hasMore: boolean;
  loading: string;
};

const STATE_KEY = 'client-main';

const applyHydratedState = (state: MainViewHydrationState) => {
  nav.value = state.nav || nav.value;
  activeNav = nav.value;
  pageInfo.value = {
    search: state.pageInfo?.search || resolveSearch(nav.value),
    pageNum: state.pageInfo?.pageNum ?? 0,
    pageSize: state.pageInfo?.pageSize ?? 10,
  };
  postList.value = Array.isArray(state.postList) ? [...state.postList] : [];
  hasMore.value = typeof state.hasMore === 'boolean' ? state.hasMore : true;
  loading.value = state.loading || loading.value;
};

const persistState = () => {
  writeSSRState(STATE_KEY, {
    nav: nav.value,
    postList: snapshotState(postList.value),
    pageInfo: snapshotState(pageInfo.value),
    hasMore: hasMore.value,
    loading: loading.value,
  });
};

const hydratedState = readSSRState<MainViewHydrationState>(STATE_KEY);

if (hydratedState) {
  applyHydratedState(hydratedState);
} else {
  await showPostList(nav.value);
  persistState();
}

onMounted(() => {
  if (!isClient) {
    return;
  }
  window.addEventListener('scroll', scrollHandle);
  window.addEventListener('resize', resizeHandle);
});

onBeforeUnmount(() => {
  if (!isClient) {
    return;
  }
  window.removeEventListener('scroll', scrollHandle);
  window.removeEventListener('resize', resizeHandle);
});

const scrollHandle = () => {
  if (!isClient) {
    return;
  }
  scrollTop.value = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) / 30;
};

const resizeHandle = () => {
  if (!isClient) {
    return;
  }
  w.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  h.value = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

const toMain = () => {
  main.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<style lang="scss" scoped>
body {
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100vw;
}

.el-header {
  padding: 0 !important;
}

.el-main {
  padding: 0 !important;
}

.top {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('http://file.qsub.cn/blog/2023/9/634cae15b00c4b029a754eeae88f933b.jpg') center center no-repeat;
  transition: background-size 0.8s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // 一言
  .chicken-soup-for-the-soul {
    font-weight: bold;
    font-size: 1.501rem;
    text-align: center;
    line-height: 180%;
    margin: 30px;
    color: var(--text-color);
    -webkit-text-stroke: 2px transparent;
    background: var(--bg-brand-color) top left / 100% 100%;
    -webkit-background-clip: text;
  }

  @keyframes icon_down {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8) translateY(40px);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .down {
    position: absolute;
    bottom: 30px;
    color: #eee;
    font-size: 20px;
    text-align: center;
    text-shadow: 0.1rem 0.1rem 0.2rem rgb(0 0 0 / 15%);
    line-height: 1.5;
    display: inline-block;
    animation: icon_down 1.5s infinite;
    cursor: pointer;

    .down-ico {
      width: 30px;
    }
  }
}
.main {
  display: flex;
  .left {
    width: 900px;

    .q-nav-main {
      display: flex;
      justify-content: center;
      background: var(--bg-brand-color);
      margin: 10px 0;
      border-radius: 0.3rem;
      .q-nav-item {
        padding: 0 10px;
        height: 2.101rem;
        text-align: center;
        line-height: 2.101rem;
        border-radius: 0.3rem;
        margin: 0.6rem;
        font-size: 1rem;
        font-weight: bold;
        color: var(--text-color);
        cursor: pointer;
      }

      .q-nav-item:hover {
        background: var(--border-box-color);
      }
    }
  }

  .right {
    width: 400px;
    padding: 10px 20px;
  }
  @media screen and (max-width: 1400px) {
    .right {
      width: auto;
    }
    .left {
      width: auto;
      padding: 10px 20px;
    }
    .main {
      width: 100%;
      flex-direction: column;
    }
  }
  @media screen and (max-width: 480px) {
    .main .left .q-nav-main .q-nav-item {
      font-size: 14px;
      margin: 5px;
      padding: 0 7px;
    }
  }
}

.post-list {
  .list-main {
    margin-bottom: 20px;
    width: 100%;
    border-radius: 5px;
    background-color: var(--bg-brand-color);
    transition: opacity 0.2s ease;
  }

  .list-main:hover {
    opacity: 0.9;
    cursor: pointer;
  }

  .list-main:active {
    opacity: 0.8;
  }

  .list-vessel,
  .list-vessel-move {
    display: flex;
    width: 100%;
  }

  .list-vessel-move {
    display: none;
  }

  .list-left {
    width: 300px;
    margin: 10px;
    overflow: hidden;
    border-radius: 5px;
  }

  .list-left .img {
    width: 100%;
    height: 100%;
    background-size: cover !important;
  }

  .list-right {
    margin: 20px 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .list-top {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .list-title {
    font-size: 20px;
    font-weight: bold;
    color: var(--text-color);
  }

  .list-content {
    font-size: 14px;
    color: var(--text-sub-color);
    line-height: 1.5;
  }

  .list-belw {
    display: flex;
    justify-content: space-between;
    border-top: rgba(230, 230, 230, 0.63) solid 1px;
    padding-top: 10px;
    align-items: center;
    user-select: none;
  }

  .post-stats {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .qsub-icon {
    width: 14px;
    height: 14px;
  }

  .list-belw-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-sub-color);
  }

  .svg-icon {
    width: 14px;
    height: 14px;
    fill: var(--text-sub-color);
  }
}

.post-list.empty {
  text-align: center;
  padding: 40px 0;
  color: var(--text-sub-color);
}

.qsub-data-loading {
  text-align: center;
  padding: 12px 0;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: var(--bg-brand-color);
  color: var(--text-color);
  cursor: pointer;
}

.qsub-data-loading.disabled {
  cursor: default;
  opacity: 0.7;
}

.qsub-data-loading.loading {
  cursor: wait;
}
</style>
