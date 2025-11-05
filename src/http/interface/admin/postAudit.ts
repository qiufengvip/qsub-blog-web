import http from '../../http';

const baseURL = '/blog/blogPost/';
/**
 * 获取待审核文章列表
 * @param parent
 */
export const getAuditList = (parent: any) => http.post(baseURL + 'getAuditList', parent);

/**
 * 提交审核
 * @param parent
 */
export const audit = (parent: any) => http.post(baseURL + 'audit', parent);

/**
 * 获取文章详情-审核专用
 * @param parent
 */
export const detailAudit = (parent: any) => http.post('/blog/blogPost/detailAudit', parent);
