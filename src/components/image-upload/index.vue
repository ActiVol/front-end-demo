<template>
  <div class="component-upload-image">
    <!-- El-Upload 组件 -->
    <el-upload
      ref="imageUploadRef"
      :action="uploadImgUrl"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :before-remove="handleBeforeRemove"
      :on-preview="handlePictureCardPreview"
      :limit="limit"
      :file-list="fileList"
      :headers="headers"
      :class="{ hide: fileList.length >= limit }"
      multiple
    >
      <el-icon class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType.length">
        格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
      </template>
      的文件
    </div>

    <!-- 图片预览 Dialog -->
    <el-dialog v-model="dialogVisible" title="预览" width="800px" append-to-body>
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { getToken } from '@/utils/auth';

// ----------------------- Props 定义 -----------------------
const props = defineProps({
  // ✅ 支持传入字符串或数组
  modelValue: {
    type: [Array, String],
    default: () => []
  },
  limit: {
    type: Number,
    default: 5
  },
  fileSize: {
    type: Number,
    default: 5
  },
  fileType: {
    type: Array,
    default: () => ['png', 'jpg', 'jpeg']
  },
  isShowTip: {
    type: Boolean,
    default: true
  },
  // ✅ 新增：控制返回类型
  returnType: {
    type: String,
    validator: (value) => ['array', 'string'].includes(value),
    default: 'string' // 默认返回字符串，兼容后端
  }
});

// ----------------------- Emits 定义 -----------------------
const emit = defineEmits(['update:modelValue']);

// ----------------------- 响应式数据 -----------------------
const uploadImgUrl = ref('http://115.215.67.147:8848/volunteer/common/upload');
const headers = ref({ Authorization: 'Bearer ' + getToken() });

const fileList = ref([]);
const uploadList = ref([]);
const uploadCount = ref(0);
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const imageUploadRef = ref(null);

// 是否显示提示
const showTip = computed(() => {
  return props.isShowTip && (props.fileType.length > 0 || props.fileSize);
});

// 保存 Loading 服务实例
let loadingInstance = null;

// ----------------------- Watch 监听 -----------------------
// ✅ 监听 modelValue，支持字符串或数组
watch(
  () => props.modelValue,
  (newVal) => {
    let urls = [];
    if (Array.isArray(newVal)) {
      urls = newVal;
    } else if (typeof newVal === 'string' && newVal) {
      urls = newVal.split(',').filter(url => url.trim()); // 按逗号分割，过滤空项
    }

    fileList.value = urls.map(url => {
      const displayUrl = url.startsWith('http') ? url : '你的基础域名' + url;
      return { name: displayUrl, url: displayUrl };
    });
  },
  { immediate: true, deep: true }
);

// ----------------------- 方法 -----------------------
function handleBeforeUpload(file) {
  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // 文件类型校验
  if (props.fileType.length > 0) {
    const isAllowed = props.fileType.some(type => {
      const lowerType = type.toLowerCase();
      return fileType.includes(lowerType) || fileName.endsWith('.' + lowerType);
    });
    if (!isAllowed) {
      ElMessage.error(`文件格式不正确，请上传 ${props.fileType.join('/')} 格式图片！`);
      return false;
    }
  }

  // 文件名不能包含逗号
  if (fileName.includes(',')) {
    ElMessage.error('文件名不能包含英文逗号 (,)！');
    return false;
  }

  // 文件大小校验
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize;
    if (!isLt) {
      ElMessage.error(`上传图片大小不能超过 ${props.fileSize} MB！`);
      return false;
    }
  }

  // 显示加载
  loadingInstance = ElLoading.service({
    lock: true,
    text: '正在上传图片，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  uploadCount.value++;
  return true;
}

function handleExceed() {
  ElMessage.error(`上传图片数量不能超过 ${props.limit} 张！`);
}

function handleUploadSuccess(res, file) {
  if (res.code === 200 && res.url) {
    uploadList.value.push({ name: res.url, url: res.url });
  } else {
    const msg = res.msg || '上传失败，服务器无响应';
    ElMessage.error(msg);
    imageUploadRef.value?.handleRemove(file);
  }
  uploadedSuccessfully();
}

function uploadedSuccessfully() {
  if (uploadCount.value > 0 && uploadList.value.length >= uploadCount.value) {
    const newFileList = [...fileList.value, ...uploadList.value];
    fileList.value = newFileList;

    // ✅ 根据 returnType 决定 emit 的值
    const urlArray = newFileList.map(item => item.url);
    const emitValue = props.returnType === 'string' ? urlArray.join(',') : urlArray;

    emit('update:modelValue', emitValue);

    // 重置
    uploadList.value = [];
    uploadCount.value = 0;
    if (loadingInstance) {
      loadingInstance.close();
      loadingInstance = null;
    }
  }
}

function handleUploadError() {
  ElMessage.error('上传图片失败');
  if (loadingInstance) {
    loadingInstance.close();
    loadingInstance = null;
  }
}

async function handleBeforeRemove(file, uploadFileList) {
  try {
    await ElMessageBox.confirm(
      '确定要删除这张图片吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    ElMessage.success('已删除');
    return true;
  } catch {
    ElMessage.info('已取消删除');
    return false;
  }
}

// 监听 fileList 变化以同步数据
watch(
  () => fileList.value,
  (newFileList) => {
    if (uploadCount.value === 0) {
      const urlArray = newFileList.map(item => item.url);
      const emitValue = props.returnType === 'string' ? urlArray.join(',') : urlArray;
      emit('update:modelValue', emitValue);
    }
  }
);

function handlePictureCardPreview(file) {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
}
</script>

<style scoped>
:deep(.hide .el-upload--picture-card) {
  display: none;
}

:deep(.avatar-uploader-icon) {
  font-size: 28px;
  color: #8c939d;
}
</style>