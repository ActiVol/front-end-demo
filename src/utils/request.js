import axios from 'axios';
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus';
import { getToken } from './auth';
import errorCode from './errorCode';
import { tansParams } from './ruoyi';
import cache from '../plugins/cache';
import useUserStore from '../stores/modules/user';
import router from '../router';

// 是否显示重新登录
export let isRelogin = { show: false };
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

// 创建axios实例
const service = axios.create({
  // 强制指定目标API地址（覆盖环境变量）
  baseURL: 'http://115.215.67.147:8848/volunteer',
  timeout: 10000, // 10秒超时
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 关键修复：确保URL正确拼接
    if (config.url.includes('://')) {
      // 如果URL已经是完整地址（如http://xxx），移除baseURL
      config.baseURL = '';
    } else if (!config.url.startsWith('/')) {
      // 如果URL不以/开头，自动补全/
      config.url = '/' + config.url;
    }

    // 处理Token
    const isToken = (config.headers || {}).isToken === false;
    if (getToken() && !isToken) {
      config.headers.Authorization = 'Bearer ' + getToken();
    }

    // GET请求参数处理
    if (config.method === 'get' && config.params) {
      let url = config.url + '?' + tansParams(config.params);
      url = url.slice(0, -1); // 移除末尾多余的&
      config.params = {};
      config.url = url;
    }

    // 防止重复提交（POST/PUT）
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestObj = {
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: new Date().getTime(),
      };

      const requestSize = Object.keys(JSON.stringify(requestObj)).length;
      const limitSize = 5 * 1024 * 1024; // 5MB限制
      if (requestSize >= limitSize) {
        console.warn(`[${config.url}]: 请求数据超过5MB限制，跳过防重复提交验证`);
        return config;
      }

      const sessionObj = cache.session.getJSON('sessionObj');
      if (sessionObj) {
        const { url: s_url, data: s_data, time: s_time } = sessionObj;
        const interval = 1000; // 1秒内重复提交视为无效
        if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
          const message = '数据正在处理，请勿重复提交';
          console.warn(`[${s_url}]: ${message}`);
          return Promise.reject(new Error(message));
        }
      }
      cache.session.setJSON('sessionObj', requestObj);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    const code = res.data.code || 200;
    const msg = errorCode[code] || res.data.msg || errorCode.default;

    // 二进制数据直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data;
    }

    if (code === 401) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            isRelogin.show = false;
            useUserStore().logOut().then(() => {
              router.push('/login');
            });
          })
          .catch(() => {
            isRelogin.show = false;
          });
      }
      return Promise.reject('会话已过期，请重新登录');
    } else if (code === 500) {
      ElMessage({ message: msg, type: 'error' });
      return Promise.reject(new Error(msg));
    } else if (code === 601) {
      ElMessage({ message: msg, type: 'warning' });
      return Promise.reject(new Error(msg));
    } else if (code === 10001 || code === 10002) {
      return Promise.resolve(res.data);
    } else if (code !== 200) {
      ElNotification.error({ title: msg });
      return Promise.reject('error');
    }

    return Promise.resolve(res.data);
  },
  (error) => {
    let { message } = error;
    if (message === 'Network Error') {
      message = '后端接口连接异常';
    } else if (message.includes('timeout')) {
      message = '请求超时';
    } else if (message.includes('Request failed with status code')) {
      message = `接口 ${message.slice(-3)} 错误`;
    }
    ElMessage({ message, type: 'error', duration: 5000 });
    return Promise.reject(error);
  }
);

export default service;