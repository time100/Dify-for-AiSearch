import { defineStore } from 'pinia';
import { ref } from 'vue';

// 定义一个存储应用状态的store
export const useAppStatusStore = defineStore('appStatus', () => {
  // 是否显示搜索结果页面
  const showResults = ref(false);
  
  // 当前搜索查询
  const currentQuery = ref('');

  // 设置显示搜索结果状态
  function setShowResults(value: boolean) {
    showResults.value = value;
  }

  // 设置当前搜索查询
  function setCurrentQuery(query: string) {
    currentQuery.value = query;
  }

  return {
    showResults,
    currentQuery,
    setShowResults,
    setCurrentQuery
  };
});
