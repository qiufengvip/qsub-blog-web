<template>
  <MdEditor v-model="text" :theme="mode" style="height: 100%" :toolbars-exclude="['github']" @onChange="updateValue" @onSave="save" @onUploadImg="uploadImage" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { defineProps, defineEmits } from 'vue';
import { useColorMode } from '@vueuse/core';
import { ElNotification } from 'element-plus';
import { uploadFile } from '@/http/interface/api';

const mode: any = useColorMode({
  attribute: 'class',
  modes: {
    // custom colors
    dark: 'dark',
    light: 'light',
  },
});
// 回调父组件
const save = () => {
  emit('saved');
};
// 定义接收的 prop 和 emit 事件
const props = defineProps<{
  modelValue: string;
}>();
const text = ref('');
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'saved'): void;
}>();

// 更新值的函数
const updateValue = (value: string) => {
  emit('update:modelValue', value);
};
const uploadImage = async (files: any[], callback: Function) => {
  // callback: (urls: string[] | { url: string; alt: string; title: string }[])
  ElNotification({
    title: '上传提示',
    message: '正在快马加鞭，努力上传中...',
    type: 'success',
  });
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        let name = file.name;
        form.append('file', file);
        uploadFile(form)
          .then((res) =>
            rev({
              alt: name,
              title: name,
              url: res,
            })
          )
          .catch((error) => rej(error));
      });
    })
  );
  console.log(res);
  // 回调
  callback(res);
};
// 监听
watch(
  () => props.modelValue,
  async () => {
    text.value = props.modelValue;
  }
);
</script>

<style scoped lang="scss">
:deep(ol) {
  list-style: disc !important;
}
:deep(li) {
  list-style: disc !important;
}
</style>
