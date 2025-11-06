<!-- 分类专栏管理 -->
<template>
  <view-frame>
    <div class="top">
      <div
        ref="topRef"
        class="top-img"
        :style="w / h > 1.8 ? 'background: url(' + img + ') center center no-repeat; background-size:100% auto ' : 'background: url(' + img + ') center center no-repeat; background-size:auto 100%'"
      >
        <div class="top-title-main">
          <div class="top-title">你还有好多未完成的梦想，又有什么理由停下脚步</div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="main">
        <div class="friend-main">
          <div class="top-title-main">
            <div class="top-title">朋友们</div>
            <el-divider />
          </div>
          <div class="friend-list">
            <a v-for="item in friendList" :href="item.linkUrl" class="friend-item" @click.prevent @click="openLink(item.linkUrl)">
              <div class="friend-item-img">
                <el-avatar :src="item.fileUrl" />
              </div>
              <div class="friend-item-data">
                <div class="friend-item-title">
                  <el-text truncated>{{ item.linkName }}</el-text>
                </div>
                <div class="friend-item-motto">
                  <el-text truncated>{{ item.motto }}</el-text>
                </div>
              </div>
            </a>
          </div>
        </div>
        <div class="to-you">
          <markdown-show :text="essay"></markdown-show>
        </div>
        <comment :post-id="-2" />
      </div>
    </div>
  </view-frame>
</template>
<script lang="ts" setup>
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { onMounted, ref } from 'vue';
import Comment from '@/components/blog/Comment.vue';
import { getConfigData, setWebTitle } from '@/utils/dataDispose';
import { getLinkList } from '@/http/interface/client/link';
import { openLink } from '@/utils/openPage';
import { ElMessage } from 'element-plus';
import MarkdownShow from '@/components/common/MarkdownShow/index.vue';
import useElementPlusInjections from '@/views/client/useElementPlusInjections';
import { readSSRState, writeSSRState, snapshotState } from '@/ssr/state';

useElementPlusInjections();
setWebTitle('朋友');
const essay = getConfigData('friendMassage');
const topRef = ref();
const img = ref('https://file.qsub.cn/blog/2024/8/3c38cd7a04f3432d9e9c10542131909a.png');
const w = ref(1);
const h = ref(1);
const friendList = ref<any[]>([]);
/**
 * 获取顶部区域的长宽
 */
const getTopRefWxH = () => {
  let lxWxH = topRef.value.getBoundingClientRect();
  w.value = lxWxH.width;
  h.value = lxWxH.height;
};
const fetchFriendList = async () => {
  try {
    const res = await getLinkList();
    friendList.value = res;
  } catch (error) {
    console.error('获取友链列表失败:', error);
  }
};
const STATE_KEY = 'client-friend';

type FriendHydrationState = {
  friendList: any[];
};

const hydrated = readSSRState<FriendHydrationState>(STATE_KEY);

if (hydrated) {
  friendList.value = Array.isArray(hydrated.friendList) ? [...hydrated.friendList] : [];
} else {
  await fetchFriendList();
  writeSSRState(STATE_KEY, {
    friendList: snapshotState(friendList.value),
  });
}
const handleCopyCodeSuccess = () => {
  ElMessage.success('复制成功');
};

onMounted(() => {
  getTopRefWxH();
  if (typeof window !== 'undefined') {
    window.onresize = () => {
      return (() => {
        getTopRefWxH();
      })();
    };
  }
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
  .top-title-main {
    background-color: #00000020;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .top-title {
      margin: 10px;
      line-height: 200%;
    }
  }
}
.top-title {
  font-size: 25px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}
.body {
  width: 100%;
  display: flex;
  justify-content: center;
  .main {
    width: 1340px;
    max-width: 1340px;
    padding: 10px;
    .friend-main {
      border-radius: 20px;
      margin-bottom: 10px;
      padding: 10px;
      background-color: var(--bg-brand-color);

      .top-title-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 20px;
      }

      .friend-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .friend-item {
          display: flex;
          background-color: var(--content-color);
          border-radius: 10px;
          margin: 5px;
          // 鼠标
          cursor: pointer;

          .friend-item-img {
            padding: 10px;
          }
          .friend-item-data {
            padding: 13px 10px 10px 0;
            width: 150px;
            .friend-item-title {
              :deep(.el-text) {
                font-size: 15px;
                font-weight: bold;
              }
            }
            .friend-item-motto {
              padding-top: 5px;
              :deep(.el-text) {
                color: var(--text-sub-color);
                font-size: 13px;
              }
            }
          }
        }
        .friend-item:hover {
          background-color: var(--border-box-color);
        }
      }
    }

    .to-you {
      background-color: var(--bg-brand-color);
      border-radius: 20px;
      padding: 10px;
    }
  }
}
@media screen and (max-width: 520px) {
  .body .main .friend-main {
    .friend-list {
      .friend-item {
        width: 100%;
        .friend-item-data {
        }
      }
    }
  }
}
</style>
