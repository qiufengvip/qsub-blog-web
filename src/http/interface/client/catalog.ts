import http from '../../http';

const baseURL = '/client/catalog/';
/**
 * 获取分类专栏信息
 * @param parent
 */
export const detail = (parent: any) => http.post(baseURL + 'detail', parent);
