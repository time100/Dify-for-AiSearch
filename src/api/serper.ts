import axios from 'axios';

// Serper搜索结果接口
export interface SerperSearchResult {
  searchParameters: {
    q: string;
    gl: string;
    hl: string;
    type: string;
    engine: string;
  };
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    sitelinks?: Array<{
      title: string;
      link: string;
    }>;
    position: number;
  }>;
  images?: Array<{
    title: string;
    imageUrl: string;
    link: string;
  }>;
  relatedSearches?: Array<{
    query: string;
  }>;
  credits?: number;
}

// 本地存储中的Serper结果存储接口
export interface StoredSerperResult {
  messageId: string;
  query: string;
  timestamp: number;
  result: SerperSearchResult;
}

// 存储键名
const STORAGE_KEY = 'aisearch_serper_results';

// 从配置中获取Serper API Key
const getSerperApiKey = (): string => {
  if (window.APP_CONFIG && window.APP_CONFIG.SERPER_APIKEY) {
    return window.APP_CONFIG.SERPER_APIKEY;
  }
  console.error('SERPER_APIKEY未在配置中设置');
  return '';
};

/**
 * 使用Serper API进行搜索
 * @param query 搜索查询
 * @param messageId 消息ID，用于关联结果
 * @returns Promise<SerperSearchResult>
 */
export const searchWithSerper = async (query: string, messageId: string): Promise<StoredSerperResult | null> => {
  try {
    // 检查API Key
    const apiKey = getSerperApiKey();
    if (!apiKey) {
      throw new Error('未配置Serper API Key');
    }

    // 检查缓存中是否已有结果 - 只在查询相同时使用缓存
    const cachedResult = getSerperResultByMessageId(messageId);
    if (cachedResult && cachedResult.query === query) {
      console.log('已有Serper搜索结果且查询相同，直接返回缓存:', messageId);
      return cachedResult;
    }

    // 否则，即使有缓存但查询不同，也执行新的搜索
    console.log('执行新的Serper搜索:', query);

    // 准备请求数据
    const data = JSON.stringify({
      q: query,
      gl: 'cn',
      hl: 'zh-cn',
      num: 20
    });

    // 设置请求配置
    const config = {
      method: 'post',
      url: 'https://google.serper.dev/search',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      data: data
    };

    console.log('调用Serper API搜索:', query);
    const response = await axios.request(config);
    
    // 创建存储对象
    const storedResult: StoredSerperResult = {
      messageId,
      query,
      timestamp: Date.now(),
      result: response.data
    };

    // 保存结果到本地存储
    saveSerperResult(storedResult);
    
    return storedResult;
  } catch (error) {
    console.error('Serper搜索失败:', error);
    return null;
  }
};

/**
 * 保存Serper搜索结果到本地存储
 * @param result 要保存的结果
 */
export const saveSerperResult = (result: StoredSerperResult): void => {
  try {
    const resultsJson = localStorage.getItem(STORAGE_KEY);
    let results: StoredSerperResult[] = [];

    if (resultsJson) {
      try {
        results = JSON.parse(resultsJson);
      } catch (e) {
        console.error('解析Serper结果失败，创建新的存储', e);
        results = [];
      }
    }

    // 检查是否已存在相同messageId的结果
    const existingIndex = results.findIndex(item => item.messageId === result.messageId);
    if (existingIndex >= 0) {
      results[existingIndex] = result;
      console.log('更新已存在的Serper结果:', result.messageId);
    } else {
      // 添加新结果
      results.unshift(result);
      console.log('添加新的Serper结果:', result.messageId);
    }

    // 限制存储数量，最多保留30条
    if (results.length > 30) {
      results = results.slice(0, 30);
    }

    // 保存到本地存储
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    console.log('Serper搜索结果已保存到本地存储');
  } catch (e) {
    console.error('保存Serper结果失败:', e);
  }
};

/**
 * 根据消息ID获取Serper搜索结果
 * @param messageId 消息ID
 * @returns StoredSerperResult | null
 */
export const getSerperResultByMessageId = (messageId: string): StoredSerperResult | null => {
  try {
    const resultsJson = localStorage.getItem(STORAGE_KEY);
    if (!resultsJson) {
      return null;
    }

    const results: StoredSerperResult[] = JSON.parse(resultsJson);
    const result = results.find(item => item.messageId === messageId);
    
    return result || null;
  } catch (e) {
    console.error('获取Serper结果失败:', e);
    return null;
  }
};

/**
 * 获取所有保存的Serper搜索结果
 * @returns StoredSerperResult[]
 */
export const getAllSerperResults = (): StoredSerperResult[] => {
  try {
    const resultsJson = localStorage.getItem(STORAGE_KEY);
    if (!resultsJson) {
      return [];
    }

    return JSON.parse(resultsJson);
  } catch (e) {
    console.error('获取所有Serper结果失败:', e);
    return [];
  }
};

/**
 * 清除所有Serper搜索结果
 */
export const clearAllSerperResults = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('所有Serper搜索结果已清除');
  } catch (e) {
    console.error('清除Serper结果失败:', e);
  }
};
