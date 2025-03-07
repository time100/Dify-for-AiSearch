# AiSearch - 智能搜索对话应用（Dify）


## 项目介绍

AiSearch是一个基于Vue 3和TypeScript构建的智能搜索对话应用前端项目，后端通过Dify工作流编排的对话型应用提供API支持。该应用集成了多种搜索能力，支持Web搜索、文件上传、图像识别等功能，并提供流式响应的聊天界面，为用户提供丰富的搜索体验。

![screenshot](https://io.onenov.cn/file/202503072006755.png)

## 核心功能

### 多类型搜索
- **Web搜索**：通过集成Dify后端API进行网络信息检索
- **Serper API集成**：提供更丰富的搜索结果，包括有机搜索、图片和相关搜索推荐
- **文件搜索**：支持上传并搜索文档内容

### 文件上传功能
- 支持多种文件类型：文档(PDF, DOCX, TXT等)、图片(JPG, PNG, WEBP等)、音频、视频
- 最大支持100MB的文件上传
- 拖拽上传与点击上传两种方式
- 文件类型自动识别与分类

### 聊天对话
- 流式响应的聊天界面
- 历史会话保存与恢复
- 建议问题推荐
- 消息ID追踪系统

### 结果展示
- 集成Serper搜索结果展示
- 响应式UI设计，适配不同设备
- 文件预览功能
- 支持暗黑模式

## 技术栈

- **前端框架**：Vue 3 + TypeScript
- **UI组件库**：Arco Design 
- **样式工具**：TailwindCSS + Less
- **状态管理**：Pinia
- **路由管理**：Vue Router
- **HTTP请求**：Axios
- **本地存储**：LocalStorage
- **构建工具**：Vite
- **Markdown编辑器**：md-editor-v3
- **API集成**：
  - Dify对话应用API
  - Serper Google搜索API

## 项目结构

```
ai-search/
├── public/                # 静态资源
│   ├── config.js          # 全局配置文件（API密钥等）
│   ├── work.yml           # 工作流配置文件
│   └── data/              # 静态数据文件
│       ├── PrivacyPolicy.json     # 隐私政策数据
│       └── ServiceAgreement.json  # 服务协议数据
├── src/
│   ├── api/               # API请求模块
│   │   ├── search.ts      # 搜索相关API
│   │   └── serper.ts      # Serper API集成
│   ├── assets/            # 静态资源
│   │   ├── js/            # JavaScript资源
│   │   └── style/         # 样式文件
│   │       ├── dark.less         # 暗黑主题
│   │       ├── light.less        # 亮色主题
│   │       ├── mobile.less       # 移动端样式
│   │       ├── nprogress.less    # 进度条样式
│   │       ├── style.less        # 主样式文件
│   │       └── tailwind.css      # TailwindCSS样式
│   ├── components/        # Vue组件
│   │   ├── common/        # 通用组件
│   │   │   └── BackToTop.vue     # 返回顶部组件
│   │   ├── layout/        # 布局组件
│   │   │   ├── Footer.vue        # 页脚组件
│   │   │   └── Header.vue        # 页头组件
│   │   ├── search/        # 搜索相关组件
│   │   │   ├── SearchBox.vue     # 搜索输入框组件
│   │   │   ├── SearchHistory.vue # 搜索历史组件
│   │   │   ├── SearchResults.vue # 搜索结果展示组件
│   │   │   └── SerperResults.vue # Serper搜索结果组件
│   │   └── upload/        # 上传相关组件
│   │       └── FileUploader.vue  # 文件上传组件
│   ├── layouts/           # 布局模板
│   │   └── DefaultLayout.vue     # 默认布局模板
│   ├── router/            # 路由配置
│   │   └── index.ts              # 路由定义
│   ├── stores/            # Pinia状态管理
│   │   ├── appConfig.ts          # 应用配置状态
│   │   ├── appStatus.ts          # 应用状态管理
│   │   ├── index.ts              # 状态管理入口
│   │   ├── legalDocs.ts          # 法律文档状态
│   │   └── theme.ts              # 主题状态管理
│   ├── utils/             # 工具函数
│   │   ├── date.ts               # 日期处理工具
│   │   ├── helper.ts             # 通用辅助函数
│   │   ├── http.ts               # HTTP请求工具
│   │   └── nprogress.ts          # 进度条工具
│   ├── views/             # 页面视图
│   │   ├── About.vue             # 关于页面
│   │   ├── Home.vue              # 首页
│   │   ├── PrivacyPolicy.vue     # 隐私政策页面
│   │   └── ServiceAgreement.vue  # 服务协议页面
│   ├── App.vue            # 应用主组件
│   └── main.ts            # 应用入口
├── tailwind.config.js     # TailwindCSS配置
├── vite.config.ts         # Vite构建配置
├── package.json           # 项目依赖
└── tsconfig.json          # TypeScript配置
```

## 安装与运行

### 前置条件
- Node.js 16+
- NPM 或 Yarn 或 PNPM
- Dify 1.0.0，导入[public/work.yml](./public/work.yml)工作流配置，获取基础URL与API密钥（参考[API 密钥获取流程](https://docs.dify.ai/zh-hans/learn-more/use-cases/dify-schedule#api-mi-yao-huo-qu-liu-cheng)）


### 安装依赖
```bash
# 克隆项目
git clone https://github.com/onenov/Dify-for-AiSearch.git
# 进入项目目录
cd Dify-for-AiSearch
# 复制配置文件并修改配置
cp public/config-example.js public/config.js

# 使用PNPM安装依赖（推荐）
pnpm install
# 或使用NPM
npm install
# 或使用Yarn
yarn install
```

### 开发环境运行
```bash
pnpm dev
# 或
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
pnpm build
# 或
npm run build
# 或
yarn build
```

### 讯飞语音识别

1. 在[科大讯飞控制台](https://console.xfyun.cn/services/iat)中获取服务接口认证信息

![](https://io.onenov.cn/file/202503072018847.png)

2. 编辑`src/assets/js/IatRecorder.js`文件

```bash
const APPID = "xxx"; //在科大讯飞控制台中获取的服务接口认证信息
const API_SECRET = "xxx"; //在科大讯飞控制台中获取的服务接口认证信息
const API_KEY = "xxx"; //在科大讯飞控制台中获取的服务接口认证信息
```

## 使用指南

## 配置
在`public/config.js`中配置必要的API密钥和URL：
```js
window.APP_CONFIG = {
  APP_NAME: 'TIDE AIQus',
  APP_LOGO: 'https://example.com/logo.png',
  APP_ICON: 'https://example.com/icon.ico',
  APP_TITLE: 'AI搜索',
  APP_SUB_TITLE: '没有广告，直达结果',
  APP_TIP: 'AI 驱动的搜索，提供更准确、更智能的结果',
  APP_DESCRIPTION: 'AI搜索是一款基于人工智能的搜索引擎，提供无广告、精准、高效的搜索体验。',
  APP_URL: 'https://api.example.com/v1',  // Dify应用API地址
  APP_KEY: 'your-dify-app-key',           // Dify应用密钥
  SERPER_APIKEY: 'your-serper-api-key'     // Serper API密钥
};
```

### 配置文件说明

`public/config.js`是应用的全局配置文件，包含以下配置项：

### 基本应用信息
- **APP_NAME**: 应用名称，显示在浏览器标签和应用界面上
- **APP_LOGO**: 应用logo的URL地址，用于界面显示
- **APP_ICON**: 应用图标的URL地址，用作favicon
- **APP_TITLE**: 应用主标题，显示在首页和导航栏
- **APP_SUB_TITLE**: 应用副标题，提供额外的应用描述
- **APP_TIP**: 应用提示信息，通常显示在搜索框下方
- **APP_DESCRIPTION**: 应用详细描述，用于SEO和应用介绍
- **APP_KEYWORDS**: SEO关键词，用于提高搜索引擎可见性

### 法律信息
- **FOOTER_COPYRIGHT**: 页脚版权信息
- **ICP_RECORD**: ICP备案号（中国大陆网站需要）
- **PUBLIC_SECURITY_FILING_NUMBER**: 公安备案号（中国大陆网站需要）
- **APP_VERSION**: 应用版本号

### API配置
- **APP_URL**: Dify应用API的基础URL，所有API请求都基于此URL
- **APP_KEY**: Dify应用的API密钥，用于API认证
- **SERPER_APIKEY**: Serper搜索API的密钥，用于获取额外的搜索结果

### 选项配置
选项可以根据工作流自行配置，配置文件中的`SEARCH_OPTIONS`数组定义了搜索类型选项，每个选项包含：
  - **label**: 显示名称
  - **value**: 搜索类型的值（用于API请求）
  - **placeholder**: 搜索框占位文本
  - **default**: 是否为默认选项

目前支持的搜索类型：
- 全网 (web): 通用网络搜索
- 资讯 (news): 新闻资讯搜索
- 学术 (academic): 学术内容搜索
- 对话 (chat): 纯对话模式
- 写作 (writing): 内容创作辅助
- 链接读取 (link): 解析和分析URL内容

![](https://io.onenov.cn/file/202503072003717.png)

---

### 搜索功能
1. 在搜索框中输入问题或关键词
2. 选择搜索类型（全网、资讯、学术、对话等）
3. 点击搜索按钮或按回车键提交搜索
4. 查看流式响应结果及Serper搜索结果

### 文件上传
1. 点击搜索框旁的文件上传按钮
2. 选择或拖拽文件到上传区域
3. 上传完成后，将自动将文件与搜索内容关联
4. 提交搜索，系统将分析文件内容并结合搜索查询

### 聊天历史
- 聊天历史将自动保存在本地存储中
- 可通过界面访问历史会话
- 支持继续之前的对话

## 主要流程
1. 用户发起搜索请求（带/不带文件）
2. 前端将请求发送至Dify后端API
3. Dify处理请求并返回流式响应
4. 前端获取消息ID并同步调用Serper API获取额外搜索结果
5. 前端同时展示AI回答和Serper搜索结果

## 开发贡献

### 代码规范
- 遵循Vue 3组合式API编程风格
- 使用TypeScript进行类型检查
- 使用ESLint和Prettier进行代码格式化

## 许可证

本项目基于 MIT 许可证发布 - 查看 [LICENSE](./LICENSE) 文件了解更多细节。
