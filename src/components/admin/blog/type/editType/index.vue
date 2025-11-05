<template>
  <el-dialog v-model="model" :title="title" width="500px" @close="canceled">
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px">
      <div>
        <el-form-item label="分类名称" prop="typeName">
          <el-input v-model="form.typeName" />
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="canceled">取消</el-button>
        <el-button type="primary" @click="save">添加</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { ElMessage, FormRules } from 'element-plus';
import { detail, saveOrUpdate } from '@/http/interface/blog/type';

const emits = defineEmits(['saved', 'canceled']);

const title = ref('');

const model = ref(false);

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  id: {
    type: [Number, String],
    default: '',
  },
  resourceId: {
    type: Number,
    default: 0,
  },
});
const form = ref<any>({
  taskName: '',
});

const rules = reactive<FormRules>({
  typeName: [
    {
      required: true,
      message: '类型名称不能为空',
      trigger: 'blur',
    },
  ],
});
const save = () => {
  form.value.resourceId = props.resourceId;
  saveOrUpdate(form.value).then((res) => {
    if (props.id) {
      ElMessage.success('修改成功');
    } else {
      ElMessage.success('添加成功');
    }
    model.value = false;
  });
  emits('saved');
};
const canceled = () => {
  model.value = false;
  emits('canceled');
};

watch(
  () => props.show,
  async () => {
    if (props.show) {
      model.value = true;
      form.value = {};
      if (props.id) {
        // 修改
        title.value = '修改分类';
        detail(props.id)
          .then((res) => {
            form.value = res;
          })
          .catch((e) => {
            model.value = false;
            emits('canceled');
          });
      } else {
        // 添加
        title.value = '添加分类';
      }
    }
  }
);
</script>

<style scoped lang="scss"></style>
