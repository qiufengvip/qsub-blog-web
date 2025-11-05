<template>
  <comment-issue :isLogin="isLogin" :postId="props.postId" :user-data="userData" @login="openLogin" @issue="issueSucceed"></comment-issue>
  <div class="comment-body">
    <div v-for="(packetItem, index) in data" :key="index" class="comment-packet">
      <div v-for="(content, idx) in packetItem" :key="idx" :class="userData?.id === content.userId ? 'content-right' : 'content-left'">
        <div>
          <div class="user-avatar">
            <el-avatar :src="content.user.avatar" />
          </div>
        </div>
        <div class="detail">
          <div class="content-title">
            <div class="user-name">{{ content.user.nickname }}</div>
            <div v-if="content.parentId" class="parent-user-name" @click="jumpToParent(content.parentId)">@{{ content?.parentUser?.nickname }}</div>
          </div>
          <div :id="'content-' + content.id" class="content-data">
            {{ content.content }}
          </div>
          <div class="info">
            <span>{{ content.createTime }}</span>
            <span class="span-split">·</span>
            <span>{{ content.ipPlace }}</span>
            <template v-if="isLogin">
              <span class="span-split">·</span>
              <span
                class="revert"
                @click="
                  revertShow = true;
                  parentId = content.id;
                  packetId = content.packetId;
                "
                >回复</span
              >
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="load-main"><el-button :loading="loading" @click="getPageComment">加载更多...</el-button></div>
  </div>
  <client-login v-if="showLogin" @exit="loginExit"></client-login>

  <div class="comment-dialog">
    <el-dialog v-model="revertShow" draggable overflow @close="revertShow = false">
      <comment-issue :isLogin="isLogin" :postId="props.postId" :parent-id="parentId" :packet-id="packetId" :user-data="userData" @issue="issueSucceed"></comment-issue>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import clientLogin from '@/components/blog/ClientLogin/index.vue';
import { User } from '@/utils/interface/BlogClientPostDetail';
import { getCommentList, getCommentPacketList } from '@/http/interface/client/comment';
import CommentIssue from '@/components/blog/CommentIssue.vue';
import { ElMessage } from 'element-plus';

const showLogin = ref(false);
const isLogin = ref(false);
const parentId = ref<number>();
const packetId = ref<number>();
const revertShow = ref(false);
const getPageComment = () => {
  pageInfo.pageNum++;
  getCommentData();
};
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});
const openLogin = () => {
  console.log('打开登录');
  showLogin.value = true;
};
const loginExit = (status: boolean) => {
  showLogin.value = false;
  if (status) {
    getStorageUser();
  }
};

const userData = ref<User>({});
/**
 * 发表成功
 */
const issueSucceed = (packetId) => {
  if (packetId) {
    revertShow.value = false;
    console.log('更新一条');
    getCommentPacketList({ packetId: packetId }).then((res) => {
      for (let i = 0; i < data.value.length; i++) {
        let list: any[] = data.value[i];
        if (list.length > 0) {
          if (list[0].id === packetId) {
            list.length = 0;
            list.push(...res);
          }
        }
      }
    });
  } else {
    // 回到最新页
    pageInfo.pageNum = 1;
    getCommentData();
  }
};

/**
 * 获取本地用户信息
 */
const getStorageUser = async () => {
  if (typeof window === 'undefined') {
    return;
  }
  let parse = sessionStorage.getItem('user');
  if (parse) {
    userData.value = JSON.parse(parse);
    isLogin.value = true;
  } else {
    isLogin.value = false;
  }
};
// 分页配置
let pageInfo = {
  search: {
    postId: props.postId,
  },
  // 当前页
  pageNum: 1,
  pageSize: 10,
};
const loading = ref(false);
const getCommentData = () => {
  loading.value = true;
  getCommentList(pageInfo)
    .then((res: any) => {
      if (res.length > 0) {
        data.value.push(...res);
      } else {
        if (pageInfo.pageNum > 1) {
          ElMessage.info('没有更多啦!');
        }
        pageInfo.pageNum--;
      }
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getStorageUser();
  getCommentData();
});

const sendComments = ref(false);
const totalTxt = ref('现在已有20条评论');
const data = ref<any>([]);
/**
 * 根据评论id跳转到指定评论
 * @param contentId
 */
const jumpToParent = (contentId: number) => {
  console.log('跳到：', contentId);
  const element = document.getElementById('content-' + contentId);
  if (element) {
    const rect = element.getBoundingClientRect();
    const distanceFromTop = rect.top;
    element.scrollIntoView({ behavior: 'smooth', block: distanceFromTop < 80 ? 'center' : 'nearest' });
    highlightText(contentId);
  }
};
/**
 * 高亮评论div3秒
 */
const highlightText = (contentId: number) => {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      console.log('执行');
      const element = document.getElementById('content-' + contentId);
      if (!element) {
        return;
      }
      if (i % 2 == 0) {
        element.style.border = '#007fff solid 1px';
      } else {
        element.style.border = '#00000000 solid 1px';
      }
    }, 350 * i);
  }
};
</script>

<style scoped lang="scss">
.comment-body {
  width: 100%;
  .load-main {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}

.comment-packet {
  background-color: var(--bg-brand-color);
  border-radius: 20px;
  padding: 30px;
  margin: 10px 0;

  .content-left {
    display: flex;
    .detail {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .content-right {
    display: flex;
    flex-direction: row-reverse;

    .detail {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .content-title {
        flex-direction: row-reverse;
      }
    }
  }

  .detail {
    margin: 0 10px;
    padding-bottom: 20px;

    .content-title {
      display: flex;
      color: var(--text-color);
      align-items: flex-end;

      .parent-user-name {
        font-weight: bold;
        font-size: 10px;
        cursor: pointer;
        color: #007fff;
      }

      .user-name {
        margin: 5px 5px 0 5px;
        font-size: 15px;
        font-weight: bolder;
      }
    }

    .content-data {
      color: var(--text-color);
      font-size: 14px;
      margin: 5px 0 10px;
      background-color: var(--content-color);
      padding: 10px 10px;
      border-radius: 12px;
      border: #00000000 solid 1px;
      line-height: initial;
      word-break: break-word;
    }

    .info {
      color: var(--text-color);
      font-size: 12px;
      margin: 0 5px 0 5px;
      .span-split {
        padding: 0 3px;
      }
      .revert {
        cursor: pointer;
        color: #007fff;
      }
    }
  }
}
.comment-dialog {
  :deep(.el-dialog) {
    width: 700px;
  }
}
@media screen and (max-width: 1200px) {
  .comment-packet {
    padding: 20px;
  }
}
@media screen and (max-width: 500px) {
  .comment-packet {
    padding: 10px;
  }
}
@media screen and (max-width: 900px) {
  .comment-dialog {
    :deep(.el-dialog) {
      width: 90%;
    }
  }
}

.user-avatar {
  border-radius: 50%;
  padding: 3px;
  display: flex;
  border: var(--border-box-color) solid 1px;
}
</style>
