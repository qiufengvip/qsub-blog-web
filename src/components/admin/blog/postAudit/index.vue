<template>
  <div class="post-main">
    <el-dialog v-model="model" title="文章审核" @close="canceled">
      <div>
        <div class="article-top">
          <!-- 移动端展示信息 -->
          <div class="middle-t qsub-menu-mobile">
            <div class="comment-main-reply">
              <div class="t-left"><img :src="postData?.user.avatar" :alt="postData?.user.nickname" /></div>
              <div class="t-right">
                <div class="right-top-main">
                  <div class="right-top">
                    <div class="right-top-name">{{ postData?.user.nickname }}</div>
                    <div class="right-top-id">
                      <SvgIcon name="vip"></SvgIcon>
                      <div class="right-top-grade">普通会员</div>
                    </div>
                  </div>
                </div>
                <div class="right-info">
                  <div class="right-info-time">{{ postData?.user.motto }}</div>
                </div>
              </div>
            </div>
            <div class="right-bottom">
              <div class="right-cols">
                <p>文章</p>
                <p>{{ postData?.user?.stats.postNumber }}</p>
              </div>
              <div class="right-cols">
                <p>评论</p>
                <p>{{ postData?.user?.stats.commentNumber }}</p>
              </div>
              <div class="right-cols">
                <p>获赞</p>
                <p>{{ postData?.user?.stats.praisedNumber }}</p>
              </div>
            </div>
          </div>
          <div class="post-title">{{ postData?.title }}</div>
          <div class="property-s">
            <div class="property-s selected">
              <div class="property">
                <SvgIcon name="book"></SvgIcon>
                <div>{{ postData?.stats?.viewNumber }}</div>
              </div>
              <div class="property">
                <SvgIcon name="comment"></SvgIcon>
                <div>25</div>
              </div>
              <div class="property">
                <SvgIcon name="like"></SvgIcon>
                <div>{{ postData?.stats?.likeNumber }}</div>
              </div>
              <div class="property">
                <SvgIcon name="word_count"></SvgIcon>
                <div>字数: {{ postData?.stats?.contentNumber }}</div>
              </div>
              <div class="property">
                <SvgIcon name="sand_clock"></SvgIcon>
                <div>阅读时长: {{ postData?.stats?.readingTime }}</div>
              </div>
              <div class="property selected">
                <SvgIcon name="feather"></SvgIcon>
                <div>{{ postData?.createTime }}</div>
              </div>
              <div class="property">
                <SvgIcon name="cyclic_utilization"></SvgIcon>
                <div>{{ postData?.updateTime }}</div>
              </div>
            </div>
          </div>
          <div v-if="postData?.labelList?.length" class="label selected">
            <div class="label-item">
              <SvgIcon name="label"></SvgIcon>
            </div>
            <div v-for="label in postData.labelList" class="label-item">
              <a class="el-dropdown-link" :href="'/label/' + label.id">{{ label.name }}</a>
            </div>
          </div>
        </div>
        <markdown-show :text="postData?.content"></markdown-show>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-input v-model="auditLogging"></el-input>
          <el-button type="warning" @click="auditClick(false)">驳回</el-button>
          <el-button type="success" @click="auditClick(true)">审核通过</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import MarkdownShow from '@/components/common/MarkdownShow/index.vue';
import { onMounted, ref } from 'vue';
import { BlogClientPostDetail } from '@/utils/interface/BlogClientPostDetail';
import { audit, detailAudit } from '@/http/interface/admin/postAudit';
import { ElMessage } from 'element-plus';
// 驳回理由
const auditLogging = ref('');

const postData = ref<BlogClientPostDetail | undefined>(undefined);
const model = ref(true);
const emit = defineEmits(['exit']);
const auditClick = (isAudit: boolean) => {
  if (!isAudit) {
    if (!auditLogging.value) {
      ElMessage.error('请输入驳回理由');
      return;
    }
  }
  audit({ id: props.postId, type: isAudit, auditLogging: auditLogging.value })
    .then((res: any) => {
      ElMessage.success('审核完成');
      emit('exit', true);
    })
    .catch((e) => {
      console.log(e);
    });
};
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
});
const init = () => {
  detailAudit({ id: props.postId })
    .then((res: any) => {
      postData.value = res;
    })
    .catch((e) => {
      emit('exit');
    });
};
onMounted(() => {
  model.value = true;
  init();
});

const canceled = () => {
  emit('exit');
};
</script>

<style scoped lang="scss">
:deep(.el-dialog__body) {
  img {
    width: auto;
  }
}
.article-top {
  background: var(--bg-brand-color);
  margin-bottom: 2px;
  padding: 30px 20px 10px 30px;
  border-radius: 8px 8px 0 0;

  .post-title {
    font-size: 1.5rem;
    line-height: 150%;
    font-weight: bolder;
    color: var(--text-color);
  }

  .middle-t {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 20px 0;
  }

  .property-s {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .property {
      color: var(--text-color);
      font-size: 10px;
      margin-top: 10px;
      font-weight: bold;
      display: flex;
      margin-right: 15px;
      //min-width: 130px;
      align-items: center;
      div {
        margin-top: 3px;
      }
    }
  }
  .label {
    display: flex;
    flex-wrap: wrap;

    .label-item {
      background: var(--content-color);
      padding: 4px 5px;
      margin-top: 10px;
      border-radius: 3px;
      margin-right: 5px;
      display: flex;
      align-items: center;
      font-size: 10px;
      font-weight: bold;

      .el-dropdown-link {
        color: var(--text-color);
      }
      svg {
        width: 12px;
        height: 12px;
        fill: var(--text-color);
      }
    }
  }
}

.qsub-menu-mobile {
  display: none;
}

@media screen and (max-width: 1000px) {
  .qsub-menu-web {
    display: none !important;
  }
  .qsub-menu-mobile {
    display: flex;
  }
  .qsub-menu-mobile {
    display: flex;
    align-items: center;
  }

  .qsub-menu-mobile > .qsub-menu {
    width: 100%;
  }
}

.comment-main-reply {
  display: flex;

  .t-left img {
    width: 3.001rem;
    height: 3.001rem;
    border-radius: 150%;
  }

  .right-top-main {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right-top {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .right-top-name {
      padding-right: 10px;
      font-weight: bold;
      font-size: 1.18rem;
      color: var(--text-color);
    }

    .right-top-id {
      display: flex;
      align-items: center;
      background-color: #d29073;
      border-radius: 5px;
      padding: 1px 5px;

      .right-top-grade {
        font-size: 10px;
        color: #fff5d0;
      }
    }

    .right-top-tag {
      width: 15px;
      height: 15px;
    }
  }

  .right-info-time {
    color: var(--text-color);
  }

  .t-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0.8rem;
  }
}

.right-bottom {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .right-cols {
    //background: var(--content-color);
    //border-radius: 5px;
    //padding: 2px 8px;
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      font-size: 10px;
      font-weight: bold;
      margin: 2px;
    }
  }
}
.dialog-footer {
  display: flex;
  .el-input {
    margin-right: 10px;
  }
}
.post-main {
  :deep(.el-dialog) {
    max-width: 1000px;
    min-width: 100px;
  }
}
@media screen and (max-width: 1000px) {
  .post-main {
    :deep(.el-dialog) {
      width: 80%;
    }
  }
}
</style>
