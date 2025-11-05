<template>
  <view-frame>
    <div class="top">
      <div
        ref="topRef"
        class="top-img"
        :style="w / h > 1.8 ? 'background: url(' + img + ') center center no-repeat; background-size:100% auto ' : 'background: url(' + img + ') center center no-repeat; background-size:auto 100%'"
      >
        <div class="top-title">关于</div>
      </div>
    </div>
    <div class="body">
      <div class="main">
        <div class="to-you">
          <markdown-show :text="essay"></markdown-show>
        </div>
        <comment :post-id="-3" />
      </div>
    </div>
  </view-frame>
</template>
<script lang="ts" setup>
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { onMounted, ref } from 'vue';
import Comment from '@/components/blog/Comment.vue';
import { getConfigData, setWebTitle } from '@/utils/dataDispose';
import MarkdownShow from '@/components/common/MarkdownShow/index.vue';

const essay = getConfigData('about');
const topRef = ref();
const img = ref('http://file.qsub.cn/blog/2024/8/8d33ab1e7a704256b3e8f22ea5de2507.jpg');
const w = ref(1);
const h = ref(1);
setWebTitle('关于');
/**
 * 获取顶部区域的长宽
 */
const getTopRefWxH = () => {
  let lxWxH = topRef.value.getBoundingClientRect();
  w.value = lxWxH.width;
  h.value = lxWxH.height;
};
onMounted(() => {
  getTopRefWxH();
  window.onresize = () => {
    return (() => {
      getTopRefWxH();
    })();
  };
});
</script>

<style lang="scss" scoped>
:deep(.el-main) {
  padding: 0;
}
.top {
  width: 100%;

  .top-img {
    width: 100%;
    height: 30rem;
    letter-spacing: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  .top-title {
    font-size: 25px;
    font-weight: bold;
    color: #ffffff;
  }
}
.body {
  width: 100%;
  display: flex;
  justify-content: center;
  .main {
    width: 1340px;
    max-width: 1340px;
    padding: 10px;

    .to-you {
      background-color: var(--bg-brand-color);
      border-radius: 20px;
      padding: 10px;
    }
  }
}
</style>
