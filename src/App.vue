<script setup lang="ts">
import { onMounted, watch } from 'vue';
import DefaultLayout from './layouts/DefaultLayout.vue'
import { useThemeStore } from './stores/theme';
import { useAppConfigStore } from './stores/appConfig';

const themeStore = useThemeStore();
const appConfigStore = useAppConfigStore();

// 更新favicon和元数据
const updateMetadata = () => {
  const { config } = appConfigStore;

  // 更新页面标题
  document.title = config.APP_TITLE || config.APP_NAME;

  // 更新favicon链接 - 强制使用config.js中的APP_ICON
  if (config.APP_ICON) {
    // 获取所有现有favicon链接
    const oldFavicons = document.querySelectorAll("link[rel*='icon']");
    // 如果存在，移除它们
    oldFavicons.forEach(link => {
      document.head.removeChild(link);
    });

    // 创建新的favicon链接
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = config.APP_ICON;
    document.head.appendChild(link);

    console.log('Favicon updated from config.js:', config.APP_ICON);
  }

  // 更新元数据 - 描述
  let metaDescription = document.querySelector("meta[name='description']");
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    (metaDescription as HTMLMetaElement).name = 'description';
    document.head.appendChild(metaDescription);
  }
  (metaDescription as HTMLMetaElement).content = config.APP_DESCRIPTION;

  // 更新元数据 - 关键词
  let metaKeywords = document.querySelector("meta[name='keywords']");
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    (metaKeywords as HTMLMetaElement).name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  (metaKeywords as HTMLMetaElement).content = config.APP_KEYWORDS;
};

// 立即加载配置并设置favicon
const initConfig = async () => {
  // 应用启动时初始化主题
  themeStore.initTheme();

  try {
    // 1. 强制同步加载配置
    await appConfigStore.loadConfig();
    // 2. 立即更新元数据和favicon
    updateMetadata();
  } catch (error) {
    console.error('Failed to load config:', error);
  }
};

// 应用挂载时立即初始化配置
onMounted(() => {
  console.log('App mounted, initializing config and favicon...');
  initConfig();
});

// 当配置更新时，更新元数据和favicon
watch(() => appConfigStore.config, updateMetadata, { deep: true });
</script>

<template>
  <DefaultLayout>
    <router-view />
  </DefaultLayout>
</template>

<style>
</style>
