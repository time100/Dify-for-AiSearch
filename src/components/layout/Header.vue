<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useThemeStore } from '../../stores/theme';
import { useAppConfigStore } from '../../stores/appConfig';
import { useAppStatusStore } from '../../stores/appStatus';
import { useRouter, useRoute } from 'vue-router';
import SearchHistory from '../search/SearchHistory.vue';

const themeStore = useThemeStore();
const appConfigStore = useAppConfigStore();
const appStatusStore = useAppStatusStore();
const router = useRouter();
const route = useRoute();

// 从配置中获取标题
const logo = computed(() => appConfigStore.config.APP_ICON);
// 根据应用状态动态计算副标题
const subtitle = computed(() => {
  // 如果当前显示搜索结果且有查询内容，显示当前查询
  if (appStatusStore.showResults && appStatusStore.currentQuery) {
    return appStatusStore.currentQuery;
  }
  // 如果路由中有查询参数q，显示查询内容
  else if (route.query.q) {
    return route.query.q as string;
  }
  // 否则显示默认副标题
  return appConfigStore.config.APP_SUB_TITLE;
});

// 计算是否显示返回按钮 - 当搜索结果页面显示时
const showBackButton = computed(() => {
  return appStatusStore.showResults;
});

// 返回按钮点击事件
const onBackClick = () => {
  // 设置为不显示搜索结果
  appStatusStore.setShowResults(false);

  // 清空当前查询
  appStatusStore.setCurrentQuery('');

  // 如果有URL参数，清除URL参数
  if (Object.keys(route.query).length > 0) {
    router.replace({ path: '/', query: {} });
  }
};

// 点击LOGO回到首页
const refreshPage = () => {
  // 设置为不显示搜索结果
  appStatusStore.setShowResults(false);

  // 清空当前查询
  appStatusStore.setCurrentQuery('');

  // 导航到首页并清除所有查询参数
  router.push({ path: '/', query: {} });
};

// 初始化主题设置
onMounted(() => {
  themeStore.initTheme();
});
</script>

<template>
  <a-page-header class="absolute w-full z-10 backdrop-blur-xl" :show-back="false">

    <template #title>
      <a-button type="secondary" @click="refreshPage">
        <template #icon>
          <icon-home />
        </template>
      </a-button>
    </template>

    <template #subtitle>
      <div class="hidden md:block">
        <a-button v-if="showBackButton" type="secondary" shape="round" size="small" @click="onBackClick">
          <template #icon>
            <icon-search />
          </template>
          <!-- Use the default slot to avoid extra spaces -->
          <template #default>
            {{ subtitle }}</template>
        </a-button>

        <div v-else>
          {{ subtitle }}
        </div>
      </div>
    </template>
    <template #extra>
      <a-space>

        <a-button shape="circle" size="small" @click="themeStore.toggleTheme">
          <template #icon>
            <icon-moon-fill v-if="themeStore.isDark" />
            <icon-sun-fill v-else />
          </template>
        </a-button>

        <!-- 返回按钮 -->
        <a-button v-if="showBackButton" type="primary" size="small" shape="round" @click="onBackClick">
          <template #icon>
            <icon-left />
          </template>
          <template #default>返回</template>
        </a-button>


        <SearchHistory />
      </a-space>
    </template>
  </a-page-header>
</template>

<style scoped lang="less"></style>
