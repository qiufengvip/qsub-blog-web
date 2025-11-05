<template>
  <el-container>
    <!-- 顶部导航  -->
    <menu-board></menu-board>
    <el-main>
      <!--主体-->
      <div class="body">
        <!-- 背景虚化渲染-->
        <svg width="100%" height="100%" style="opacity: 1" class="background-svg">
          <radialGradient id="background-gradient" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color: #00b3ff"></stop>
            <stop offset="100%" style="stop-color: #1c1c21"></stop>
          </radialGradient>
          <rect width="100%" height="100%" opacity=".1" fill="url(#background-gradient)"></rect>
        </svg>
        <div class="main">
          <slot>请返回主页</slot>
        </div>
      </div>
      <!--底部 版权数据 -->
      <Copyright></Copyright>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
// 底部版权
import Copyright from '@/components/blog/Copyright.vue';
// 顶部菜单栏
import MenuBoard from '@/components/blog/MenuBoard.vue';
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0 !important;
  .body {
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    width: 100%;
    min-height: calc(100vh - 300px);
    background: var(--bg-background-color);
    .background-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
</style>

<style lang="scss" scoped></style>
