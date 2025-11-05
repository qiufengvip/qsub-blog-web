<template>
  <svg aria-hidden="true" :class="props.class" :style="'fill: ' + color + ';color:' + color + ';'">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const symbolId = ref('');
const props = defineProps({
  // 使用的svg图标名称，也就是svg文件名
  name: {
    type: String,
    required: true, //是否必须
    default: 'icon',
  },
  class: {
    type: String,
    default: 'svg-icon',
  },
  prefix: {
    type: String,
    default: 'icon',
  },
  color: {
    type: String,
    default: 'var(--el-text-color-primary)',
  },
});
onMounted(() => {
  symbolId.value = `#${props.prefix}-${props.name}`;
});
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 16px;
  height: 16px;
  margin-right: 3px;
  color: currentColor;
  fill: currentColor;
}
</style>
