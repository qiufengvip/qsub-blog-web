import http from '../../http';

const baseURL = '/base/user/';
/**
 * 获取个人信息
 * @param parent
 */
export const getMeInfo = () => http.get(baseURL + 'getMeInfo');

/**
 * 保存个人信息
 * @param parent
 */
export const saveMeInfo = (parent: any) => http.post(baseURL + 'saveMeInfo', parent);
