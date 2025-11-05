// 邮箱通用正则
import { getConfigInfo } from '@/http/interface/client/home';
import { requestCheckLogin } from '@/http/interface/api';

export const verifyMail = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;

//用户名正则，4到16位（字母，数字，下划线，减号）
export const verifyUserName = /^[a-zA-Z0-9_-]{4,16}$/;

//密码正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
export const verifyPassword = /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/;
// 昵称验证规则 昵称由2-18位数字或字母、汉字、下划线组成！
export const verifyNickName = /^[A-Za-z0-9_\u4e00-\u9fa5]{2,14}$/;
// 全局配置 key
export const GlobalConfig = 'GLOBAL_CONFIG';
// 文章_喜欢 key
export const GlobalLikePost = 'LIKE_POST';

/**
 * @desc 转tree
 * @param data      原数据
 * @param pid       pid的值
 * @param pdata     父级的data
 * @param children  字集的名称
 * @returns {*[]}
 */
export const toTree: any = (data: any[], pid: string, pdata: any, children: string) => {
  let a: any[] = [],
    b: any[] = [];
  data.forEach((item) => {
    if (item.pid === pid) {
      a.push(item);
    } else {
      b.push(item);
    }
  });
  if (pdata === null) {
    pdata = a;
  } else {
    pdata[children] = a;
  }
  if (b.length > 0) {
    a.forEach((item) => {
      toTree(b, item.id, item, children);
    });
  }
  return a;
};
//寻找树形结构的树杈

export const lookingBranch: any = (data: any[], pid: string | number) => {
  let a: any[] = [],
    b: any[] = [],
    c: any[] = [];
  data.forEach((item) => {
    if (item.pid === pid) {
      a.push(item);
    } else {
      b.push(item);
    }
  });
  if (a.length > 0) {
    a.forEach((item) => {
      c = lookingBranch(b, item.id);
    });
  }
  a.concat(c);
  return a;
};

/**
 * @desc 复制内容到剪贴板
 * @param txt
 */
export const copyText: any = function (txt: string) {
  if (typeof document === 'undefined') {
    return;
  }
  const input = document.createElement('input');
  input.value = txt;
  document.body.appendChild(input);
  input.select();
  document.execCommand('Copy');
  document.body.removeChild(input);
};

export const imgFileType: any = [
  '',
  '',
  '',
  '',
  'image/tiff',
  'image/tiff',
  'image/vnd.svf',
  'image/png',
  'image/jpeg',
  'image/jpeg',
  'image/jpeg',
  'image/jp2',
  'image/gif',
  'image/vnd.dxf',
  'image/vnd.dwg',
];
/**
 * 获取配置信息
 */
export const getConfigData = (key: string): any => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  let configDataStr = localStorage.getItem(GlobalConfig);
  if (configDataStr) {
    let configData = JSON.parse(configDataStr);
    return configData[key];
  }
  return undefined;
};
/**
 * 设置网页标题
 */
export const setWebTitle = (title: string) => {
  if (typeof window === 'undefined') {
    return;
  }
  if (title) {
    document.title = `秋枫博客-${title}`;
  } else {
    document.title = '秋枫博客';
  }
};

/**
 * 初始化配置信息
 */
export const initConfigData = async (): Promise<any> => {
  if (typeof window === 'undefined') {
    return;
  }
  let item = localStorage.getItem(GlobalConfig);
  if (item) {
    let parse = JSON.parse(item);
    if (parse && parse.time && new Date().getTime() < parse.time) {
      // 键存在 - 键可以转json - 键未过期 - 则不用重新获取
      return;
    }
  }
  let res: any = await getConfigInfo();
  if (res.time) {
    alert('不能设置变量名称为time,因为是内置变量');
  }
  res.time = new Date().getTime() + 60 * 60 * 1000;
  localStorage.setItem(GlobalConfig, JSON.stringify(res));
};
/**
 * 检查登录信息
 */
export const checkLogin: any = async (): Promise<boolean> => {
  if (typeof window === 'undefined') {
    return false;
  }
  let response: any = await requestCheckLogin();
  if (response.code === 0) {
    console.log(response);
    sessionStorage.setItem('user', JSON.stringify(response.data));
    return true;
  }
  return false;
};

/**
 * 获取文章是否添加喜欢
 */
export const getPostLikeStart = (key: number): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  let configDataStr = localStorage.getItem(GlobalLikePost);
  if (configDataStr) {
    let configData: number[] = JSON.parse(configDataStr);
    return configData.includes(key);
  }
  return false;
};
/**
 * 添加文章是否添加喜欢
 */
export const addPostLike = (key: number) => {
  if (typeof window === 'undefined') {
    return;
  }
  let configDataStr = localStorage.getItem(GlobalLikePost);
  if (configDataStr) {
    let configData: number[] = JSON.parse(configDataStr);
    configData.push(key);
    localStorage.setItem(GlobalLikePost, JSON.stringify(configData));
  } else {
    localStorage.setItem(GlobalLikePost, `[${key}]`);
  }
};
