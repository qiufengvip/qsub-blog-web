import http from '../../http';
/**
 * 帖子相关
 */

/**
 * 新建更新帖子
 * @param parent
 */
export const saveOrUpdate = (parent: any) => http.post('/blog/blogPost/saveOrUpdate', parent);
/**
 * 获取帖子列表
 * @param parent
 */
export const getPostList = (parent: any) => http.post('/blog/blogPost/getPostList', parent);
/**
 * 获取文章详情
 * @param parent
 */
export const detail = (parent: any) => http.post('/blog/blogPost/detail', { id: parent });

/**
 * 删除文章详情
 * @param parent
 */
export const deleted = (parent: any) => http.post('/blog/blogPost/deleted', { id: parent });
