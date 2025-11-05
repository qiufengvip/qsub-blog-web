<template>
  <transition class="el-zoom-in-top">
    <div>
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
                    <SvgIcon name="post-post_list_like" />
                    {{ item?.stats?.likeNumber }}
                  </div>
                  <div class="list-belw-item">
                    <SvgIcon name="post-post_list_view" />
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
                      <SvgIcon name="post-post_list_like" />
                      {{ item?.stats?.likeNumber }}
                    </div>
                    <div class="list-belw-item">
                      <SvgIcon name="post-post_list_view" />
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
      <div v-loading="loadingData" class="qsub-data-loading" @click="getPostList()">{{ loading }}</div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { Clock, View } from '@element-plus/icons';
import { onMounted, ref } from 'vue';
import { getCatalogPostList } from '@/http/interface/client/post';
import { BlogPostSketch } from '@/utils/interface/blogPostSketch';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import { openPost } from '@/utils/openPage';

const getUri = (item: any) => {
  return `/post/${item.id}`;
};

const props = defineProps({
  request: {
    type: Function,
    default: getCatalogPostList,
  },
  param: {
    type: Object,
    default() {
      return {};
    },
  },
});

const postList = ref<BlogPostSketch[]>([]);
const loading = ref('查看更多 (｡・`ω´･)');
// 分页配置
let PageInfo = {
  search: props.param,
  pageNum: 0,
  pageSize: 10,
};
const loadingData = ref(false);
//加载列表数据
const getPostList = async () => {
  if (loadingData.value) return;
  loadingData.value = true;
  loading.value = '加载中...';
  PageInfo.pageNum += 1;
  let res = await props.request(PageInfo);
  console.log(res);
  if (res) {
    PageInfo.pageNum = res.pageNum;
    PageInfo.pageSize = res.pageSize;
    if (res.list && res.list.length > 0) {
      postList.value.push(...res.list);
      loading.value = '查看更多 (｡・`ω´･)';
      setTimeout(() => {
        loadingData.value = false;
      }, 1000);
    } else {
      PageInfo.pageNum -= 1;
      loading.value = '没有更多啦 (｡・`ω´･)';
      loadingData.value = false;
    }
  }
};
onMounted(() => {
  getPostList();
});
</script>

<style lang="scss" scoped>
.el-zoom-in-top {
  a {
    text-decoration: none; /* 去掉下划线 */
    color: inherit; /* 继承父元素的颜色 */
    font-weight: normal; /* 恢复正常字体粗细 */
    background-color: transparent; /* 移除背景色 */
    border: none; /* 移除边框 */
    padding: 0; /* 移除内边距 */
    margin: 0; /* 移除外边距 */
    outline: none; /* 移除点击时的轮廓 */
  }
}
.list-main:hover {
  opacity: 0.9;
  cursor: pointer;
}
.list-main:active {
  opacity: 0.8;
}

.list-main {
  margin-bottom: 20px;
  width: 100%;
  border-radius: 5px;
  background-color: var(--bg-brand-color);
}

.list-vessel {
  display: flex;
  height: 100%;
  width: 100%;
}

.list-belw {
  display: flex;
  justify-content: space-between;
  border-top: rgba(230, 230, 230, 0.63) solid 1px;
  padding-top: 10px;
  align-items: center;
  user-select: none;
  .post-stats {
    display: flex;
    align-items: center;

    .svg-icon {
      fill: var(--text-color);
      width: 14px;
      height: 14px;
    }

    .list-belw-item {
      min-width: 40px;
    }
  }
}

.list-left {
  width: 300px;
  margin: 10px;
  overflow: hidden;
}

.list-right {
  margin: 20px 15px;
  height: 150px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex: 1;
}

.img {
  border-radius: 8px;
  background-size: cover !important;
  width: 100%;
  height: 100%;
}

.list-title {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--text-color);
}

.list-content {
  color: #6d6d6d;
  font-size: 14px;
  line-height: 150%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 可以显示的行数，超出部分用...表示*/
  -webkit-box-orient: vertical;
}

// 子标题
.list-belw-item {
  display: flex;
  align-items: center;
  color: var(--text-color) 2;
  font-weight: bold;
  justify-content: flex-end;
}

.qsub-icon {
  padding-right: 5px;
}

.qsub-data-loading {
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border-radius: 5px;
  background: var(--bg-brand-color);
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 50px;
  cursor: pointer;
  user-select: none;
}

.qsub-data-loading:hover {
  color: var(--text-color);
  box-shadow: -2px -2px 2px var(--content-color), 2px 2px 2px var(--content-color);
}

.list-vessel-move {
  display: none;
}

.list-belw-item {
}

@media screen and (max-width: 800px) {
  .list-vessel {
    display: none;
  }

  .list-vessel-move {
    display: flex;
    flex-direction: column;

    .list-left {
      width: 100%;
      height: 13.806rem;
      margin: 0;

      .img {
        border-radius: 8px 8px 0 0;
      }
    }

    .list-right {
      width: auto;

      .list-belw {
        justify-content: flex-start;
      }
    }
  }
  .list-content {
    margin-top: 5px;
  }
}
</style>
