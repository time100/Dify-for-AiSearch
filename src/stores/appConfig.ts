import { defineStore } from 'pinia';
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

// 定义配置接口
interface AppConfig {
  APP_NAME: string;
  APP_LOGO: string;
  APP_ICON: string;
  APP_TITLE: string;
  APP_SUB_TITLE: string;
  APP_TIP: string;
  APP_DESCRIPTION: string;
  APP_KEYWORDS: string;
  APP_URL: string;
  APP_KEY: string;
  FOOTER_COPYRIGHT: string;
  ICP_RECORD: string;
  PUBLIC_SECURITY_FILING_NUMBER: string;
  APP_VERSION: string;
  SEARCH_OPTIONS: SearchOption[];
  [key: string]: any; // 添加索引签名以支持任何额外字段
}

interface SearchOption {
  label: string;
  value: string;
  default?: boolean;
}

// 默认配置
const defaultConfig: AppConfig = {
  APP_NAME: '',
  APP_LOGO: '',
  APP_ICON: '',
  APP_TITLE: '',
  APP_SUB_TITLE: '',
  APP_TIP: '',
  APP_DESCRIPTION: '',
  APP_KEYWORDS: '',
  APP_URL: '',
  APP_KEY: '',
  FOOTER_COPYRIGHT: '',
  ICP_RECORD: '',
  PUBLIC_SECURITY_FILING_NUMBER: '',
  APP_VERSION: '1.0.0',
  SEARCH_OPTIONS: [],
};

export const useAppConfigStore = defineStore('appConfig', () => {
  // 使用reactive存储配置对象
  const config = reactive<AppConfig>({ ...defaultConfig });
  // 加载状态
  const loading = ref(false);
  // 错误状态
  const error = ref<Error | null>(null);
  // 是否已加载
  const loaded = ref(false);

  // 从window.APP_CONFIG初始化
  const initFromWindow = () => {
    if (window.APP_CONFIG) {
      // 合并配置
      Object.assign(config, window.APP_CONFIG);
      loaded.value = true;
      console.log('Config initialized from window.APP_CONFIG:', config);
    }
  };

  // 从配置文件加载配置
  const loadConfig = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // 优先从window.APP_CONFIG加载
      if (window.APP_CONFIG) {
        Object.assign(config, window.APP_CONFIG);
        loaded.value = true;
        console.log('Config loaded from window.APP_CONFIG:', config);
        return config;
      }
      
      // 如果window.APP_CONFIG不存在，则从配置文件加载
      console.log('Loading config from file...');
      const response = await axios.get('/config.js', { responseType: 'text' });
      
      // 解析配置数据
      const configText = response.data;
      const configMatch = configText.match(/window\.APP_CONFIG\s*=\s*(\{[\s\S]*?\});/);
      
      if (configMatch && configMatch[1]) {
        // 解析配置对象
        const parsedConfig = new Function(`return ${configMatch[1]}`)();
        console.log('Config parsed from file:', parsedConfig);
        
        // 清空当前配置并填充新配置
        Object.keys(config).forEach(key => delete config[key]);
        Object.assign(config, parsedConfig);
        
        // 更新window.APP_CONFIG
        window.APP_CONFIG = parsedConfig;
        
        loaded.value = true;
      } else {
        console.warn('Could not parse APP_CONFIG from config.js');
      }
    } catch (err) {
      console.error('Failed to load config.js', err);
      error.value = err instanceof Error ? err : new Error(String(err));
    } finally {
      loading.value = false;
    }
    
    return config;
  };

  // 更新配置
  const updateConfig = (newConfig: Partial<AppConfig>) => {
    Object.assign(config, newConfig);
  };

  // 重置配置到默认值
  const resetConfig = () => {
    Object.keys(config).forEach(key => delete config[key]);
    Object.assign(config, defaultConfig);
  };

  // 获取特定配置项，带默认值
  const getConfigItem = <T>(key: keyof AppConfig, defaultValue: T): T => {
    return (config[key] as unknown as T) || defaultValue;
  };
  
  // 在组件挂载时立即加载配置
  onMounted(() => {
    loadConfig();
  });
  
  return {
    config,
    loading,
    error,
    loaded,
    loadConfig,
    updateConfig,
    resetConfig,
    getConfigItem,
  };
});
