import http from '../../http';

const baseURL = '/client/post/';
/**
 * 文章详情信息
 * @param parent
 */
export const detail = (parent: any) => http.post(baseURL + 'detail', parent);
/**
 * 分页获取最热门文章
 * @param parent
 */
export const getHotPostList = (parent: any) => http.post(baseURL + 'getHotPostList', parent);
/**
 * 分页获取最新文章
 * @param parent
 */
export const getNewestPostList = (parent: any) => http.post(baseURL + 'getNewestPostList', parent);
/**
 * 分页获取某一个标签下面文章-时间线展示
 * @param parent
 */
export const getLabelPostList = (parent: any) => http.post(baseURL + 'getLabelPostList', parent);
/**
 * 分页获取某一个分类专栏下面文章
 * @param parent
 */
export const getCatalogPostList = (parent: any) => http.post(baseURL + 'getCatalogPostList', parent);
/**
 * 喜欢文章
 * @param parent
 */
export const like = (parent: any) => http.post(baseURL + 'like', parent);

/**
 * 搜索文章
 * @param parent
 */
export const search = (parent: any) => http.post(baseURL + 'search', parent);
