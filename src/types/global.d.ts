// 全局配置接口
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
  [key: string]: any;
}

// 搜索选项类型定义
interface SearchOption {
  label: string;
  value: string;
  default?: boolean;
}

// 全局Window接口扩展
interface Window {
  APP_CONFIG?: AppConfig;
}
