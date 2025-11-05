import http from '../../http';

const baseURL = '/client/link/';
/**
 * 获取友情链接列表
 * @param parent
 */
export const getLinkList = () => http.post(baseURL + 'getLinkList');
