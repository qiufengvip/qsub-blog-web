<template>
  <!--  新增文章  -->
  <div v-loading="loading" class="postAdd">
    <el-card class="box-card">
      <div class="post-card-content">
        <el-form class="mobile-operate">
          <el-button type="primary" :loading="saveLoading" size="small" @click="staging">存草稿</el-button>
          <el-button type="success" :loading="saveLoading" size="small" @click="submits">发布</el-button>
        </el-form>
        <div class="post-property">
          <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="100px" status-icon>
            <el-form-item label="文章标题" prop="title" label-position="left">
              <el-input v-model="form.title" show-word-limit />
            </el-form-item>
            <el-form-item label="文章分类" prop="resourceId" label-position="left">
              <el-cascader :key="subtotalKey" v-model="form.resourceId" style="width: 100%" :options="postTypeTree" :props="props1" filterable placeholder="请选择分类" />
            </el-form-item>
            <el-form-item label="发布状态" label-position="left">
              <el-select v-model="form.state" disabled placeholder="文章状态">
                <el-option v-for="i in postStateList" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态" label-position="left">
              <el-select v-model="form.releases" disabled placeholder="审核状态">
                <el-option v-for="i in postReleaseList" :label="i.label" :value="i.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="简述" prop="subtitle" label-position="left">
              <el-input v-model="form.subtitle" rows="4" show-word-limit type="textarea" />
            </el-form-item>
          </el-form>
        </div>

        <div class="post-property">
          <el-form :inline="true" class="qsub-form-sub" label-width="100px">
            <el-form-item v-loading="uploadLoading" label="缩略图" label-position="left">
              <el-upload
                :auto-upload="true"
                :before-upload="beforeAvatarUpload"
                :file-list="postImg"
                :limit="1"
                accept="image/jpeg, image/png, image/gif"
                :on-success="handleAvatarSuccess"
                :show-file-list="false"
                action="#"
                class="avatar-uploader"
              >
                <template v-if="form.postImg">
                  <img :src="form.postImg" alt="" class="el-upload-list__item-thumbnail avatar" />
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlepostImg(form.postImg, 1)">
                      <el-icon><ZoomIn /></el-icon>
                    </span>
                    <span class="el-upload-list__item-preview" @click="handlepostImg(form.postImg, 2)">
                      <el-icon><Download /></el-icon>
                    </span>
                    <span class="el-upload-list__item-preview" @click="handlepostImg(form.postImg, 3)">
                      <el-icon><Delete /></el-icon>
                    </span>
                  </span>
                </template>

                <template #trigger>
                  <template v-if="!form.postImg">
                    <el-icon class="avatar-uploader-icon">
                      <Plus />
                    </el-icon>
                  </template>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item class="pc-operate" style="margin-right: 0" label-position="left">
              <!-- 设置在 文件状态为发布的时候-不显示存草稿功能-->
              <el-button type="primary" :loading="saveLoading" @click="staging">存草稿</el-button>
              <el-button type="success" :loading="saveLoading" @click="submits">发布</el-button>
            </el-form-item>
          </el-form>

          <el-form :rules="rules" label-width="100px">
            <el-form-item label="文章标签" prop="labelIdList" label-position="left">
              <div class="labels">
                <el-tag v-for="item in form.labelIdList" :key="item" class="labels-item" :disable-transitions="false" :type="getType(item)" closable @close="handleClose(item)">
                  {{ getTagNameByLabelId(item) }}
                </el-tag>

                <el-select
                  v-if="labelsInputVisible"
                  ref="labelsInputRef"
                  v-model="labelsInputValue"
                  filterable
                  placeholder="选择或新建标签"
                  style="width: 240px"
                  @blur="handleInputConfirm(false)"
                  @keyup.enter="handleInputConfirm(true)"
                >
                  <el-option v-for="item in labelList" :key="item.id" :label="item.name" :value="item.id" />
                  <template #footer>
                    <div class="label-edit">
                      <el-input v-model="optionName" class="option-input" placeholder="输入新标签" size="small" />
                      <el-button :loading="addLabelLoading" type="primary" :icon="Plus" size="small" style="margin-left: 5px" @click="addLabel"> 添加 </el-button>
                    </div>
                  </template>
                </el-select>
                <el-button v-else class="button-new-tag ml-1" size="small" type="success" @click="showInput"> + 添加标签 </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <markdown-editor v-model="form.content" @saved="staging"></markdown-editor>
    <!--    图片预览组件-->
    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="图片" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { CheckboxValueType, ElMessage, ElMessageBox, ElNotification, FormRules } from 'element-plus';
import { onActivated, onMounted, reactive, ref } from 'vue';
import { selectConstantData, uploadFile } from '@/http/interface/api';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons';
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute } from 'vue-router';
import { detail, saveOrUpdate } from '@/http/interface/blog/psot';
import { BlogPost, BlogPostReleasesEnum, BlogPostStateEnum } from '@/utils/interface/post';
import store from '@/store';
import router from '@/router';
import { getLabelList, saveOrUpdate as saveOrUpdateLabel } from '@/http/interface/blog/PostLabel';
import { getTree } from '@/http/interface/blog/type';
import { ApplicationError } from '@/utils/error';
import MarkdownEditor from '@/components/common/MarkdownEditor/index.vue';
const loading = ref(false);
const saveLoading = ref(false);
const route = useRoute();
// const postId: any = route.query.id;
const ruleFormRef = ref<any>();
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const props1 = ref({
  value: 'id',
  label: 'serverName',
  checkStrictly: true,
  emitPath: false,
});
// 添加标签的ref
const labelsInputRef = ref();
// 标签列表
const labelList = ref<any[]>([]);
// 标签选择值
const labelsInputValue = ref();
// 标签选择器的可见性
const labelsInputVisible = ref(false);
const postStateList = ref([]); //文章审核状态
const postReleaseList = ref([]); //文章发布状态
const getLabelListData = () => {
  getLabelList({ pageSize: 2147483647, pageNum: 1 }).then((res: any) => {
    labelList.value = res.list;
  });
};

const form = ref<BlogPost>({
  id: '', //文章id
  title: '', //文章标题
  postImg: '', //缩略图
  resourceId: '', //栏目id
  state: BlogPostStateEnum.DRAFT, //发布状态
  releases: BlogPostReleasesEnum.WAIT_SUBMIT, //审核状态
  subtitle: '', //文章副标题
  content: '', //主体内容
  labelIdList: [], //标签
  auditLogging: '',
});
const rules = reactive<FormRules>({
  title: [
    {
      required: true,
      message: '请填写文章标题',
      trigger: 'change',
    },
  ],
  resourceId: [
    {
      required: true,
      message: '请填写文章分类',
      trigger: 'change',
    },
  ],
  subtitle: [
    {
      required: true,
      message: '请填写文章副标题',
      trigger: 'change',
    },
  ],
  labelIdList: [
    {
      required: true,
      message: '请选择文章标签',
    },
  ],
});

const subtotalKey = ref(-5); //key
const postImg = ref([]);

const model = ref(1); //默认是一 加载缓存库中最新的数据
const tabsId = ref('f8a013b9ae1d4615b047fcf0550e8a71'); //本页面的id
const interval = ref();
// 文章分类tree
const postTypeTree = ref<any[]>([]);
onBeforeRouteUpdate(() => {
  // 当路由路径变化
  console.log('onBeforeRouteUpdate');
});
onBeforeRouteLeave(() => {
  // 当离开当前路由
  console.log('onBeforeRouteLeave');
});
//
const postId = route.params.id as string;

onMounted(() => {
  console.log(postId);
  // 获取文章发布状态
  selectConstantData({ code: 'postRelease' }).then((data: any) => {
    postReleaseList.value = data;
  });
  // 文章审核状态
  selectConstantData({ code: 'postState' }).then((data: any) => {
    postStateList.value = data;
  });
  // 文章分类
  getTree().then((res: any) => (postTypeTree.value = res));
  getLabelListData();
  // 初始化
  init();
});
onActivated(() => {
  console.log(postId);
});

const automatically = () => {
  console.log('新建文章关闭自动保存方法');
  if (interval.value) {
    clearInterval(interval.value);
  }
};
/**
 * 初始值
 */
const init = async () => {
  loading.value = true;
  try {
    let res: BlogPost = await detail(postId);

    if (res.releases == BlogPostReleasesEnum.AUDIT_NOT_PASS) {
      ElNotification({
        title: '文章状态',
        message: '本文章审核未通过：' + res.auditLogging,
        type: 'error',
      });
    }
    console.log(res);
    if (!res.content) {
      res.content = '';
    }
    form.value = res;
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

const submits = () => {
  ruleFormRef.value.validate((valid: any) => {
    if (!valid) {
      ElMessage.error('请填写必填项');
      throw new ApplicationError('请填写必填项');
    }
    // 如果当前是发布状态
    if (form.value.state == BlogPostStateEnum.RELEASE) {
      ElMessageBox.confirm('当前文章状态为发布状态如果选择重新发布,需要重新审核后才会显示。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        save(true);
      });
    } else {
      // 未通过状态
      if (form.value.releases == BlogPostReleasesEnum.AUDIT_NOT_PASS) {
        ElMessageBox.confirm('确定要重新审核并发布吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          save(true);
        });
      } else if (form.value.releases == BlogPostReleasesEnum.WAIT_SUBMIT) {
        // 等待提交状态
        ElMessageBox.confirm('确定要审核并发布吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          save(true);
        });
      } else {
        save(true);
      }
    }
  });
};
const getType = (id: any) => {
  // 将整数映射到 1, 2, 3, 4
  let number = (id % 4) + 1;
  switch (number) {
    case 1:
      return '';
    case 2:
      return 'success';
    case 3:
      return 'warning';
    default:
      return 'danger';
  }
};
/**
 * 从form.labelIdList 中删除指定id
 * @param tag
 */
const handleClose = (tag: any) => {
  form.value.labelIdList = form.value.labelIdList.filter((o) => o != tag);
};
/**
 * 根据label的id 查询label的名称
 */
const getTagNameByLabelId = (labelId: number) => {
  let find = labelList.value.find((o) => o.id === labelId);
  if (find) {
    return find.name;
  } else {
    return '未找到label';
  }
};
const isAdding = ref(false);
const value = ref<CheckboxValueType[]>([]);
const optionName = ref('');
const addLabelLoading = ref(false);
//添加label
const addLabel = () => {
  if (optionName.value) {
    addLabelLoading.value = true;
    saveOrUpdateLabel({ name: optionName.value })
      .then((res) => {
        optionName.value = '';
        addLabelLoading.value = false;
        getLabelListData();
      })
      .catch((e) => {
        addLabelLoading.value = false;
      });
  }
};

const showInput = () => {
  labelsInputVisible.value = true;
};
//标签添加成功或失败
const handleInputConfirm = (type: boolean) => {
  // 'labelsInputValue', 'labels', 'labelsInputVisible'
  if (type) {
    console.log('free');
  } else {
    console.log('取消');
    if (labelsInputValue.value) {
      // 如果选择了标签则 加入到标签集合中
      let labelId = form.value.labelIdList.find((o) => o == labelsInputValue.value);
      if (!labelId) {
        form.value.labelIdList.push(labelsInputValue.value);
      }
    }
    labelsInputVisible.value = false;
  }
  labelsInputValue.value = '';
};
//缩略图上传
const handleAvatarSuccess = () => {
  //response: any, uploadFile: any
  document.getElementsByClassName('el-upload')[0].style.display = 'none';
  console.log('成功');
};
//缩略图格式验证器
const uploadLoading = ref(false);
const beforeAvatarUpload = (rawFile: any) => {
  console.log(rawFile.type.slice(0, 6));
  if (rawFile.type.slice(0, 6) !== 'image/') {
    ElMessage.error('应上传图片');
  } else if (rawFile.size / 1024 / 1024 > 20) {
    ElMessage.error('不能大于 20MB!');
  }
  const params = new FormData();
  // @ts-ignore
  params.append('file', rawFile);
  uploadLoading.value = true;
  uploadFile(params)
    .then((data: any) => {
      console.log(data);
      form.value.postImg = data;
      handleAvatarSuccess();
      uploadLoading.value = false;
    })
    .catch((e) => {
      uploadLoading.value = false;
    });
  return false;
};

const handlepostImg = (fileUrl: string, index: number) => {
  switch (index) {
    case 1:
      dialogVisible.value = true;
      dialogImageUrl.value = fileUrl;
      break;
    case 2:
      open(fileUrl);
      break;
    case 3:
      form.value.postImg = '';
      document.getElementsByClassName('el-upload')[0].style.display = 'block';
      break;
  }
  console.log('点击', index);
};

/**
 * 暂存按钮
 */
const staging = () => {
  if (form.value.state == BlogPostStateEnum.RELEASE) {
    ElMessageBox.confirm('当前文章状态为发布状态如果选择暂存,会取消发布状态。', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      save(false);
    });
  } else {
    save(false);
  }
};

const save = (release: boolean = true) => {
  if (form.value.id) {
    saveLoading.value = true;
    let state = form.value.state;
    if (release) {
      form.value.state = BlogPostStateEnum.RELEASE;
    } else {
      form.value.state = BlogPostStateEnum.DRAFT;
    }
    saveOrUpdate(form.value)
      .then((res: any) => {
        form.value = res;
        ElMessage.success(!release ? '暂存成功' : '发布成功');
        if (release) {
          // 如果是发布则关闭当前窗口
          closeView();
        }
        saveLoading.value = false;
      })
      .catch((e) => {
        // 恢复
        form.value.state = state;
        saveLoading.value = false;
      });
  } else {
    ElMessage.error('文章不存在');
  }
};

const closeView = () => {
  store.dispatch('tagsView/delView', route).then(({ visitedViews }) => {
    const latestView = visitedViews.slice(-1)[0];
    if (latestView) {
      router.push(latestView.fullPath);
    } else {
      router.push('/');
    }
  });
};
</script>
<style lang="scss">
.post-card-content {
  display: flex;
  width: 100%;
}

.el-dialog__body {
  img {
    width: 100%;
  }
}

.postAdd {
  height: 100%;
}

.tagInput {
  width: 150px;
}

.avatar-uploader .el-upload {
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader {
  border-radius: 6px;
  width: 150px;
  height: 150px;
}
</style>

<style lang="scss" scoped>
.qsub-form {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.qsub-form-item {
  display: flex;
}

.qsub-form-label {
  text-align: right;
  font-size: var(--el-form-label-font-size);
  color: var(--el-text-color-regular);
  line-height: 34px;
  width: 90px;
  padding: 0 22px 0 0;
  box-sizing: border-box;
  font-size: 15px;
}

.avatar-uploader .avatar {
  display: block;
}

.el-upload-list__item-actions {
  border-radius: 6px;
  display: none;
  background-color: #00000085;
  width: 150px;
  height: 150px;
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  align-items: center;
  justify-content: space-evenly;
}
.el-form-item__content {
  position: relative;
}
.avatar {
  border-radius: 6px;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.qsub-form-sub {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.box-card {
  margin: 10px;
}

.avatar-uploader:hover {
  .el-upload-list__item-actions {
    display: flex;
  }
}

.post-property {
  width: 50%;
}
.labels {
  .labels-item {
    margin-right: 10px;
  }
}
.label-edit {
  display: flex;
}
.mobile-operate {
  display: none;
}

// 媒体查询
@media (max-width: 800px) {
  .pc-operate {
    display: none;
  }
  .mobile-operate {
    display: flex;
    justify-content: flex-end;
  }
  .post-card-content {
    flex-direction: column-reverse;
  }
  .post-property {
    width: 100%;
  }
}
</style>
