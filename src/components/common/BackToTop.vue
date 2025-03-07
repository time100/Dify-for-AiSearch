<template>
  <transition name="fade">
    <div v-show="visible" @click="scrollToTop" class="back-to-top-btn" title="返回顶部">
      <a-button type="primary" shape="circle">
        <template #icon>
          <icon-arrow-rise />
        </template>
      </a-button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 显示返回顶部按钮的滚动阈值（像素）
const SCROLL_THRESHOLD = 300;

// 按钮可见性状态
const visible = ref(false);

// 监听滚动事件，控制按钮显示/隐藏
const handleScroll = () => {
  visible.value = window.scrollY > SCROLL_THRESHOLD;
};

// 返回顶部功能
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 组件挂载时添加滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="less">
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
