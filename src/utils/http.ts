import axios from "axios";

// 创建axios实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，比如获取token等
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response) {
      // 服务器返回错误状态码
      switch (error.response.status) {
        case 401:
          // 未授权，可以重定向到登录页
          // window.location.href = '/login'
          break;
        case 404:
          // 资源不存在
          console.error("请求的资源不存在");
          break;
        case 500:
          // 服务器错误
          console.error("服务器错误");
          break;
        default:
          console.error(`未处理的错误状态码: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error("网络错误，请检查您的网络连接");
    } else {
      // 请求配置有错误
      console.error("请求配置错误", error.message);
    }
    return Promise.reject(error);
  }
);

export default http;
