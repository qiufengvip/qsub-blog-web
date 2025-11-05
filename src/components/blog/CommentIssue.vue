<template>
  <div class="comment-issue">
    <div v-if="!isLogin" class="mask">
      <div class="make-main">
        <div class="message">请先登录后再发表你的观点吧！</div>
        <div class="login" @click="openLogin">点击登录</div>
      </div>
    </div>
    <div v-else class="comment-issue-body">
      <div class="comment-issue-user">
        <div class="user-avatar">
          <el-avatar :src="userData.avatar" />
        </div>
        <div class="user-data">
          <div class="user-nickname">
            <el-text truncated>
              {{ userData.nickname }}
            </el-text>
          </div>
          <div class="user-motto">
            <el-text truncated>
              {{ userData.motto }}
            </el-text>
          </div>
        </div>
      </div>
      <div class="comment-issue-data">
        <el-input v-model="contentData" rows="6" maxlength="500" placeholder="说一说你的看法。" show-word-limit type="textarea" @blur="handleBlur" />
        <div class="comment-issue-operate">
          <el-popover :width="280" popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 5px;">
            <template #reference>
              <SvgIcon class="add-emoji-icon" name="post-add_emoji"></SvgIcon>
            </template>
            <template #default>
              <div class="emoji-body">
                <div v-for="(item, i) in emoji" :key="i" class="emoji-item" @click="appendFormula(item)">{{ item }}</div>
              </div>
            </template>
          </el-popover>
          <el-button :loading="loading" type="primary" size="small" @click="sendComment()">{{ parentId ? '回复' : '发表' }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { send } from '@/http/interface/client/comment';
import { ElMessage } from 'element-plus';
import { User } from '@/utils/interface/BlogClientPostDetail';
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  isLogin: {
    type: Boolean,
    required: true,
  },
  parentId: {
    type: Number,
    default: null,
  },
  packetId: {
    type: Number,
    default: null,
  },
  userData: {
    type: Object as () => User,
    required: true,
  },
});
const loading = ref(false);
const emit = defineEmits(['login', 'issue']);
const openLogin = () => {
  console.log('点击登录');
  emit('login');
};
const cursorPos = ref(); // 光标位置
const contentData = ref('');
const sendComment = () => {
  if (!contentData.value) {
    return;
  }
  let parent = {
    postId: props.postId,
    content: contentData.value,
  };
  if (props.parentId) {
    parent.parentId = props.parentId;
  }
  loading.value = true;
  send(parent)
    .then(() => {
      ElMessage.success('发表成功啦~');
      contentData.value = '';
      emit('issue', props.packetId);
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};
const handleBlur = (e: any) => {
  cursorPos.value = e.target.selectionStart;
};
const appendFormula = (str: any) => {
  if (!contentData.value) {
    contentData.value = str;
  } else {
    const start = contentData.value.substring(0, cursorPos.value);
    const end = contentData.value.substring(cursorPos.value);
    contentData.value = `${start}${str}${end}`;
  }
};
const emoji = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '😘',
  '🥰',
  '😗',
  '😙',
  '🥲',
  '😚',
  '🙂',
  '🤗',
  '🤩',
  '🤔',
  '🫡',
  '🤨',
  '😐',
  '😑',
  '😶',
  '🫥',
  '😶',
  '🙄',
  '😏',
  '😣',
  '😥',
  '😮',
  '🤐',
  '😯',
  '😪',
  '😫',
  '🥱',
  '😴',
  '😌',
  '😛',
  '😜',
  '😝',
  '🤤',
  '😒',
  '😓',
  '😔',
  '😕',
  '🤯',
  '😬',
  '😮',
  '💨',
  '😰',
  '😱',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🤡',
];
</script>
<style lang="scss" scoped>
.comment-issue {
  padding-top: 10px;
  width: 100%;

  .mask {
    background-color: var(--bg-brand-color);
    border-radius: 20px;
    width: 100%;
    height: 200px;

    .make-main {
      width: 100%;
      height: 100%;
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      background-color: rgba(126, 126, 126, 0.4);

      .message {
      }

      .login {
        margin-left: 5px;
        cursor: pointer;
        color: #3760ff;
      }
    }
  }

  .comment-issue-body {
    background-color: var(--bg-brand-color);
    border-radius: 20px;
    padding: 20px;
    display: flex;
    width: calc(100% - 40px);

    .comment-issue-user {
      .user-data {
        display: none;
      }
    }

    .comment-issue-data {
      padding: 0 10px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      :deep(.el-textarea__inner) {
        background-color: var(--content-color);
        resize: none;
      }

      :deep(.el-input__count) {
        background: var(--content-color);
      }

      .comment-issue-operate {
        padding-top: 10px;
        display: flex;
        justify-content: flex-end;

        .add-emoji-icon {
          width: 25px;
          height: 25px;
          margin-right: 10px;
        }
      }
    }
  }
}

:deep(.emoji-popover) {
  padding: 5px;
}

.emoji-body {
  display: flex;
  flex-wrap: wrap;
  width: 270px;

  .emoji-item {
    text-align: center;
    margin: 2px;
    padding: 4px;
    font-size: 19px;
    cursor: pointer;
    border-radius: 8px;
  }

  .emoji-item:hover {
    background-color: var(--content-color);
  }
}
@media screen and (max-width: 500px) {
  .comment-issue {
    .comment-issue-body {
      flex-direction: column;
      padding: 20px;
      width: calc(100% - 40px);
      .comment-issue-data {
        padding: 0;
      }
      .comment-issue-user {
        display: flex;
        padding-bottom: 10px;
        align-items: center;

        .user-data {
          display: flex;
          padding-left: 10px;
          flex-direction: column;
          .user-nickname {
            padding-bottom: 3px;
            :deep(.el-text) {
              font-size: 15px;
              font-weight: bold;
            }
          }
          .user-motto {
            :deep(.el-text) {
              font-size: 13px;
            }
          }
        }
      }
    }
  }
}
</style>
