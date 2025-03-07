/**
 * 生成随机ID
 * @returns 随机生成的ID字符串
 */
export const generateRandomId = (): string => {
  return Date.now() + '-' + Math.random().toString(36).substring(2, 10);
};

/**
 * 格式化日期对象为字符串
 * @param date 日期对象
 * @param format 格式化模式，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  format = format.replace('YYYY', year.toString());
  format = format.replace('MM', month.toString().padStart(2, '0'));
  format = format.replace('DD', day.toString().padStart(2, '0'));
  format = format.replace('HH', hours.toString().padStart(2, '0'));
  format = format.replace('mm', minutes.toString().padStart(2, '0'));
  format = format.replace('ss', seconds.toString().padStart(2, '0'));
  
  return format;
};

/**
 * 计算相对时间（多久以前）
 * @param timestamp 时间戳
 * @returns 相对时间字符串
 */
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // 时间单位（毫秒）
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前';
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前';
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前';
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前';
  } else if (diff < year) {
    return Math.floor(diff / month) + '个月前';
  } else {
    return Math.floor(diff / year) + '年前';
  }
};
