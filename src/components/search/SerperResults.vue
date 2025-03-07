<template>
  <div class="serper-results overflow-auto w-[40vw] h-[60vh]" v-if="serperResult">
    <h3 class="section-title">搜索结果</h3>
    
    <!-- 有机搜索结果 -->
    <div class="organic-results" v-if="serperResult.result.organic && serperResult.result.organic.length > 0">
      <div v-for="(item, index) in serperResult.result.organic" :key="index" class="result-item">
        <h4 class="result-title">
          <a :href="item.link" target="_blank" class="result-link">{{ item.title }}</a>
        </h4>
        <!-- <div class="result-url text-base overflow-hidden whitespace-normal line-clamp-1 mb-2 cursor-pointer">{{ item.link }}</div> -->
        <div class="result-snippet">{{ item.snippet }}</div>
        
        <!-- 子链接 -->
        <div class="result-sitelinks" v-if="item.sitelinks && item.sitelinks.length > 0">
          <div v-for="(sitelink, slIndex) in item.sitelinks" :key="slIndex" class="sitelink-item">
            <a :href="sitelink.link" target="_blank" class="sitelink-link">{{ sitelink.title }}</a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图片结果 -->
    <div class="image-results" v-if="serperResult.result.images && serperResult.result.images.length > 0">
      <h4 class="section-subtitle">图片</h4>
      <div class="image-grid">
        <div v-for="(image, index) in serperResult.result.images" :key="index" class="image-item">
          <a :href="image.link" target="_blank">
            <img :src="image.imageUrl" :alt="image.title" class="result-image" />
            <div class="image-title">{{ image.title }}</div>
          </a>
        </div>
      </div>
    </div>
    
    <!-- 相关搜索 -->
    <div class="related-searches" v-if="serperResult.result.relatedSearches && serperResult.result.relatedSearches.length > 0">
      <h4 class="section-subtitle">相关搜索</h4>
      <div class="related-searches-list">
        <div v-for="(related, index) in serperResult.result.relatedSearches" :key="index" class="related-item" @click="searchRelated(related.query)">
          {{ related.query }}
        </div>
      </div>
    </div>
    
    <!-- 无结果提示 -->
    <div class="no-results" v-if="!hasResults">
      <p>未找到搜索结果</p>
    </div>
    
    <!-- 数据来源与时间 -->
    <div class="result-footer">
      <span class="result-source">数据来源: Serper</span>
      <span class="result-time">{{ formattedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { getSerperResultByMessageId } from '../../api/serper';
import { formatDate } from '../../utils/helper';

// 定义props
const props = defineProps({
  messageId: {
    type: String,
    required: true
  }
});

// 定义事件
const emit = defineEmits(['search']);

// 当前的Serper搜索结果
const serperResult = ref(null);

// 计算属性：是否有结果
const hasResults = computed(() => {
  if (!serperResult.value) return false;
  
  const result = serperResult.value.result;
  return (
    (result.organic && result.organic.length > 0) ||
    (result.images && result.images.length > 0) ||
    (result.relatedSearches && result.relatedSearches.length > 0)
  );
});

// 格式化时间
const formattedTime = computed(() => {
  if (!serperResult.value) return '';
  
  const timestamp = serperResult.value.timestamp;
  const date = new Date(timestamp);
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
});

// 加载Serper搜索结果
const loadSerperResult = (messageId: string) => {
  try {
    console.log('SerperResults - 加载Serper结果, messageId:', messageId);
    const result = getSerperResultByMessageId(messageId);
    
    if (result) {
      console.log('SerperResults - 成功加载结果, 查询:', result.query);
      serperResult.value = result;
    } else {
      console.log('SerperResults - 未找到messageId对应的结果:', messageId);
      serperResult.value = null;
    }
  } catch (error) {
    console.error('加载Serper结果时出错:', error);
    serperResult.value = null;
  }
};

// 点击相关搜索
const searchRelated = (query: string) => {
  emit('search', query);
};

// 监听messageId变化，获取对应的Serper结果
watch(
  () => props.messageId,
  (newId) => {
    if (newId) {
      loadSerperResult(newId);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.serper-results {
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-large);
  padding: 15px;
  background-color: var(--color-bg-2);
  box-shadow: 0 2px 4px var(--color-shadow-light);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: var(--color-text-1);
}

.section-subtitle {
  font-size: 16px;
  font-weight: 500;
  margin: 15px 0 10px;
  color: var(--color-text-2);
}

.result-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--color-neutral-3);
}

.result-item:last-child {
  border-bottom: none;
}

.result-title {
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 500;
}

.result-link {
  color: rgb(var(--primary-6));
  text-decoration: none;
}

.result-link:hover {
  text-decoration: underline;
}

.result-url {
  font-size: 12px;
  color: var(--color-text-3);
  margin-bottom: 5px;
}

.result-snippet {
  font-size: 14px;
  color: var(--color-text-2);
  line-height: 1.4;
}

.result-sitelinks {
  display: flex;
  flex-wrap: wrap;
  margin-top: 8px;
}

.sitelink-item {
  margin-right: 10px;
  margin-bottom: 5px;
}

.sitelink-link {
  font-size: 13px;
  color: rgb(var(--primary-6));
  text-decoration: none;
}

.sitelink-link:hover {
  text-decoration: underline;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.image-item {
  overflow: hidden;
  border-radius: 6px;
}

.image-item a {
  display: block;
  text-decoration: none;
  color: inherit;
}

.result-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.2s;
}

.result-image:hover {
  transform: scale(1.05);
}

.image-title {
  font-size: 12px;
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.related-searches-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.related-item {
  background-color: var(--color-fill-2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: var(--color-text-1);
}

.related-item:hover {
  background-color: var(--color-fill-3);
}

.no-results {
  padding: 20px;
  text-align: center;
  color: var(--color-text-3);
}

.result-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--color-text-4);
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid var(--color-neutral-3);
}

.result-source {
  font-style: italic;
}
</style>
