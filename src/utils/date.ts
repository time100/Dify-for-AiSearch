import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包
import relativeTime from 'dayjs/plugin/relativeTime'; // 相对时间插件
import customParseFormat from 'dayjs/plugin/customParseFormat'; // 自定义解析插件

// 设置默认语言为中文
dayjs.locale('zh-cn');

// 使用插件
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | number | Date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
};

/**
 * 获取相对时间
 * @param date 日期
 * @returns 相对时间字符串，如"几分钟前"
 */
export const fromNow = (date: string | number | Date) => {
  return dayjs(date).fromNow();
};

/**
 * 获取两个日期之间的差异
 * @param date1 日期1
 * @param date2 日期2
 * @param unit 单位：'millisecond', 'second', 'minute', 'hour', 'day', 'month', 'year'
 * @returns 差异值
 */
export const diff = (
  date1: string | number | Date,
  date2: string | number | Date,
  unit: 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' = 'millisecond'
) => {
  return dayjs(date1).diff(date2, unit);
};

/**
 * 判断日期是否在指定范围之前
 * @param date 日期
 * @param comparisonDate 比较日期
 * @returns boolean
 */
export const isBefore = (date: string | number | Date, comparisonDate: string | number | Date) => {
  return dayjs(date).isBefore(dayjs(comparisonDate));
};

export default dayjs;
