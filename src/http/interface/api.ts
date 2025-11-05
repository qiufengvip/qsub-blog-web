// 封装后台接口方法
import http from '../http';

///////客户端
export const getIndexInfo = (params: any) => http.post('/blog/index/getIndexInfo', params); //首页信息

///////管理端

/**
 * 首页
 */
export const queryRuleResource = (params: any) => http.post('/base/Resource/getMenuData', { resourceType: params }); //查询用户的菜单
/**
 * 查询常量值
 */
export const selectConstantData: any = (params: any) => http.post('/base/constant/selectConstantData', params); //查询常量值

/**
 * 资源管理
 */
//资源列表
export const requestResourceGetResourceList = (params: any) => http.post('/base/Resource/getResourceList', params);
//添加资源
export const requestResourceSaveOrUpdate = (params: any) => http.post('/base/Resource/saveOrUpdate', params);
//删除资源
export const requestResourceDeletedById = (parent: any) => http.post('/base/Resource/deletedById', parent);
//移动资源顺序
export const requestResourceMobileData = (parent: any) => http.post('/base/Resource/mobileData', parent);
//查询某个资源下的所有资源
export const requestResourceGetSubset = (parent: any) => http.post('/base/Resource/getSubset', parent);
//缓存帖子
export const postSetCache = (parent: any) => http.post('/blog/BlogPosts/setPost', parent);
/**
 * 常量库管理
 * @param parent
 */

// 添加常量
export const requestConstantAdd = (parent: any) => http.post('/base/constant/addConstant', parent);
// 删除变量
export const requestConstantDelete = (parent: any) => http.post('/base/constant/deleteConstant', parent);
// 查询变量列表
export const requestConstantSelectList = (parent: any) => http.post('/base/constant/selectList', parent);
//查询常量值
export const requestConstantSelectData = (parent: any) => http.post('/base/constant/selectConstantData', parent);
// 添加常量值
export const requestConstantAddData = (parent: any) => http.post('/base/constant/data/addConstantData', parent);
// 删除变量值
export const requestConstantDeleteData = (parent: any) => http.post('/base/constant/data/deleteConstantData', parent);
/**
 * 站点配置管理
 */
// 配置项列表
export const requestConfigGetConfigList = (parent: any) => http.post('/SysConfig/getConfigList', parent);
// 添加或更新
export const requestConfigUpdateBlogConfig = (parent: any) => http.post('/SysConfig/saveOrUpdate', parent);
// 删除配置项
export const requestConfigDeletedBlogConfig = (parent: any) => http.post('/SysConfig/deleted', parent);
// 获取配置项信息
export const requestConfigGetConfigData = (parent: any) => http.post('/SysConfig/getConfigData', parent);
/**
 * 标签管理
 */
//获取标签列表
export const requestConfigGetLabelList = (parent: any) => http.post('/blog/BlogPostsLabel/getLabelList', parent);
//删除标签
export const requestConfigDeletedLabel = (parent: any) => http.post('/blog/BlogPostsLabel/deletedLabel', parent);
/**
 * 登录注册
 */
/**
 * 验证码
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requestGetVerifyCode = () => http.get('/base/getVerifyCode', { responseType: 'blob' });

/**
 * 验证码
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requestGetMailCode = (params: any) => http.post('/base/getMailCode', params);

/**
 * @desc 登录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requestLogin = (params: any) => http.post('/base/signIn', params);
/**
 * @desc 登录
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requestCheckLogin = () => http.get('/base/check');

/**
 * @desc 退出登录
 * @param params
 */
export const requestLogout = () => http.get('/base/logout');

/**
 * @desc 注册
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requestSignUp = (params: any) => http.post('/base/signUp', params);
/**
 * @desc 注册
 * @param params
 * @returns {Promise<AxiosResponse<T>>}
 */
export const requestSe = (params: any) => http.post('/base/sign', params);

/**
 * 角色管理
 * @returns {Promise<AxiosResponse<T>>}
 */
/**
 * @desc 添加角色
 * @param params
 */
export const requestRuleAddRole = (params: any) => http.post('/base/role/addRole', params);
//查询角色
export const requestRuleGetRoleList = (params: any) => http.post('/base/role/getRoleList', params);
//给角色添加资源
export const requestResourceRoleAddResource = (parent: any) => http.post('/base/RoleResource/roleAddResource', parent);
//查询角色拥有的资源id
export const requestResourceQueryRuleResource = (parent: any) => http.post('/base/RoleResource/queryRoleResource', parent);
//删除角色
export const requestRuleDeleted = (parent: any) => http.post('/base/role/deleted', parent);

/**
 * 人员管理
 */
export const requestUserGetUserList = (parent: any) => http.post('/base/user/getUserList', parent);
// 获取用户信息
export const requestUserGetUserInfo = (parent: any) => http.post('/base/user/getUserInfo', parent);
// 保存用户信息
export const requestUserUpdateUserInfo = (parent: any) => http.post('/base/user/updateUserInfo', parent);
//批量修改用户密码
export const requestUserUpdatePassword = (parent: any) => http.post('/base/user/updatePassword', parent);
//批量封禁用户
export const requestUserUpdateBanned = (parent: any) => http.post('/base/user/updateBanned', parent);
//批量解除封禁
export const requestUserUpdateLiftBanned = (parent: any) => http.post('/base/user/updateLiftBanned', parent);
//批量删除
export const requestUserRemove = (parent: any) => http.post('/base/user/remove', parent);

/**
 * 角色人员管理
 */
export const requestUserRoleGetUserRole = (parent: any) => http.post('/base/virtualUserRole/getUserRole', parent);
export const requestUserRoleUserRole = (parent: any) => http.post('/base/virtualUserRole/saveUserRole', parent);

/**
 * 文章分类管理
 * @param parent
 */
export const getTypeResources = () => http.get('/base/Resource/getTypeResources');

export const uploadFile = (parent: FormData) =>
  http.request({
    method: 'post',
    url: '/base/sysFile/upload',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: parent,
  });
