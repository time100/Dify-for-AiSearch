<template>
  <div class="flex w-full h-full flex-col">


    <div class="flex-grow items-center justify-center flex flex-col">
      <div class="text-center mb-10">
        <img class="text-4xl mb-2 max-w-xs sm:max-w-sm md:max-w-md mx-auto" :src="appConfig.config.APP_LOGO" />
        <p class="text-color font-medium text-lg">{{ appConfig.config.APP_TIP }}</p>
      </div>

      <div class="w-full max-w-3xl search-box rounded-xl">
        <div>

          <div class="flex flex-col w-full p-2">
            <!-- 文件上传组件 -->

            <div class="relative">
              <a-textarea allow-clear v-model="query" @keydown.enter="handleKeyDown" :placeholder="currentPlaceholder"
                :auto-size="{
                  minRows: 2,
                  maxRows: 5
                }" />
            </div>

            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center space-x-2">
                <!-- 下拉菜单 -->
                <a-select v-model="selectedSearchType" size="medium">
                  <a-option v-for="option in searchOptions" :key="option.value" :value="option.value">{{ option.label
                    }}</a-option>
                </a-select>
                <!-- 按钮布局 -->
                <!-- <a-space>
                  <a-button v-for="option in searchOptions" :key="option.value"
                    :type="selectedSearchType === option.value ? 'primary' : 'outline'"
                    @click="selectSearchType(option.value)">
                    {{ option.label }}
                  </a-button>
                </a-space> -->
              </div>
              <div class="flex items-center space-x-2">
                <!-- 语音状态指示器 -->
                <div v-if="isRecording" class="voice-indicator">
                  <div class="voice-wave">
                    <div v-for="n in 4" :key="n" class="wave-bar"></div>
                  </div>
                  <span class="recording-text">正在聆听...</span>
                </div>

                <!-- 语音输入按钮 -->
                <a-button class="voice-btn" :status="isRecording ? 'danger' : 'normal'" @click="toggleVoiceInput">
                  <template #icon>
                    <icon-sound v-if="!isRecording" />
                    <icon-pause v-else />
                  </template>
                </a-button>

                <!-- 文件上传按钮 -->
                <a-button class="file-btn" :type="showFileUploader ? 'primary' : 'secondary'"
                  @click="toggleFileUploader">
                  <template #icon>
                    <icon-attachment />
                  </template>
                </a-button>

                <a-button @click="handleSearch" type="primary">
                  <template #icon>
                    <icon-send />
                  </template>
                </a-button>
              </div>
            </div>

            <FileUploader v-if="showFileUploader" :userId="userId" @file-uploaded="handleFileUploaded"
              @file-removed="handleFileRemoved" @error="handleUploadError" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex-shrink-0 mb-4 text-center">
      <div class="my-2">
        <a class="mx-2 cursor-pointer hover:text-primary" @click="navigateTo('/about')">关于</a>
        <a class="mx-2 cursor-pointer hover:text-primary" @click="navigateTo('/privacy')">隐私政策</a>
        <a class="mx-2 cursor-pointer hover:text-primary" @click="navigateTo('/agreement')">服务协议</a>
      </div>
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, onMounted, onBeforeUnmount } from 'vue';

import Footer from '../layout/Footer.vue';
import FileUploader from "../upload/FileUploader.vue";

import { useAppConfigStore } from "../../stores/appConfig";
import IatRecorder from "../../assets/js/IatRecorder.js";
import { type SearchOption } from "@/api/search";
import { getUserId } from "@/api/search";
import { useRouter } from "vue-router";

// 引入配置
const appConfig = useAppConfigStore();

const emit = defineEmits(['search']);

const query = ref('');
const userId = ref('');
const uploadedFiles = ref<any[]>([]);
const showFileUploader = ref(false);

// 从配置中获取搜索选项
const searchOptions = computed<SearchOption[]>(() => {
  return (appConfig.config.SEARCH_OPTIONS as SearchOption[]) || [];
});

// 设置默认选中的搜索类型
const defaultSearchType = computed(() => {
  const defaultOption = searchOptions.value.find(option => option.default);
  return defaultOption ? defaultOption.value : searchOptions.value.length > 0 ? searchOptions.value[0].value : 'web';
});

const selectedSearchType = ref(defaultSearchType.value);

// 根据选中的搜索类型获取对应的placeholder
const currentPlaceholder = computed(() => {
  const selectedOption = searchOptions.value.find(option => option.value === selectedSearchType.value) as SearchOption;
  return selectedOption?.placeholder || '请输入搜索内容';
});

// 选择搜索类型
const selectSearchType = (type: string) => {
  selectedSearchType.value = type;
};

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  // 如果按下了Shift键，不阻止默认行为，允许换行
  if (event.shiftKey) {
    return;
  }

  // 否则阻止默认行为并触发搜索
  event.preventDefault();
  handleSearch();
};

const handleSearch = () => {
  if (!query.value.trim()) return;

  emit('search', {
    query: query.value,
    type: selectedSearchType.value,
    files: uploadedFiles.value // 添加上传的文件列表
  });

  // 重置文件上传器
  showFileUploader.value = false;
  uploadedFiles.value = [];
};

// 文件上传相关处理
const toggleFileUploader = () => {
  showFileUploader.value = !showFileUploader.value;
};

const handleFileUploaded = (file: any) => {
  uploadedFiles.value.push(file);
  console.log('文件已上传:', file);
};

const handleFileRemoved = (file: any) => {
  uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== file.id);
  console.log('文件已移除:', file);
};

const handleUploadError = (error: string) => {
  console.error('上传错误:', error);
};

// 语音识别相关
const isRecording = ref(false);
const iatRecorder = ref(null);

// 初始化语音识别器
const initIatRecorder = () => {
  if (iatRecorder.value) return;

  // 创建语音识别实例
  iatRecorder.value = new IatRecorder();

  // 设置文本变化的回调
  iatRecorder.value.onTextChange = (text) => {
    query.value = text;
  };

  // 设置状态变化的回调
  iatRecorder.value.onWillStatusChange = (oldStatus, newStatus) => {
    console.log(`语音识别状态从 ${oldStatus} 变为 ${newStatus}`);
    if (newStatus === 'end') {
      isRecording.value = false;
    }
  };
};

// 切换语音输入状态
const toggleVoiceInput = () => {
  if (!iatRecorder.value) {
    initIatRecorder();
  }

  if (isRecording.value) {
    // 停止录音
    iatRecorder.value.stop();
    isRecording.value = false;
  } else {
    // 开始录音
    iatRecorder.value.start();
    isRecording.value = true;
  }
};

// 在组件挂载时初始化语音识别器
onMounted(() => {
  initIatRecorder();
  // 获取用户ID
  userId.value = getUserId();
});

// 在组件卸载前停止语音识别
onBeforeUnmount(() => {
  if (iatRecorder.value && isRecording.value) {
    iatRecorder.value.stop();
  }
});

const router = useRouter();

// 页面跳转方法
const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<style scoped lang="less">
.text-primary {
  color: var(--color-primary, #4080ff);
}

.bg-primary {
  background-color: var(--color-primary, #4080ff);
}

.bg-primary-deep {
  background-color: var(--color-primary-deep, #3070e0);
}

/* 文件上传按钮 */
.file-btn {
  transition: all 0.3s ease;
}

/* 语音录制相关样式 */
.voice-btn {
  transition: all 0.3s ease;
}

.voice-indicator {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  margin-right: 5px;
}

.voice-wave {
  display: flex;
  align-items: flex-end;
  height: 16px;
  margin-right: 8px;
}

.wave-bar {
  width: 3px;
  height: 30%;
  margin: 0 1px;
  background-color: var(--color-primary, #4080ff);
  border-radius: 1px;
  animation: sound-wave 1s ease-in-out infinite;
}

.wave-bar:nth-child(2) {
  animation-delay: 0.2s;
  height: 45%;
}

.wave-bar:nth-child(3) {
  animation-delay: 0.4s;
  height: 75%;
}

.wave-bar:nth-child(4) {
  animation-delay: 0.6s;
  height: 60%;
}

@keyframes sound-wave {
  0% {
    height: 30%;
  }

  50% {
    height: 100%;
  }

  100% {
    height: 30%;
  }
}

.recording-text {
  font-size: 12px;
  color: var(--color-primary, #4080ff);
}
</style>
