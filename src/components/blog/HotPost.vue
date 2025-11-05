<template>
  <div class="qsub-hot">
    <div class="qsub-hot-top">
      <div class="qsub-hot-title">最新文章</div>
    </div>
    <div class="qsub-hot-content">
      <a v-for="(item, key) in postList" :key="key" :href="getUri(item)" class="qsub-hot-post" @click.prevent @click="openPost(item.id)">
        <div v-if="item.postImg" class="qsub-hot-left">
          <div class="img" :style="'background: url(' + item.postImg + ') center center no-repeat;'"></div>
        </div>
        <div class="qsub-hot-right">
          <el-text class="title" truncated>
            {{ item.title }}
          </el-text>
          <el-text v-loading class="subtitle" line-clamp="3">
            {{ item.subtitle }}
          </el-text>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getNewestPostList } from '@/http/interface/client/home';
import { BlogPostSketch } from '@/utils/interface/blogPostSketch';
import { openPost } from '@/utils/openPage';

const postList = ref<BlogPostSketch[]>([]);
const getUri = (item: any) => {
  return `/post/${item.id}`;
};
/**
 * 获取最新文章
 */
const getPostListData = async () => {
  let res: any = await getNewestPostList();
  postList.value.push(...res);
};

onMounted(() => {
  getPostListData();
});
</script>

<style lang="scss" scoped>
.qsub-hot {
  /*margin: 10px;*/
  background: var(--bg-brand-color);
  border-radius: 5px;
  .qsub-hot-top {
    padding: 20px;
    .qsub-hot-title {
      color: var(--text-color);
      font-size: 15px;
      font-weight: bold;
      padding: 5px 10px;
      border-left: #234adb solid 4px;
    }
  }
  .qsub-hot-content {
    padding: 0 20px 20px 20px;
    .qsub-hot-post {
      display: flex;
      padding: 8px;
      border-radius: 8px;
      background: var(--content-color);
      margin-bottom: 10px;
      height: 4.7rem;
      .qsub-hot-left .img {
        background-size: cover !important;
        width: 120px;
        height: 100%;
        border-radius: 5px;
      }
      .qsub-hot-right {
        margin: 5px;
        padding-left: 5px;
        color: var(--text-color);
        line-height: 127%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 4; /* 可以显示的行数，超出部分用...表示*/
        -webkit-box-orient: vertical;

        .title {
          font-weight: bold;
          width: 100%;
          color: var(--text-color);
        }
        .subtitle {
          font-size: 13px;
          color: var(--text-sub-color);
        }
      }
    }
    .qsub-hot-post:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }
}
</style>
