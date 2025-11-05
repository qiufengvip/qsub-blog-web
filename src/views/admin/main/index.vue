<template>
  <template v-if="container">
    <el-container class="common-layout-main">
      <el-aside class="pc aside">
        <div class="top-title">
          <SvgIcon class="icon-logo" color="#E87955" name="logo"></SvgIcon>
          <div v-if="!isCollapse">秋枫博客</div>
        </div>
        <el-menu :collapse="isCollapse" :default-active="$route.path" class="el-menu-vertical selected" @select="menuSelect">
          <template v-for="(item, index) in menuData">
            <template v-if="item.children">
              <el-sub-menu :key="index" :index="item.serverUrl" class="menu-item">
                <template #title>
                  <el-icon>
                    <SvgIcon :name="item.icon"></SvgIcon>
                  </el-icon>
                  <span class="menu-title" v-text="item.serverName"></span>
                </template>
                <el-menu-item-group>
                  <template v-for="itemChildren in item.children">
                    <el-menu-item :index="itemChildren.serverUrl">
                      <SvgIcon :name="itemChildren.icon"></SvgIcon>
                      <span class="menu-title" v-text="itemChildren.serverName"></span>
                    </el-menu-item>
                  </template>
                </el-menu-item-group>
              </el-sub-menu>
            </template>
            <template v-else>
              <el-menu-item :key="index" :index="item.serverUrl">
                <el-icon>
                  <SvgIcon :name="item.icon"></SvgIcon>
                </el-icon>
                <span class="menu-title" v-text="item.serverName"></span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>

      <el-header class="header mobile header-mobile">
        <div class="head-t">
          <el-icon v-if="route?.name === 'postAdd'" size="18" @click="openPage('/admin/postList', '文章列表')"><ArrowLeftBold /></el-icon>
        </div>
        <div class="head-title">{{ route?.name }}</div>
        <div class="head-f">
          <template v-if="route?.name === 'setting'">
            <el-icon v-if="mode === 'light'" class="el-icon-menu" :size="18" @click="handleCommand('dark')"><Sunny /></el-icon>
            <el-icon v-else class="el-icon-menu" :size="18" @click="handleCommand('light')"><Moon /></el-icon>
            <SvgIcon class="el-icon-menu" name="client" @click="openRouter('/')"></SvgIcon>
            <SvgIcon class="el-icon-menu exit" name="exit" @click="exit()"></SvgIcon>
          </template>
        </div>
      </el-header>

      <el-main>
        <el-header class="pc header">
          <div class="head-t" @click="Collapses">
            <SvgIcon class="el-icon-menu" name="menu"></SvgIcon>
          </div>
          <div class="head-f">
            <el-icon v-if="mode === 'light'" class="el-icon-menu" :size="18" @click="handleCommand('dark')"><Sunny /></el-icon>
            <el-icon v-else class="el-icon-menu" :size="18" @click="handleCommand('light')"><Moon /></el-icon>
            <SvgIcon class="el-icon-menu" name="client" @click="openRouter('/')"></SvgIcon>
            <SvgIcon class="el-icon-menu exit" name="exit" @click="exit()"></SvgIcon>
          </div>
        </el-header>
        <DLTagsView class="pc" :store="store"></DLTagsView>
        <div class="tab-main">
          <router-view v-slot="{ Component }" class="main-content">
            <keep-alive>
              <component :is="Component" :key="$route.fullPath" />
            </keep-alive>
          </router-view>
        </div>
      </el-main>
      <el-footer class="mobile">
        <div class="footer-main">
          <div class="footer-item" @click="openPage('/admin', '首页')">
            <el-icon size="20" :color="route?.name === 'home' ? '#00b3ff' : ''"><HomeFilled /></el-icon><span>首页</span>
          </div>
          <div class="footer-item" @click="openPage('/admin/postList', '文章列表')">
            <el-icon size="20"><Document /></el-icon>
            <span>文章</span>
          </div>
          <div class="footer-item" @click="openPage('/admin/commentList', '评论管理')">
            <el-icon size="20"><Comment /></el-icon>
            <span>评论</span>
          </div>
          <div class="footer-item" @click="openPage('/admin/setting', '个人设置')">
            <el-icon size="20"><Avatar /></el-icon>
            <span>我的</span>
          </div>
        </div>
      </el-footer>
    </el-container>
  </template>
</template>

<script lang="ts" setup>
import DLTagsView from '@/components/common/DLTagsView/index.vue';

import { useRoute, useRouter } from 'vue-router';
import { onBeforeMount, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useColorMode } from '@vueuse/core';
import { requestLogout } from '@/http/interface/api';
import { Document, HomeFilled, Moon, Sunny, Comment, Avatar, ArrowLeftBold } from '@element-plus/icons';
import { openRouter } from '@/utils/openPage';
let router = useRouter();
const route = useRoute();
const store = useStore();
console.log(route);
const openPage = (uri: string, name: string) => {
  router.push({
    path: uri,
    query: { tagName: name },
  });
  console.log(route);
};

const mode = useColorMode({
  attribute: 'class',
  modes: {
    // custom colors
    dark: 'dark',
    light: 'light',
    youth: 'youth',
  },
});
const handleCommand = (command: any) => {
  mode.value = command;
};

const container = ref(false);

store.commit('setMenuList');

onBeforeMount(() => {
  if (!sessionStorage.getItem('token')) {
    router.push({ path: '/admin/login' });
  } else {
    container.value = true;
  }
});

/**
 * @desc 菜单
 */
interface menuData {
  children: menuData[];
  default: boolean;
  icon: string;
  id: string;
  serverName: string;
  serverUrl: string;
}

// 是否展开左侧菜单
const isCollapse = ref(false);
const menuData = ref<menuData[]>([]);

onMounted(() => {
  init();
});
const init = async () => {
  menuData.value = sessionStorage['admin-menu'] ? JSON.parse(sessionStorage['admin-menu']) : [];
  console.log(menuData.value);
};

const Collapses = () => {
  isCollapse.value = !isCollapse.value;
};
//
// 菜单点击事件
const menuSelect = (index: any) => {
  if (index) {
    router.push({ path: index });
  }
};
// 没有就添加 存在就跳转
const addTabs = (tab: any) => {};
const exit = () => {
  requestLogout();
  sessionStorage.setItem('token', '');
  window.location.href = '/admin/login';
};
</script>
<style lang="scss">
.el-aside {
  --el-aside-width: auto;
}

.el-tabs__content {
  flex-grow: 1;
}
</style>
<style lang="scss" scoped>
.el-menu-vertical {
  background-color: var(--bg-background-color);
  :deep(.el-sub-menu__title:hover) {
    background-color: var(--border-box-color);
  }

  :deep(.el-menu-item:hover) {
    background-color: var(--border-box-color);
  }
}

.el-container.is-vertical {
  flex-direction: row;
}
.el-icon-menu {
  width: 20px;
  height: 20px;
  margin-left: 15px;
  cursor: pointer;
}

.icon-logo {
  width: 30px;
  height: 30px;
  padding: 10px;
}

.icon-logo svg {
  width: 30px;
  height: 30px;
}

.el-main {
  padding: 0;
}

.el-menu-vertical {
  height: auto;
  border-right: solid 1px var(--content-color);
  flex-grow: 1;
}

.aside {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: #edf0fc solid 1px;
}

.common-layout-main {
  width: 100vw;
  height: 100vh;
  .mobile {
    display: none;
  }
  .el-main {
    background-color: var(--bg-background-color);
  }
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.header {
  background-color: var(--bg-brand-color);
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-box-color);
  .head-t {
    width: 100px;
  }
  .head-title {
    font-size: 16px;
    color: var(--text-color);
    font-weight: bold;
  }
  .head-f {
    width: 100px;
  }
}

.top-menu {
  height: auto;
}

.top-title {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  display: flex;
  font-weight: bold;
  font-size: 18px;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-background-color);
  color: var(--text-color);
}

.head-f {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-icon {
  height: auto;
  width: auto;
}

.tab-main {
  height: calc(100vh - 94px);
  overflow: auto;
}

.el-main {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.exit {
  cursor: pointer;
}

.menu-title {
  margin-left: 10px;
}
.el-dropdown-link {
  color: var(--text-color);
  display: flex;
  align-items: center;
  margin-right: 20px;
}
.theme-icon-title {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
.theme-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

// 媒体查询
@media (max-width: 800px) {
  .el-container.is-vertical {
    flex-direction: column;
  }
  .common-layout-main {
    height: 100vh;

    .header {
      display: flex;
    }
    .pc {
      display: none;
    }
    .mobile {
      display: block;
    }
    .header-mobile {
      display: flex;
    }

    .el-main {
      height: calc(100vh - 120px);
    }
    :deep(.el-footer) {
      padding: 0;
      height: 50px;
    }
    .footer-main {
      border-top: solid 1px var(--border-box-color);
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: var(--bg-background-color);
      color: var(--text-color);
      height: calc(100% - 1px);

      .footer-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin: 0 10px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: var(--bg-brand-color);
        }
        span {
          padding-top: 5px;
          font-size: 12px;
          color: var(--text-color);
        }
      }
    }
  }
}
</style>
