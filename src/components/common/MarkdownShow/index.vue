<template>
  <MdPreview editorId="preview" :theme="mode" :modelValue="text" />
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { useColorMode } from '@vueuse/core';
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
const mode = useColorMode({
  attribute: 'class',
  modes: {
    // custom colors
    dark: 'dark',
    light: 'light',
  },
});
</script>

<style scoped lang="scss">
.md-editor-dark {
  --md-bk-color: var(--bg-brand-color) !important;
}
.md-editor {
  position: static;
  display: grid;
}
:deep(div.default-theme img) {
  border-radius: 15px;
}
@media screen and (max-width: 768px) {
  :deep(.md-editor-preview-wrapper) {
    padding: 0 !important;
  }
}
:deep(ol) {
  list-style: disc !important;
}
:deep(li) {
  list-style: disc !important;
}
</style>
