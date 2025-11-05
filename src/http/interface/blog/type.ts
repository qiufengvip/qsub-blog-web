// 封装后台接口方法
import http from '../../http';

///////客户端

/**
 * 资源列表
 * @param params
 */
export const getTree = () => http.get('/blog/type/getTree');

/**
 * 新增或更新
 * @param params
 */
export const saveOrUpdate = (params: any) => http.post('/blog/type/saveOrUpdate', params);
/**
 * 获取实体
 * @param params
 */
export const detail = (params: any) => http.post('/blog/type/detail', { id: params });
/**
 * 删除
 */
export const deletedType = (params: any) => http.post('/blog/type/deleted', { ids: params });
