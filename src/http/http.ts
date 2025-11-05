// 一、配置axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { ApplicationError } from '@/utils/error';

// import store from '@/store/index' 如果使用vuex，那么token，userinfo都可以在登录以后存储到store中，不需要使用storage
// 获取浏览器的接口地址。

const isClient = typeof window !== 'undefined';
const baseUrl = isClient ? window.location.origin : 'http://localhost:3000';

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
    ElMessage.error(error);
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
        ElMessage({
          message: '登录超时,请重新登录',
          type: 'error',
          grouping: true,
        });
        if (isClient) {
          sessionStorage.setItem('token', '');
        }
        return Promise.reject(response);
      } else if (response.data.code == 500 || response.data.code == 400) {
        //返回错误拦截
        ElMessage.error(response.data.msg);
        return Promise.reject(response);
      } else {
        ElMessage.error(response.data.msg);
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
      ElMessage({
        message: '登录超时,请重新登录',
        type: 'error',
        grouping: true,
      });
      if (isClient) {
        sessionStorage.setItem('token', '');
      }
    } else {
      if (error.message.indexOf('timeout') > -1) {
        ElMessage.error('请求超时');
      } else if (error.message.indexOf('Network') > -1) {
        ElMessage.error('网络连接错误');
      } else {
        ElMessage.error(error.message);
      }
      return Promise.reject(error);
    }
  }
);

export default http;
