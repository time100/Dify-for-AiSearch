import { createApp } from 'vue'
import './assets/style/tailwind.css'
import './assets/style/style.less'
import './assets/style/light.less'
import './assets/style/dark.less'
import './assets/style/mobile.less' 
import './assets/style/nprogress.less' 

import 'md-editor-v3/lib/style.css';

import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(ArcoVue, {
  // 设置ArcoDesign组件库的全局配置
})
app.use(ArcoVueIcon)
app.use(pinia)
app.use(router)

app.mount('#app')
