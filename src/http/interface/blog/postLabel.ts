import http from '../../http';

const baseURL = '/blog/BlogPostLabel/';
/**
 * 获取标签
 * @param parent
 */
export const getLabelList = (parent: any) => http.post(baseURL + 'getLabelList', parent);

/**
 * 添加标签
 * @param parent
 */
export const saveOrUpdate = (parent: any) => http.post(baseURL + 'saveOrUpdate', parent);
