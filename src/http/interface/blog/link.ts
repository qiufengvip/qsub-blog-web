import http from '../../http';

const baseURL = '/blog/link/';

/**
 * 获取友情链接列表
 * @param parent
 */
export const getPageList = (parent: any) => http.post(baseURL + 'getPageList', parent);

/**
 * 新建或更新友情链接
 * @param parent
 */
export const saveOrUpdate = (parent: any) => http.post(baseURL + 'saveOrUpdate', parent);

/**
 * 删除友情链接
 * @param parent
 */
export const deleted = (parent: any) => http.post(baseURL + 'deleted', parent);

/**
 * 获取详情信息
 * @param parent
 */
export const detail = (parent: any) => http.post(baseURL + 'detail', parent);
