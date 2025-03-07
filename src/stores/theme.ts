import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const isDark = ref(false);
  
  // 初始化函数，从localStorage读取主题设置
  const initTheme = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  };
  
  // 设置深色主题
  const setDarkTheme = () => {
    isDark.value = true;
    document.body.setAttribute('arco-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  };
  
  // 设置浅色主题
  const setLightTheme = () => {
    isDark.value = false;
    document.body.removeAttribute('arco-theme');
    localStorage.setItem('theme', 'light');
  };
  
  // 切换主题
  const toggleTheme = () => {
    if (isDark.value) {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  };
  
  // 监听系统主题变化（如果需要）
  const listenForSystemThemeChanges = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setDarkTheme();
      } else {
        setLightTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // 初始检查
    if (mediaQuery.matches) {
      setDarkTheme();
    }
    
    // 返回清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  };
  
  // 根据系统主题设置
  const followSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      setDarkTheme();
    } else {
      setLightTheme();
    }
  };
  
  return {
    isDark,
    initTheme,
    setDarkTheme,
    setLightTheme,
    toggleTheme,
    listenForSystemThemeChanges,
    followSystemTheme
  };
});
