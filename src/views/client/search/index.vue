<!-- 分类专栏管理 -->
<template>
  <view-frame>
    <div class="top">
      <div class="top-img" :style="{ background: img }">
        <div>{{ title }}</div>
      </div>
    </div>
    <div v-loading="loading" class="body">
      <div class="main">
        <div class="left">
          <post-list :request="search" :param="paramData"></post-list>
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
import { search } from '@/http/interface/client/post';
import { setWebTitle } from '@/utils/dataDispose';
const route = useRoute();
// 分类专栏id
const word = route.params.word as string;
const title = ref(`'${word}'搜索结果`);
setWebTitle(title.value);
const loading = ref(false);
// 参数
const paramData = ref({
  word: word,
});

const img = ref('url(http://file.qsub.cn/blog/2024/8/7537890b238446a0b4b863d0f7393240.jpg) center center / 100% no-repeat');
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
