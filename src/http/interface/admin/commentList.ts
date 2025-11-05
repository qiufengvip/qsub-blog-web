import http from '../../http';

const baseURL = '/blog/comment/';
/**
 * 获取标签
 * @param parent
 */
export const getCommentList = (parent: any) => http.post(baseURL + 'getCommentList', parent);
/**
 * 删除标签
 * @param parent
 */
export const deleted = (parent: any) => http.post(baseURL + 'deleted', parent);
