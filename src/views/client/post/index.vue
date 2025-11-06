<template>
  <view-frame>
    <div v-loading="loading" class="body">
      <div class="main">
        <div class="left">
          <div class="left-main">
            <!--  展示 -->
            <template v-if="showPost">
              <div class="article-top">
                <!-- 移动端展示信息 -->
                <div class="middle-t qsub-menu-mobile">
                  <div class="comment-main-reply">
                    <div class="t-left">
                      <el-avatar :size="45" :src="postData?.user.avatar" />
                    </div>
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
                        <el-text class="right-info-time" line-clamp="2">{{ postData?.user.motto }}</el-text>
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
                      <div>{{ postData?.stats?.commentNumber }}</div>
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
                    <a class="el-dropdown-link" :href="'/labelTimeline/' + label.id" @click.prevent @click="openLabelTImeLine(label.id)">{{ label.name }}</a>
                  </div>
                </div>
              </div>
              <markdown-show :text="postData?.content"></markdown-show>
              <!-- 转赞评 -->
              <div class="like-main">
                <a class="like-button" :class="{ liked: isLiked }" @click="toggleLike">
                  <span class="like-icon">
                    <div class="heart-animation-1"></div>
                    <div class="heart-animation-2"></div>
                  </span>
                </a>
                <div class="like-title">🎇🎇鼓励一下吧！🎇🎇</div>
              </div>
              <!--        评论 -->
              <div class="comment">
                <comment :post-id="postId" />
              </div>
            </template>
            <template v-else>
              <div class="no-post">
                <div>曾经有一份真正的页面放在我面前，</div>
                <div>我没有珍惜。</div>
                <div>等我失去的时候，</div>
                <div>我才后悔莫及，</div>
                <div>人世间最痛苦的事莫过于此。</div>
                <div>如果上天能给我一个再来一次的机会，</div>
                <div>我会对那个页面说三个字，</div>
                <div>4〇4</div>
                <div>页面未找到</div>
                <a href="/">返回首页</a>
              </div>
            </template>
          </div>
        </div>
        <div class="right">
          <div class="right-main">
            <div v-if="showPost" class="personalInfo qsub-menu-web">
              <div class="t-left">
                <el-avatar :size="50" :src="postData?.user.avatar" />
              </div>
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
                <el-text class="right-info-time" line-clamp="2">{{ postData?.user.motto }}</el-text>
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
              <!--              <div class="btnSty">了解一下</div>-->
            </div>
            <HotPost></HotPost>
            <HotComments></HotComments>
          </div>
        </div>
      </div>
    </div>
  </view-frame>
</template>

<script lang="ts" setup>
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import HotPost from '@/components/blog/HotPost.vue';
import HotComments from '@/components/blog/HotComments.vue';
import Comment from '@/components/blog/Comment.vue';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import MarkdownShow from '@/components/common/MarkdownShow/index.vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { detail, like } from '@/http/interface/client/post';
import { useRoute } from 'vue-router';
import { BlogClientPostDetail } from '@/utils/interface/BlogClientPostDetail';
import { addPostLike, getPostLikeStart, setWebTitle } from '@/utils/dataDispose';
import { openLabelTImeLine } from '@/utils/openPage';
import useElementPlusInjections from '@/views/client/useElementPlusInjections';
import { readSSRState, writeSSRState, snapshotState } from '@/ssr/state';

useElementPlusInjections();
const route = useRoute();
// 文章id
const postId = route.params.id as string;
// 点赞状态
const isLiked = ref(getPostLikeStart(Number(postId)));
// 是否展示文章
const showPost = ref(true);

const loading = ref(true);
const postData = ref<BlogClientPostDetail | undefined>(undefined);
const STATE_KEY = `client-post-${postId}`;

const persistState = () => {
  writeSSRState(STATE_KEY, {
    postData: snapshotState(postData.value),
    showPost: showPost.value,
    loading: loading.value,
  });
};

const fetchPostDetail = async () => {
  try {
    const res: any = await detail({ postId: postId });
    setWebTitle(res.title);
    postData.value = res;
    showPost.value = true;
  } catch (error) {
    console.error('获取文章详情失败:', error);
    showPost.value = false;
  } finally {
    loading.value = false;
    persistState();
  }
};
type PostHydrationState = {
  postData?: BlogClientPostDetail;
  showPost?: boolean;
  loading?: boolean;
};

const hydrated = readSSRState<PostHydrationState>(STATE_KEY);

if (hydrated) {
  postData.value = hydrated.postData ? (snapshotState(hydrated.postData) as BlogClientPostDetail) : undefined;
  showPost.value = typeof hydrated.showPost === 'boolean' ? hydrated.showPost : true;
  loading.value = typeof hydrated.loading === 'boolean' ? hydrated.loading : false;
  if (postData.value?.title) {
    setWebTitle(postData.value.title);
  }
} else {
  await fetchPostDetail();
}
/**
 * 点击喜欢
 */
const toggleLike = () => {
  if (isLiked.value) return;
  like({ postId: postId }).then(() => {
    ElMessage.success('点赞成功');
    if (postData.value) {
      postData.value.stats.likeNumber++;
    }
  });
  isLiked.value = true;
  addPostLike(parseInt(postId));
};

const text = ref('');
</script>

<style lang="scss" scoped>
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

.middle-t {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 20px 0;
}

.comment-main-reply {
  display: flex;
  max-width: 70%;
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
    color: var(--text-sub-color);
    line-height: 150%;
    font-size: 12px;
  }

  .t-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 0.8rem;
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
.statistics {
  justify-content: flex-end;
  margin-top: 0;
  background-color: var(--bg-brand-color);
  padding: 15px;

  .p-item {
    color: var(--text-color);
    margin-left: 10px;
    background: var(--content-color);
    font-size: 13px;
    font-weight: bold;
    display: flex;
    align-items: center;
    padding: 5px 5px 5px 5px;
    min-width: 60px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    div {
      padding-left: 5px;
    }
  }
}
.like-main {
  margin-top: 2px;
  height: 150px;
  display: flex;
  background-color: var(--bg-brand-color);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  .like-title {
    height: 50px;
    line-height: 50px;
    font-size: 15px;
    font-weight: bold;
  }
}

.body {
  width: 100%;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  background: var(--bg-background-color);
}

.main {
  //width: 1300px;
  display: flex;
}

.left {
  margin: 10px;
  width: 900px;
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
@media screen and (max-width: 500px) {
  .article-top {
    padding: 10px 5px 5px 10px;
    .post-title {
      font-size: 1.2rem;
    }
  }
}
.right-bottom {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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
.right {
  width: 400px;
  .personalInfo {
    width: 100%;
    background: var(--bg-brand-color);
    border-radius: 5px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .t-left img {
      width: 3.001rem;
      height: 3.001rem;
      border-radius: 150%;
      margin-top: 20px;
    }
    .right-top {
      display: flex;
      align-items: center;
      margin: 12px 0;
    }
    .right-top-name {
      margin-right: 5px;
      font-weight: bold;
      font-size: 18px;
      color: var(--text-color);
    }
    .right-bottom {
      width: 230px;
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
    .right-info-time {
      margin: 10px;
      text-align: center;
      line-height: 150%;
      color: var(--text-sub-color);
      font-size: 12px;
    }
    .btnSty {
      width: 80%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 20px;
      background-color: #d29073;
      margin: 10px 0;
      color: #fff;
    }
  }
}

.right-main {
  padding: 10px;
  .t-left {
    margin-top: 10px;
  }
}

.comment {
  padding-top: 2px;
}

.icon3 {
  width: 20px;
  height: 20px;
}

@media screen and (max-width: 1400px) {
  .left {
    width: auto;
  }

  .right {
    width: 100%;
    /*display: none;*/
  }

  .main {
    flex-direction: column;
    width: 100%;
  }
  .statistics {
    display: none;
  }
  .property-s {
    justify-content: flex-start;
  }
  .middle-t {
    display: flex;
    // flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .middle-p {
    display: flex;
    align-items: flex-end;
  }
}
// 以下是点赞动画
.like-button {
  -webkit-touch-callout: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  width: 50px;
  height: 50px;
  border: #7e7e7e solid 1px;
  border-radius: 50%;
  /* padding: 0.45rem 0.75rem; */
  font-weight: bold;
  color: var(--text-color);
  display: flex;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  filter: grayscale(100%);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  align-items: center;
}
.like-button.liked {
  color: var(--text-color);
  border-color: currentColor;
  filter: grayscale(0);
}
.like-button:hover {
  border-color: currentColor;
}

.like-icon {
  width: 24px;
  height: 24px;
  display: inline-block;
  position: relative;
  /* margin-right: 0.25em; */
  font-size: 1.5rem;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyMSAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAuMTAxIDQuNDE3UzguODk1LjIwNyA1LjExMS4yMDdjLTQuNDY1IDAtMTAuOTY3IDYuODQ2IDUuMDgyIDE3LjU5MkMyNS4yMzcgNy4wMyAxOS42NjUuMjAyIDE1LjUwMS4yMDJjLTQuMTYyIDAtNS40IDQuMjE1LTUuNCA0LjIxNXoiIGZpbGw9IiNGRjZFNkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==)
    no-repeat center;
  background-size: 100%;
  -webkit-animation: heartUnlike-dca22806 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartUnlike-dca22806 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.liked .like-icon {
  -webkit-animation: heartPulse 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartPulse 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.liked .like-icon [class^='heart-animation-'] {
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyMSAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAuMTAxIDQuNDE3UzguODk1LjIwNyA1LjExMS4yMDdjLTQuNDY1IDAtMTAuOTY3IDYuODQ2IDUuMDgyIDE3LjU5MkMyNS4yMzcgNy4wMyAxOS42NjUuMjAyIDE1LjUwMS4yMDJjLTQuMTYyIDAtNS40IDQuMjE1LTUuNCA0LjIxNXoiIGZpbGw9IiNGRjZFNkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==')
    no-repeat center;
  background-size: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 16px;
  height: 14px;
  opacity: 0;
}
.liked .like-icon [class^='heart-animation-']::before,
.liked .like-icon [class^='heart-animation-']::after {
  content: '';
  background: inherit;
  background-size: 100%;
  width: inherit;
  height: inherit;
  display: inherit;
  position: relative;
  top: inherit;
  left: inherit;
  opacity: 0;
}
.liked .like-icon .heart-animation-1 {
  -webkit-animation: heartFloatMain-1 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartFloatMain-1 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.liked .like-icon .heart-animation-1::before,
.liked .like-icon .heart-animation-1::after {
  width: 12px;
  height: 10px;
  visibility: hidden;
}
.liked .like-icon .heart-animation-1::before {
  opacity: 0.6;
  -webkit-animation: heartFloatSub-1 1s 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartFloatSub-1 1s 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.liked .like-icon .heart-animation-1::after {
  -webkit-animation: heartFloatSub-2 1s 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartFloatSub-2 1s 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  opacity: 0.75;
}
.liked .like-icon .heart-animation-2 {
  -webkit-animation: heartFloatMain-2 1s 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartFloatMain-2 1s 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}
.liked .like-icon .heart-animation-2::before,
.liked .like-icon .heart-animation-2::after {
  width: 10px;
  height: 8px;
  visibility: hidden;
}
.liked .like-icon .heart-animation-2::before {
  -webkit-animation: heartFloatSub-3 1s 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartFloatSub-3 1s 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  opacity: 0.25;
}
.liked .like-icon .heart-animation-2::after {
  -webkit-animation: heartFloatSub-4 1s 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation: heartFloatSub-4 1s 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  opacity: 0.4;
}

@-webkit-keyframes heartPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}

@keyframes heartPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
@-webkit-keyframes heartUnlike {
  50% {
    transform: scale(0.75);
  }
}
@keyframes heartUnlike {
  50% {
    transform: scale(0.75);
  }
}
@-webkit-keyframes heartFloatMain-1 {
  0% {
    opacity: 0;
    transform: translate(0) rotate(0);
  }
  50% {
    opacity: 1;
    transform: translate(0, -25px) rotate(-20deg);
  }
}
@keyframes heartFloatMain-1 {
  0% {
    opacity: 0;
    transform: translate(0) rotate(0);
  }
  50% {
    opacity: 1;
    transform: translate(0, -25px) rotate(-20deg);
  }
}
@-webkit-keyframes heartFloatMain-2 {
  0% {
    opacity: 0;
    transform: translate(0) rotate(0) scale(0);
  }
  50% {
    opacity: 0.9;
    transform: translate(-10px, -38px) rotate(25deg) scale(1);
  }
}
@keyframes heartFloatMain-2 {
  0% {
    opacity: 0;
    transform: translate(0) rotate(0) scale(0);
  }
  50% {
    opacity: 0.9;
    transform: translate(-10px, -38px) rotate(25deg) scale(1);
  }
}
@-webkit-keyframes heartFloatSub-1 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(13px, -13px) rotate(30deg);
  }
}
@keyframes heartFloatSub-1 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(13px, -13px) rotate(30deg);
  }
}
@-webkit-keyframes heartFloatSub-2 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(18px, -10px) rotate(55deg);
  }
}
@keyframes heartFloatSub-2 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(18px, -10px) rotate(55deg);
  }
}
@-webkit-keyframes heartFloatSub-3 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(-10px, -10px) rotate(-40deg);
  }
  100% {
    transform: translate(-50px, 0);
  }
}
@keyframes heartFloatSub-3 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(-10px, -10px) rotate(-40deg);
  }
  100% {
    transform: translate(-50px, 0);
  }
}
@-webkit-keyframes heartFloatSub-4 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(2px, -18px) rotate(-25deg);
  }
}
@keyframes heartFloatSub-4 {
  0% {
    visibility: hidden;
    transform: translate(0) rotate(0);
  }
  50% {
    visibility: visible;
    transform: translate(2px, -18px) rotate(-25deg);
  }
}
.no-post {
  //height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background: var(--bg-brand-color);
  div {
    margin-top: 20px;
    font-size: 18px;
    color: var(--text-color);
    font-weight: bold;
  }
  a {
    margin: 20px;
    color: #234adb;
    font-weight: bold;
  }
}
</style>
