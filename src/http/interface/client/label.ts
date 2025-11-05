import http from '../../http';

/**
 * 博客客户端-标签
 */
const baseURL = '/client/label/';
/**
 * 获取标签列表-所有标签
 * @param parent
 */
export const getLabelList = () => http.post(baseURL + 'getLabelList');
/**
 * 获取标签详情信息
 * @param parent 标签id
 */
export const detail = (parent: any) => http.post(baseURL + 'detail', parent);
