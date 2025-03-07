<template>
  <div class="file-uploader">
    <!-- 文件上传区域 -->
    <div class="upload-zone" :class="{ 'drag-over': isDragOver, 'has-files': uploadedFiles.length > 0 }"
      @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop"
      @click="triggerFileInput">
      <div v-if="!uploadedFiles.length" class="upload-placeholder">
        <icon-upload class="upload-icon" />
        <p>点击或拖拽文件至此处上传</p>
        <p class="text-xs text-gray-500 mt-1">
          支持文档、图片、音频和视频格式, 最大100MB
        </p>
      </div>

      <!-- 上传状态指示器 -->
      <div v-if="uploading" class="uploading-overlay">
        <a-spin />
        <p class="mt-2">上传中...</p>
      </div>

      <!-- 已上传文件列表 -->
      <div v-if="uploadedFiles.length > 0" class="file-list">
        <div v-for="file in uploadedFiles" :key="file.id" class="file-item">
          <!-- 文件类型图标 -->
          <div class="file-type-icon">
            <img :src="getFileIcon(file)" class="w-8 h-8 object-cover mx-2" />
          </div>

          <!-- 文件信息 -->
          <div class="file-info">
            <div class="file-name" :title="file.name">{{ file.name }}</div>
            <div class="file-meta">
              <span>{{ formatFileSize(file.size) }}</span>
              <span>{{ file.extension.toUpperCase() }}</span>
            </div>
          </div>

          <!-- 删除按钮 -->
          <div class="file-actions">
            <a-button type="text" shape="circle" size="mini" @click.stop="removeFile(file)">
              <template #icon>
                <icon-delete />
              </template>
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input type="file" ref="fileInput" style="display: none" @change="handleFileChange" :accept="acceptedFileTypes"
      :multiple="false" />

    <!-- 错误提示 -->
    <a-alert v-if="errorMessage" type="error" :content="errorMessage" class="mt-2" />
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useAppConfigStore } from '../../stores/appConfig';
import { searchAPI } from '../../api/search';

const appConfig = useAppConfigStore();

const props = defineProps<{
  userId: string;
}>();

const emit = defineEmits<{
  (e: 'file-uploaded', file: any): void;
  (e: 'file-removed', file: any): void;
  (e: 'error', message: string): void;
}>();

// 上传状态
const uploading = ref(false);
const isDragOver = ref(false);
const errorMessage = ref('');
const uploadedFiles = ref<any[]>([]);

// 文件输入
const fileInput = ref<HTMLInputElement | null>(null);

// 支持的文件类型
const allowedTypes = {
  // 文档
  document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'md'],
  // 图片
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
  // 音频
  audio: ['mp3', 'wav', 'ogg', 'aac', 'flac'],
  // 视频
  video: ['mp4', 'webm', 'avi', 'mov', 'mkv']
};

// 最大文件大小 (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// 计算接受的文件类型
const acceptedFileTypes = computed(() => {
  const types = [
    ...allowedTypes.document.map(ext => `.${ext}`),
    ...allowedTypes.image.map(ext => `.${ext}`),
    ...allowedTypes.audio.map(ext => `.${ext}`),
    ...allowedTypes.video.map(ext => `.${ext}`)
  ];
  return types.join(',');
});

// 检查文件类型
const isDocumentType = (extension: string) => allowedTypes.document.includes(extension.toLowerCase());
const isImageType = (extension: string) => allowedTypes.image.includes(extension.toLowerCase());
const isAudioType = (extension: string) => allowedTypes.audio.includes(extension.toLowerCase());
const isVideoType = (extension: string) => allowedTypes.video.includes(extension.toLowerCase());

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 处理拖放事件
const handleDragOver = (event: DragEvent) => {
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    uploadFile(files[0]);
  }
};

// 处理文件选择变化
const handleFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    uploadFile(files[0]);
  }
  // 重置input，允许选择相同文件
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// 删除已上传文件
const removeFile = (file: any) => {
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== file.id);
  emit('file-removed', file);
};

// 验证文件
const validateFile = (file: File) => {
  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    errorMessage.value = `文件大小超过限制（最大${MAX_FILE_SIZE / 1024 / 1024}MB）`;
    emit('error', errorMessage.value);
    return false;
  }

  // 检查文件类型
  const fileName = file.name || '';
  let extension = '';
  if (fileName.includes('.')) {
    extension = fileName.split('.').pop()?.toLowerCase() || '';
  } else if (file.type) {
    const mimeExtension = file.type.split('/').pop();
    if (mimeExtension) {
      extension = mimeExtension.toLowerCase();
    }
  }

  // 对部分MIME类型进行特殊处理
  if (extension === 'jpeg') extension = 'jpg';
  if (extension === 'svg+xml') extension = 'svg';
  if (extension.startsWith('vnd.openxmlformats-officedocument.')) {
    if (extension.includes('wordprocessingml')) extension = 'docx';
    if (extension.includes('spreadsheetml')) extension = 'xlsx';
    if (extension.includes('presentationml')) extension = 'pptx';
  }

  const isValidType = [...allowedTypes.document, ...allowedTypes.image, ...allowedTypes.audio, ...allowedTypes.video].includes(extension);

  if (!isValidType) {
    errorMessage.value = '不支持的文件类型' + extension;
    emit('error', errorMessage.value);
    return false;
  }

  // 重置错误
  errorMessage.value = '';
  return true;
};

// 上传文件到服务器
const uploadFile = async (file: File) => {
  if (!validateFile(file)) return;

  uploading.value = true;
  errorMessage.value = '';

  try {
    // 使用searchAPI的uploadFile方法
    const fileData = await searchAPI.uploadFile(file);

    // 添加到已上传文件列表
    uploadedFiles.value.push(fileData);

    // 触发上传成功事件
    emit('file-uploaded', fileData);
    Message.success('文件上传成功');
  } catch (error) {
    console.error('文件上传错误:', error);
    errorMessage.value = error instanceof Error ? error.message : '文件上传失败';
    emit('error', errorMessage.value);
  } finally {
    uploading.value = false;
  }
};

const excelFiles = ['xlsx', 'xls', 'csv'];
const documentFiles = ['docx', 'doc', 'txt', 'rtf'];
const presentationFiles = ['pptx', 'ppt'];
const pdfFiles = ['pdf'];
const markdownFiles = ['md', 'markdown'];
const emailFiles = ['eml', 'msg'];
const otherDocumentFiles = ['html', 'xml', 'epub'];

// 判断文件类型的函数
const getFileIcon = (file) => {
  if (file.type === 'image') {
    return 'https://io.onenov.cn/file/202503071432073.png';
  } else if (pdfFiles.includes(file.extension?.toLowerCase())) {
    return 'https://io.onenov.cn/file/202503071438194.png';
  } else if (excelFiles.includes(file.extension?.toLowerCase())) {
    return 'https://io.onenov.cn/file/202503071444873.png'; // Excel图标
  } else if (documentFiles.includes(file.extension?.toLowerCase())) {
    return 'https://io.onenov.cn/file/202503071444124.png'; // 文档图标
  } else if (presentationFiles.includes(file.extension?.toLowerCase())) {
    return 'https://io.onenov.cn/file/202503071444546.png'; // PPT图标
  } else if (markdownFiles.includes(file.extension?.toLowerCase())) {
    return 'https://io.onenov.cn/file/202503071444575.png'; // Markdown图标
  } else if (otherDocumentFiles.includes(file.extension?.toLowerCase())) {
    return 'https://io.onenov.cn/file/202503071446728.png'; // 其他文档图标
  } else if (file.type === 'video') {
    return 'https://io.onenov.cn/file/202503071435074.png';
  } else if (file.type === 'audio') {
    return 'https://io.onenov.cn/file/202503071436581.png';
  } else {
    return 'https://io.onenov.cn/file/202503071435393.png'; // 默认图标
  }
};
</script>

<style scoped lang="less">
.file-uploader {
  width: 100%;
  margin-top: 12px;
}

.upload-zone {
  width: 100%;
  min-height: 100px;
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background-color: var(--color-secondary);

  &:hover {
    border-color: var(--color-primary, #4080ff);
    background-color: var(--color-secondary-hover);
  }

  &.drag-over {
    border-color: var(--color-primary, #4080ff);
    background-color: var(--color-primary-hover);
  }

  &.has-files {
    padding: 8px;
    justify-content: flex-start;
    min-height: auto;
  }
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

}

.upload-icon {
  font-size: 24px;
  margin-bottom: 8px;

}

.uploading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.file-list {
  width: 100%;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  background-color: var(--color-card);

  &:last-child {
    margin-bottom: 0;
  }
}

.file-type-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin-right: 10px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
}

.file-actions {
  margin-left: 8px;
}
</style>
