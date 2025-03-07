<template>
  <div class=" w-full h-full">
    <!-- 搜索组件 -->
    <SearchBox v-if="!showResults" @search="onSearch" />

    <!-- 搜索结果展示 -->
    <div v-if="showResults" class="h-full">
      <SearchResults ref="searchResultsRef" :query="searchQuery" :search-type="searchType" :options="searchOptions"
        @result-ready="onResultReady" @error="onSearchError" @search-complete="onSearchComplete"
        @update-query="onUpdateQuery" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SearchBox from '../components/search/SearchBox.vue';
import SearchResults from '../components/search/SearchResults.vue';
import { useAppConfigStore } from '../stores/appConfig';
import { useAppStatusStore } from '../stores/appStatus';

interface SearchParams {
  query: string;
  type: string;
  files?: any[];
}

// 路由
const route = useRoute();
const router = useRouter();

// 搜索状态
const searchQuery = ref('');
const searchType = ref('web');
const showResults = ref(false);
const searchResultsRef = ref<InstanceType<typeof SearchResults> | null>(null);
const searchOptions = reactive({});
const appConfig = useAppConfigStore();
const appStatus = useAppStatusStore();

// 处理路由参数中的搜索请求
const handleRouteParams = () => {
  // 检查URL参数是否包含搜索查询
  const queryParam = route.query.q as string;
  const typeParam = route.query.type as string;
  const sessionId = route.query.conversation_id || route.query.session_id as string;

  if (queryParam) {
    // 更新搜索参数
    searchQuery.value = queryParam;
    if (typeParam) {
      searchType.value = typeParam;
    }

    // 设置会话ID到搜索选项
    if (sessionId) {
      Object.assign(searchOptions, { session_id: sessionId });
    } else {
      Object.assign(searchOptions, {});
    }

    // 显示结果区域
    showResults.value = true;
    appStatus.setShowResults(true);

    // 更新显示的查询内容
    if (queryParam) {
      appStatus.setCurrentQuery(queryParam);
    }

    // 执行搜索
    setTimeout(() => {
      searchResultsRef.value?.executeSearch();
    }, 100);
  }
};

// 处理搜索
const onSearch = (params: SearchParams) => {
  console.log('搜索查询:', params.query);
  console.log('搜索类型:', params.type);
  if (params.files && params.files.length > 0) {
    console.log('添加文件:', params.files);
  }

  // 更新搜索参数
  searchQuery.value = params.query;
  searchType.value = params.type;

  // 设置搜索选项 - 包含文件列表（如果有）
  Object.assign(searchOptions, {
    files: params.files || []
  });

  // 显示结果区域
  showResults.value = true;
  appStatus.setShowResults(true);
  appStatus.setCurrentQuery(params.query);

  // 执行搜索
  setTimeout(() => {
    searchResultsRef.value?.executeSearch();
  }, 100);
};

// 搜索结果处理
const onResultReady = (content: string) => {
  console.log('搜索结果准备就绪:', content.length);
};

// 搜索错误处理
const onSearchError = (error: string) => {
  console.error('搜索错误:', error);
};

// 搜索完成处理
const onSearchComplete = (result: { content: string, searchType: string }) => {
  console.log('搜索完成:', result.searchType);
};

// 更新搜索查询处理
const onUpdateQuery = (query: string) => {
  console.log('更新搜索查询:', query);
  searchQuery.value = query;
  appStatus.setCurrentQuery(query);
};

// 监听appStatus中的showResults变化，同步本地状态
watch(() => appStatus.showResults, (newValue) => {
  showResults.value = newValue;
});

// 监听路由变化
onMounted(() => {
  // 如果是/search路径，将参数附加到/路径并重定向
  if (route.path === '/search') {
    router.replace({
      path: '/',
      query: route.query
    });
    return;
  }

  handleRouteParams();
});

// 监听路由参数变化以处理通过历史记录跳转的情况
watch(() => [route.path, route.query], ([newPath, newQuery], [oldPath, oldQuery]) => {
  // 如果路径是/search，将参数附加到/路径并重定向
  if (newPath === '/search') {
    router.replace({
      path: '/',
      query: typeof newQuery === 'string' ? { q: newQuery } : newQuery
    });
    return;
  }

  // 检查newQuery是否为对象，并且是否有q属性
  if (typeof newQuery === 'object' && newQuery && 'q' in newQuery) {
    // 有搜索参数，处理搜索请求
    handleRouteParams();
  } else if (Object.keys(newQuery as Record<string, any>).length === 0 && Object.keys(oldQuery).length > 0) {
    // 查询参数被清空，显示搜索框
    showResults.value = false;
    appStatus.setShowResults(false);
  }
}, { deep: true });
</script>

<style scoped lang="less"></style>
