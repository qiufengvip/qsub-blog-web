import http from '../../http';

const baseURL = '/client/home/';
/**
 * 获取菜单
 * @param parent
 */
export const getMenuList = () => http.post(baseURL + 'getMenuList');

/**
 * 获取热门文章TOP6
 * @param parent
 */
export const getNewestPostList = () => http.post(baseURL + 'getNewestPostList');

/**
 * 获取最新评论TOP6
 * @param parent
 */
export const getNewestCommentList = () => http.post(baseURL + 'getNewestCommentList');

/**
 * 获取配置信息列表
 * @param parent
 */
export const getConfigInfo = () => http.post(baseURL + 'getConfigInfo');
