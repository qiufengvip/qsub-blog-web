<template>
  <div class="search">
    <el-dialog v-model="dialogVisible" title="搜索一下" draggable overflow @close="close">
      <el-input v-model="word">
        <template #append>
          <el-button :icon="Search" @click="openSearch(word)" />
        </template>
      </el-input>
      <div></div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Search } from '@element-plus/icons';
import { openSearch } from '@/utils/openPage';

const word = ref<string>('');
const dialogVisible = ref(true);
const emit = defineEmits(['exit']);
const close = () => {
  emit('exit');
  dialogVisible.value = false;
};
onMounted(() => {
  dialogVisible.value = true;
});
</script>

<style scoped lang="scss">
.search {
  :deep(.el-dialog) {
    max-width: 1000px;
    min-width: 100px;
  }
}
@media screen and (max-width: 800px) {
  .search {
    :deep(.el-dialog) {
      width: 80%;
    }
  }
}
</style>
