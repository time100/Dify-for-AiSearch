<template>
  <div class="h-full flex flex-col mt-16">

    <a-card title="隐私政策">
      <template #extra>
        最后更新：{{ lastUpdated }}
      </template>
      <div class="overflow-auto h-[calc(100vh-200px)]">

        <MdPreview :modelValue="policyContent" codeTheme="a11y" :theme="mdPreviewTheme" previewTheme="cyanosis" />

      </div>
    </a-card>
    <div class="flex-shrink-0 my-4">
      <Footer />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const policyContent = ref('');
const lastUpdated = ref('');

onMounted(async () => {
  try {
    const response = await fetch('/data/PrivacyPolicy.json');
    const data = await response.json();
    policyContent.value = data.content.content;
    lastUpdated.value = data.content.lastUpdated || '';
  } catch (error) {
    console.error('加载隐私政策失败:', error);
  }

});

// 计算属性：根据主题设置动态计算 MdPreview 的主题
const mdPreviewTheme = computed(() => themeStore.isDark ? 'dark' : 'light');

import { useThemeStore } from '../stores/theme';
const themeStore = useThemeStore();

import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';



</script>

<style scoped lang="less"></style>
