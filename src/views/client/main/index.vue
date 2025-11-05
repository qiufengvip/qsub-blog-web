<template>
  <view-frame>
    <!--顶部 -->
    <div class="top selected" :style="w / h > 1.66 ? 'background-size:' + (100 + scrollTop) + '% auto' : 'background-size:auto ' + (100 + scrollTop) + '%'">
      <div class="chicken-soup-for-the-soul" v-text="data.centerpiece"></div>
      <p class="down" @click="toMain"><svg-icon class="down-ico" name="down"></svg-icon></p>
    </div>

    <div ref="main" class="main">
      <div class="left">
        <div class="left-main">
          <div class="q-nav-main selected">
            <div v-for="(item, index) in navList" :key="index" :style="nav === item.id ? 'background: var(--content-color)' : ''" class="q-nav-item" @click="navClick(item.id)">{{ item.label }}</div>
          </div>
          <post-list v-if="postListShow" :param="paramData" :request="postListRequest"></post-list>
        </div>
      </div>
      <div class="right">
        <div class="right-main">
          <hot-post></hot-post>
          <hot-comments></hot-comments>
        </div>
      </div>
    </div>
  </view-frame>
</template>

<script lang="ts" setup>
import ViewFrame from '@/components/blog/ViewFrame/index.vue';
import { onMounted, ref } from 'vue';
import PostList from '@/components/blog/PostList.vue';
import HotPost from '@/components/blog/HotPost.vue';
import HotComments from '@/components/blog/HotComments.vue';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import { getConfigData, setWebTitle } from '@/utils/dataDispose';
import { getCatalogPostList, getHotPostList, getNewestPostList } from '@/http/interface/client/post';

const postListShow = ref(false);
const postListRequest = ref<Function>(getNewestPostList);
const paramData = ref({});
const nav = ref('getNewestPostList');
setWebTitle('');
const navList = ref([
  {
    id: 'getNewestPostList',
    label: '最新',
  },
  {
    id: 'getHotPostList',
    label: '最热',
  },
  {
    id: '7',
    label: '前端',
  },
  {
    id: '6',
    label: '后端',
  },
  {
    id: '32',
    label: '随笔',
  },
  {
    id: '101',
    label: '生活',
  },
]);
/**
 * 分类被点击
 */
const navClick = (id: string) => {
  nav.value = id;
  showPostList(id);
};

/**
 * 展示列表
 */
const showPostList = async (id: string) => {
  console.log(id);
  postListShow.value = false;
  if (id === 'getNewestPostList') {
    // 最新文章
    postListRequest.value = getNewestPostList;
    paramData.value = {};
  } else if (id === 'getHotPostList') {
    // 最热
    postListRequest.value = getHotPostList;
    paramData.value = {};
  } else {
    postListRequest.value = getCatalogPostList;
    paramData.value = {
      catalogId: parseInt(id),
    };
  }
  setTimeout(() => {
    postListShow.value = true;
  }, 0);
};

const scrollTop = ref(0); //导航头
const data = ref({ centerpiece: getConfigData('centerpiece') }); //导航头
const w = ref(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth); //导航头
const h = ref<any>(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
const main = ref();
onMounted(() => {
  window.addEventListener('scroll', scrollHandle);
  window.onresize = () => {
    return (() => {
      w.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      h.value = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    })();
  };
  showPostList(nav.value);
});
const scrollHandle = () => {
  scrollTop.value = (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) / 30;
};
const toMain = () => {
  main.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<style lang="scss" scoped>
body {
  overflow-x: hidden;
  overflow-y: hidden;
  width: 100vw;
}

.el-header {
  padding: 0 !important;
}

.el-main {
  padding: 0 !important;
}

.top {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url('http://file.qsub.cn/blog/2023/9/634cae15b00c4b029a754eeae88f933b.jpg') center center no-repeat;
  transition: background-size 0.8s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  // 一言
  .chicken-soup-for-the-soul {
    font-weight: bold;
    font-size: 1.501rem;
    text-align: center;
    line-height: 180%;
    margin: 30px;
    color: var(--text-color);
    -webkit-text-stroke: 2px transparent;
    background: var(--bg-brand-color) top left / 100% 100%;
    -webkit-background-clip: text;
  }

  @keyframes icon_down {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.5;
      transform: scale(0.8) translateY(40px);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .down {
    position: absolute;
    bottom: 30px;
    color: #eee;
    font-size: 20px;
    text-align: center;
    text-shadow: 0.1rem 0.1rem 0.2rem rgb(0 0 0 / 15%);
    line-height: 1.5;
    display: inline-block;
    animation: icon_down 1.5s infinite;
    cursor: pointer;

    .down-ico {
      width: 30px;
    }
  }
}
.main {
  display: flex;
  .left {
    width: 900px;

    .q-nav-main {
      display: flex;
      justify-content: center;
      background: var(--bg-brand-color);
      margin: 10px 0;
      border-radius: 0.3rem;
      .q-nav-item {
        padding: 0 10px;
        height: 2.101rem;
        text-align: center;
        line-height: 2.101rem;
        border-radius: 0.3rem;
        margin: 0.6rem;
        font-size: 1rem;
        font-weight: bold;
        color: var(--text-color);
        cursor: pointer;
      }

      .q-nav-item:hover {
        background: var(--border-box-color);
      }
    }
  }

  .right {
    width: 400px;
    padding: 10px 20px;
  }
  @media screen and (max-width: 1400px) {
    .right {
      width: auto;
    }
    .left {
      width: auto;
      padding: 10px 20px;
    }
    .main {
      width: 100%;
      flex-direction: column;
    }
  }
  @media screen and (max-width: 480px) {
    .main .left .q-nav-main .q-nav-item {
      font-size: 14px;
      margin: 5px;
      padding: 0 7px;
    }
  }
}
</style>
