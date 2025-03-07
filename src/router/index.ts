import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NProgress from '../utils/nprogress'

const routes = [
  {
    path: '/',
    name: '首页',
    component: Home
  },
  {
    path: '/about',
    name: '关于',
    component: () => import('../views/About.vue')
  },
  {
    path: '/privacy',
    name: '隐私政策',
    component: () => import('../views/PrivacyPolicy.vue')
  },
  {
    path: '/agreement',
    name: '服务协议',
    component: () => import('../views/ServiceAgreement.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫：开始加载
router.beforeEach((to, from, next) => {
  // 启动进度条
  NProgress.start()
  // 页面标题 - 使用String()明确转换
  document.title = to.name ? `${String(to.name)} | AI搜索` : 'AI搜索'
  next()
})

// 路由守卫：加载完成
router.afterEach(() => {
  // 关闭进度条
  NProgress.done()
})

export default router
