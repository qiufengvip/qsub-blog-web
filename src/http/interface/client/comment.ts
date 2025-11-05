import http from '../../http';

const baseURL = '/blog/comment/';
const clientURL = '/client/comment/';

/**
 * 发布评论
 * @param parent
 */
export const send = (parent: any) => http.post(baseURL + 'send', parent);

/**
 * 获取评论分页列表
 * @param parent
 */
export const getCommentList = (parent: any) => http.post(clientURL + 'getCommentList', parent);

/**
 * 获取评论分页列表
 * @param parent
 */
export const getCommentPacketList = (parent: any) => http.post(clientURL + 'getCommentPacketList', parent);
