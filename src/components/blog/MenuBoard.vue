<template>
  <!--    站点头部 -->
  <transition name="el-zoom-in-top">
    <div v-show="show" class="qsub-header">
      <div id="qsub-header" ref="transitionBox" class="qsub-header-body">
        <div class="header-menu" @click="showMenuMobile">
          <svg-icon name="menu_colours" class="header-menu-icon"></svg-icon>
        </div>
        <div class="qsub-header-left">
          <div class="qsub-logo selected">
            <SvgIcon name="logo" color="#E87955"></SvgIcon>
            <div>秋枫博客</div>
          </div>
          <ul class="qsub-menu">
            <li v-for="(item, index) in menuData" :key="index" class="qsub-menu-li" @mouseenter="menuHover(item)" @mouseleave="menuHover(item)">
              <div class="qsub-menu-item-f">
                <a :href="getMenuHref(item)" class="qsub-menu-item-a">
                  <div v-html="item.icon"></div>
                  <span class="qsub-menu-title" v-text="item.serverName"></span>
                </a>
                <el-icon v-if="item.children?.length > 0" style="margin-bottom: 2px"><CaretBottom /></el-icon>
                <transition name="el-zoom-in-top">
                  <div v-if="item.children?.length > 0" v-show="item.show" class="qsub-menu-list">
                    <a v-for="(item2, index2) in item.children" :key="index2" class="qsub-menu-item" :href="getMenuHref(item2)">
                      <div class="qsub-menu-item-a">
                        <div v-html="item2.icon"></div>
                        <span class="qsub-menu-title" v-text="item2.serverName"></span>
                      </div>
                      <div class="qsub-menu-item-b">
                        <el-icon><CaretRight /></el-icon>
                      </div>
                    </a>
                  </div>
                </transition>
              </div>
            </li>
          </ul>
        </div>

        <!-- 移动端 -->
        <div class="qsub-menu-mobile selected">
          <div class="menu-base">
            <div class="menu-base-item">
              <el-icon :size="18" @click="showSearchDialog = true"> <Search /></el-icon>
            </div>
            <div class="menu-base-item">
              <el-icon v-if="mode === 'light'" :size="18" @click="handleCommand('dark')"><Sunny /></el-icon>
              <el-icon v-if="mode === 'dark'" :size="18" @click="handleCommand('light')"><Moon /></el-icon>
            </div>
          </div>
        </div>
        <div class="qsub-menu-web selected">
          <!-- 主题切换 -->
          <div class="menu-base">
            <div class="menu-base-item">
              <el-icon :size="18" @click="showSearchDialog = true"> <Search /></el-icon>
            </div>
            <div class="menu-base-item">
              <el-icon v-if="mode === 'light'" :size="18" @click="handleCommand('dark')"><Sunny /></el-icon>
              <el-icon v-else :size="18" @click="handleCommand('light')"><Moon /></el-icon>
            </div>
            <div class="menu-base-item" @click="userClick">
              <el-icon :size="18"><UserFilled /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <el-drawer v-model="menuMobile" :with-header="false" size="220">
    <div class="mobile-top selected" @click="userClick">
      <el-avatar :size="100" :src="userData?.avatar ? userData.avatar : userImg" />
      <el-text v-if="userData" truncated>{{ userData?.nickname }}</el-text>
      <div v-else class="user-name">Hi! 欢迎<span style="color: #234adb">登录</span></div>
    </div>

    <div class="menu-mobile selected">
      <ul>
        <li v-for="(item, index) in menuData" :key="index" class="menu-mobile-li">
          <div class="menu-mobile-item" @click="openRouter(getMenuHref(item))">
            <a class="menu-mobile-item-title" :href="getMenuHref(item)">
              <div v-html="item.icon"></div>
              <span class="menu-mobile-title" v-text="item.serverName"></span>
            </a>
            <el-icon v-if="item.children?.length > 0" @click.stop="menuMobileClick(item)"><CaretBottom /></el-icon>
          </div>
          <div v-if="item.children?.length > 0" :style="item.mobileShow ? 'height:' + item.children.length * 45 + 'px' : 'height:0'" class="menu-mobile-list">
            <div v-for="(item2, subIndex) in item.children" :key="subIndex" class="menu-mobile-item" @click="openRouter(getMenuHref(item2))">
              <a class="menu-mobile-item-a" :href="getMenuHref(item2)">
                <div v-html="item2.icon"></div>
                <span class="menu-mobile-title" v-text="item2.serverName"></span>
              </a>
              <div class="menu-mobile-item-b">
                <el-icon><CaretRight /></el-icon>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </el-drawer>
  <client-login v-if="showLogin" @exit="loginExit"></client-login>
  <search-dialog v-if="showSearchDialog" @exit="searchExit"></search-dialog>
</template>

<script lang="ts" setup>
import { getMenuList } from '@/http/interface/client/home';
import { onMounted, ref } from 'vue';
import { useColorMode } from '@vueuse/core';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import SearchDialog from '@/components/blog/SearchDialog/index.vue';
import { CaretBottom, CaretRight, Moon, Sunny, UserFilled, Search } from '@element-plus/icons';
import { User } from '@/utils/interface/BlogClientPostDetail';
import clientLogin from '@/components/blog/ClientLogin/index.vue';
import { openRouter } from '@/utils/openPage';
const userImg = ref('http://file.qsub.cn/userimg.png');
const show = ref(false);
const activeIndex = ref('');
const oldScrollTop = ref(0); // 滚动前，滚动条距顶部的距离
const menuData = ref<any[]>([]);
const menuMobile = ref(false);
const transitionBox = ref();
// 搜索弹窗
const showSearchDialog = ref(false);
const searchExit = () => {
  showSearchDialog.value = false;
};
const mode = useColorMode({
  attribute: 'class',
  modes: {
    // custom colors
    dark: 'dark',
    light: 'light',
  },
});

const handleSelect = (key: any, keyPath: any) => {
  console.log(key, keyPath);
  key = [];
  key.push();
  console.log();
};

const getMenuHref = (item: any) => {
  if (item.serverUrl) {
    return item.serverUrl;
  } else {
    return '/catalog/' + item.id;
  }
};

onMounted(() => {
  // 监听页面滚动事件
  show.value = true;
  window.addEventListener('scroll', scrolling);
  getMenuList().then((res: any) => {
    menuData.value = res;
  });
});

const handleCommand = (command: any) => {
  mode.value = command;
};

const menuMobileClick = (item: any) => {
  item.mobileShow = !item.mobileShow;
};
const menuHover = (item: any) => {
  item.show = !item.show;
};
const userData = ref<User>();
const isLogin = ref(false);
const showLogin = ref(false);

/**
 * 用户登录点击
 */
const userClick = () => {
  getStorageUser();
  if (isLogin.value) {
    window.open(`/admin`);
  } else {
    showLogin.value = true;
  }
};
const loginExit = (status: boolean) => {
  showLogin.value = false;
  if (status) {
    getStorageUser();
  }
};

/**
 * 获取本地用户信息
 */
const getStorageUser = async () => {
  let parse = sessionStorage.getItem('user');
  if (parse) {
    userData.value = JSON.parse(parse);
    isLogin.value = true;
  } else {
    isLogin.value = false;
  }
};

const showMenuMobile = () => {
  getStorageUser();
  menuMobile.value = true;
};

const scrolling = () => {
  // 滚动条距文档顶部的距离
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  let attribute;
  try {
    attribute = transitionBox.value.getAttribute('id');
  } catch (e) {}
  if (scrollTop > 150) {
    if (attribute === 'qsub-header') {
      transitionBox.value.setAttribute('id', 'qsub-header-bg');
    }
  } else {
    if (attribute === 'qsub-header-bg') {
      transitionBox.value.setAttribute('id', 'qsub-header');
    }
  }
  // 滚动条滚动的距离
  let scrollStep = scrollTop - oldScrollTop.value;
  // 更新——滚动前，滚动条距文档顶部的距离
  oldScrollTop.value = scrollTop;
  if (scrollStep < 0) {
    if (!show.value) {
      show.value = true;
    }
  } else {
    if (show.value) {
      // 如果想要隐藏设置此处为false
      show.value = true;
    }
  }
  return true;
};
</script>

<style lang="scss">
/** 图标 **/
.icon {
  width: 16px;
  height: 16px;
  padding-right: 5px;
}

.icon-arrow {
  fill: var(--text-color);
  width: 10px;
  height: 10px;
  padding: 6px;
}
</style>

<style lang="scss" scoped>
.mobile-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  .user-name {
    margin: 20px 0;
    color: var(--text-color);
    font-size: 16px;
    font-weight: bold;
  }
  :deep(.el-text) {
    margin: 20px 0;
    color: var(--text-color);
    font-size: 16px;
    font-weight: bold;
  }
}

.menu-mobile {
  width: 180px;
  .menu-mobile-li {
    color: var(--text-color);
    margin: 10px 0;
    font-size: 15px;
    font-weight: bold;

    .menu-mobile-list {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      //display: none;
      height: 0;
      transition: height 0.3s;
      margin-left: 20px;
      .menu-mobile-item-a {
        display: flex;
        align-items: center;
      }
      .menu-mobile-item-b {
        display: flex;
        align-items: center;
      }
    }

    .menu-mobile-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 5px;
      height: 25px;
      padding: 10px 10px;

      .menu-mobile-item-title {
        display: flex;
        align-items: center;
      }

      .menu-mobile-title {
        margin-left: 10px;
        color: var(--text-color);
      }
    }
    .menu-mobile-item:hover {
      background: var(--content-color);
    }
  }
}

#qsub-header-bg {
  background-color: var(--bg-background-color);
}

.qsub-menu {
}

.qsub-menu {
  /*height: 10px;*/
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
}

.qsub-menu-li {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  padding-right: 6px;

  .qsub-menu-item-f {
    cursor: pointer;
    color: var(--text-color);
    display: flex;
    align-items: center;
    position: relative;
    height: 35px;

    .qsub-menu-list {
      background-color: var(--bg-brand-color);
      width: 150px;
      padding: 8px 6px;
      border-radius: 5px;
      position: absolute;
      top: 47px;
      left: -10px;
    }
  }
}

.qsub-menu-li:hover {
  //background: var(--border-color);

  .qsub-menu-list {
    display: block;
  }
}

.qsub-menu-item {
  color: var(--text-color);
  display: flex;
  align-items: center;
  padding: 8px 14px;
  position: relative;
  justify-content: space-between;
}

.qsub-menu-item-a {
  display: flex;
  align-items: center;
}

.qsub-menu-item-b {
}

.qsub-menu-item:hover {
  background: var(--content-color);
  border-radius: 5px;
}

.menu-item {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.qsub-header {
  display: flex;
  justify-content: center;
  position: fixed;
  width: 100%;
  height: 60px;
  z-index: 800;
  background-color: color-mix(in oklch, var(--bg-background-color), transparent 50%);
  //backdrop-filter: blur(5px);

  .header-menu {
    padding: 0 15px;
    display: none;
    .header-menu-icon {
      cursor: pointer;
      width: 26px;
      height: 26px;
    }
  }

  .qsub-header-body {
    border-bottom: 0.8px solid rgba(140, 104, 104, 0.5);
    transition: background-color 1s;
    background-color: var(--bg-brand-color) -menu-immerse;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .qsub-header-left {
    display: flex;
    height: 100%;

    .qsub-logo {
      // width: 120px;
      font-size: 20px;
      font-weight: bold;
      padding-left: 20px;
      color: var(--text-color);
      display: flex;
      align-items: center;
      padding-right: 20px;

      svg {
        width: 30px !important;
        height: 30px;
        padding-right: 10px;
        fill: var(--warning-color);
      }
    }
  }
  .qsub-menu {
    .qsub-menu-title {
      color: var(--text-color);
      font-weight: bold;
      font-size: 14px;
      margin-right: 5px;
    }
  }

  .qsub-menu-web {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .qsub-menu-mobile {
    display: none;
    .qsub-menu {
      width: 100%;
    }
  }
  .menu-base {
    // border: 1px solid red;
    //height: 60px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 17px;
    flex-direction: row;

    .menu-icon {
      width: 25px;
      height: 25px;
    }

    .menu-base-item {
      margin-left: 15px;
      cursor: pointer;

      .el-dropdown-link {
        display: flex;
        align-items: center;
        color: var(--text-color);
        // color: #000;
        font-weight: bold;
        cursor: pointer;
      }
      .el-dropdown-link:focus-visible {
        outline: none;
      }

      .theme-icon {
        width: 20px;
        height: 20px;
        margin-right: 10px;
      }
    }
  }
}

.icons {
  width: 35px;
  height: 35px;
}
// 媒体查询
@media screen and (max-width: 1000px) {
  .qsub-header-body {
    .header-menu {
      display: block;
    }
    .qsub-header-left {
      .qsub-menu {
        display: none;
      }
    }

    .qsub-menu-web {
      display: none;
    }
    .qsub-menu-mobile {
      display: flex;
    }
  }
}
</style>
