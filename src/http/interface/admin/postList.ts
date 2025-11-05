import http from '../../http';

const baseURL = '/blog/label/';
/**
 * 获取标签
 * @param parent
 */
export const getLabelList = (parent: any) => http.post(baseURL + 'getLabelList', parent);
/**
 * 删除标签
 * @param parent
 */
export const deleted = (parent: any) => http.post(baseURL + 'deleted', parent);
