<!--网站底部-->
<template>
  <div class="qsub-bottom selected">
    <div class="qsub-bottom-main">
      <div class="qsub-bottom-top">
        <div>{{ getConfigData('inWord') }}</div>
      </div>
      <div class="qsub-bottom-bot">
        <div class="qsub-bottom-bot-slogan" v-text="getConfigData('closingRemarks')"></div>
        <div class="qsub-bottom-bot-info">
          <div class="qsub-bottom-bot-copyright" v-text="getConfigData('copyright')"></div>
          <div class="qsub-bottom-bot-copyright" v-text="getConfigData('internetContent')"></div>
          <div id="siteStats" class="qsub-bottom-bot-copyright"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getConfigData } from '@/utils/dataDispose';
import { onMounted, ref } from 'vue';

onMounted(() => {
  let siteStats: any = document.getElementById('siteStats');
  // 加载外部脚本
  var u = '//tool.tongjiniao.com/pendant/quote?c=b38aa971bbf5132ec2c852fe07cd1b82',
    s = document.createElement('script'),
    r = document.getElementsByTagName('script')[0];
  s.type = 'text/javascript';
  s.setAttribute('charset', 'UTF-8');
  s.setAttribute('crossorigin', 'anonymous');
  s.async = !0;
  s.src = u;
  siteStats.appendChild(s, r);
});
</script>

<style lang="scss" scoped>
:deep(#tongjiniao-tool) {
  padding: 0;

  .tongjiniao-tool-title {
    color: var(--text-sub-color) !important;
  }
  .tongjiniao-tool-title-box {
    color: var(--text-sub-color) !important;
  }
  .tongjiniao-tool-value {
    color: var(--text-sub-color) !important;
  }
}

.qsub-bottom-main {
  width: 1300px;
}

.qsub-bottom {
  background-color: var(--bg-brand-color)-menu;
  display: flex;
  justify-content: center;
  width: 100%;
}

.qsub-bottom-top {
  height: 150px;
  text-align: center;
  line-height: 40px;
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color);
  justify-content: center;
  align-items: center;
  display: flex;
}

.qsub-bottom-bot {
  padding-top: 20px;
  border-top: #dfdfdf 1px solid;
  /*height: 100px;*/
  display: flex;
  flex-direction: column;
  align-items: center;

  .qsub-bottom-bot-info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 8px;
  }
}

.qsub-bottom-bot-slogan {
  font-weight: bold;
  font-size: 18px;
  padding: 30px;
  color: var(--text-color) 2;
}

.qsub-bottom-bot-copyright {
  padding: 5px;
  color: var(--text-color) 2;
}
</style>
