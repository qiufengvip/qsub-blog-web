<template>
  <div class="qsub-hot">
    <div class="qsub-hot-top">
      <div class="qsub-hot-title">最新评论</div>
    </div>

    <div class="qsub-hot-content">
      <div v-if="!dataList.length">暂无数据...</div>
      <div v-for="(item, key) in dataList" v-else :key="key" class="qsub-hot-post" @click="openPost(item.postId)">
        <div class="qsub-hot-content-top">
          <div class="qsub-hot-content-top-tile">
            <img :alt="item?.user?.nickname" :src="item?.user?.avatar" />
            <div class="qsub-hot-user-name">{{ item.user.nickname }}</div>
          </div>
          <div class="qsub-time">{{ item.createTime }}</div>
        </div>
        <div class="qsub-hot-content-main">
          <div class="qsub-hot-content-bottom">
            <el-text class="content" line-clamp="3">
              {{ item.content }}
            </el-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getNewestCommentList } from '@/http/interface/client/home';
import { BlogComment } from '@/utils/interface/blogComment';
import { openPost } from '@/utils/openPage';

const dataList = ref<BlogComment[]>([]);

/**
 * 获取最新文章
 */
const getPostListData = async () => {
  let res: any = await getNewestCommentList();
  dataList.value.push(...res);
  console.log(dataList.value);
};

onMounted(() => {
  getPostListData();
});
</script>

<style lang="scss" scoped>
.qsub-hot-top {
  padding: 20px 20px 10px;
}

.qsub-hot-content {
  padding: 10px;
}

.qsub-hot-title {
  color: var(--text-color);
  font-size: 15px;
  font-weight: bold;
  padding: 5px 10px;
  border-left: #234adb solid 4px;
  margin-left: 2px;
}

.qsub-hot-content-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.qsub-hot {
  margin-top: 10px;
  background-color: var(--bg-brand-color);
  border-radius: 5px;
}

.qsub-hot-post {
  /*display: flex;*/
  padding: 5px 10px 5px 10px;
  border-radius: 5px;
}
.qsub-hot-post:hover {
  background: var(--border-box-color);
  cursor: pointer;
}

.qsub-hot-content-top img {
  width: 30px;
  height: 30px;
  border-radius: 150%;
}

.qsub-hot-content-top {
}

.qsub-hot-content-top-tile {
  display: flex;
  align-items: center;
}

.qsub-hot-user-name {
  padding-left: 10px;
  padding-right: 10px;
  font-size: 15px;
  //width: 150px;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-weight: bold;
}

.qsub-time {
  min-width: 110px;
  color: var(--text-color);
}

.qsub-hot-content-bottom {
  background: var(--content-color);
  padding: 8px 8px 5px 8px;
  border-radius: 5px;

  .content {
    font-size: 0.8rem;
    color: var(--text-color) 2;
    line-height: 25px;
  }
}

.qsub-hot-content-main {
  margin: 6px 0 10px 0;
}
</style>
