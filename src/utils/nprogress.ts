import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 配置NProgress
NProgress.configure({
  // 动画设置
  easing: 'ease',
  // 速度
  speed: 500,
  // 是否显示环形进度条
  showSpinner: false,
  // 进度条最小百分比
  minimum: 0.1,
  // 父元素，默认为body
  parent: 'body',
});

export default NProgress;
