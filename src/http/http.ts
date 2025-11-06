// 一、配置axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ApplicationError } from '@/utils/error';

// import store from '@/store/index' 如果使用vuex，那么token，userinfo都可以在登录以后存储到store中，不需要使用storage
// 获取浏览器的接口地址。

const isClient = typeof window !== 'undefined';

const sanitizeOrigin = (origin?: string | null) => {
  if (!origin) {
    return '';
  }
  return origin.endsWith('/') ? origin.slice(0, -1) : origin;
};

const resolveServerOrigin = () => {
  const env =
    typeof globalThis !== 'undefined' &&
    (globalThis as any).process &&
    (globalThis as any).process.env
      ? ((globalThis as any).process.env as Record<string, string | undefined>)
      : undefined;
  if (!env) {
    return '';
  }
  const { SSR_API_BASE_URL, API_PROXY_TARGET, API_BASE_URL, VITE_API_BASE_URL } = env;
  return sanitizeOrigin(SSR_API_BASE_URL || API_PROXY_TARGET || API_BASE_URL || VITE_API_BASE_URL);
};

const notifyError = (message: any) => {
  if (isClient) {
    ElMessage.error(message);
  } else {
    const text = typeof message === 'string' ? message : message?.message ?? message;
    console.error('[http] request failed:', text);
  }
};
const serverOrigin = resolveServerOrigin();
const baseUrl = isClient ? window.location.origin : serverOrigin || 'http://localhost:3000';

const http = axios.create({
  baseURL: baseUrl + '/api',
  timeout: 1800000, //30分钟
});
// 请求拦截器，设置token
http.interceptors.request.use(
  (config) => {
    if (isClient && sessionStorage.getItem('token')) {
      const token = sessionStorage.getItem('token');
      // @ts-ignore
      token && (config.headers[token.name] = token.data);
    }
    return config;
  },
  (error) => {
    // 可以安装elementui等ui组件，将错误信息输出到界面。
    notifyError(error);
    // @ts-ignore
    return Promise.error(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response: any) => {
    if (response.config.url === '/base/check') {
      return response.data;
    }
    if (response.status === 200 && response.data.code !== undefined && response.data.code !== 0) {
      if (response.data.code == 993) {
        if (isClient) {
          ElMessage({
            message: '登录超时,请重新登录',
            type: 'error',
            grouping: true,
          });
        } else {
          console.error('[http] 登录超时,请重新登录');
        }
        if (isClient) {
          sessionStorage.setItem('token', '');
        }
        return Promise.reject(response);
      } else if (response.data.code == 500 || response.data.code == 400) {
        //返回错误拦截
        notifyError(response.data.msg);
        return Promise.reject(response);
      } else {
        notifyError(response.data.msg);
        // 自定义错误
        throw new ApplicationError(response.data.code); //返回错误代码
      }
    } else if (response.data instanceof Blob) {
      return response.data;
    }
    return response.data.data; //返回数据体
  },
  (error) => {
    if (error.response && error.response.status === 993) {
      if (isClient) {
        ElMessage({
          message: '登录超时,请重新登录',
          type: 'error',
          grouping: true,
        });
      } else {
        console.error('[http] 登录超时,请重新登录');
      }
      if (isClient) {
        sessionStorage.setItem('token', '');
      }
    } else {
      if (error.message.indexOf('timeout') > -1) {
        notifyError('请求超时');
      } else if (error.message.indexOf('Network') > -1) {
        notifyError('网络连接错误');
      } else {
        notifyError(error.message);
      }
      return Promise.reject(error);
    }
  }
);

export default http;
