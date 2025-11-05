import { RouteRecordRaw } from 'vue-router';

//客户端

//服务端
const adminRoutes = [
  {
    path: '/admin/authority', //权限管理
    name: 'authority',
    component: () => import('../views/admin/base/authority/index.vue'),
  },
  {
    path: '/admin/constantList', //系统变量
    name: 'constant',
    component: () => import('../views/admin/base/constant/index.vue'),
  },
  {
    path: '', //首页
    name: '首页',
    component: () => import('../views/admin/base/home/index.vue'),
    meta: {
      isDefault: true,
      tagName: '首页',
    },
  },

  {
    path: '/admin/labelList', //标签管理
    name: 'labelList',
    component: () => import('@/views/admin/blog/labelList/index.vue'),
  },
  {
    path: '/admin/resource', //资源管理
    name: 'resource',
    component: () => import('../views/admin/base/resource/index.vue'),
  },
  {
    path: '/admin/roleList', //角色管理
    name: 'role',
    component: () => import('../views/admin/base/role/index.vue'),
  },
  {
    path: '/admin/signup', //注册
    name: 'signup',
    component: () => import('../views/admin/base/signup/index.vue'),
  },
  {
    path: '/admin/site', //站点属性
    name: 'site',
    component: () => import('../views/admin/base/site/index.vue'),
  },
  {
    path: '/admin/user', //用户管理
    name: 'user',
    component: () => import('../views/admin/base/user/index.vue'),
  },
  {
    path: '/admin/setting', //个人信息管理
    name: '我的',
    component: () => import('../views/admin/base/setting/index.vue'),
  },

  {
    path: '/admin/postList', //文章管理
    name: '文章管理',
    component: () => import('../views/admin/blog/postList/index.vue'),
  },
  {
    path: '/admin/postAdd/:id', //添加文章
    name: '添加文章',
    component: () => import('@/views/admin/blog/postEdit/index.vue'),
  },
  {
    path: '/admin/typeList', //分类管理
    name: 'typeList',
    component: () => import('../views/admin/blog/type/index.vue'),
  },
  {
    path: '/admin/commentList', //评论管理
    name: '评论管理',
    component: () => import('../views/admin/blog/commentList/index.vue'),
  },
  {
    path: '/admin/postAudit', //文章审核
    name: 'postAudit',
    component: () => import('../views/admin/blog/postAudit/index.vue'),
  },
  {
    path: '/admin/linkList', //友链管理
    name: 'linkList',
    component: () => import('../views/admin/blog/linkList/index.vue'),
  },
];

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)', // 404 页面
    name: '/404',
    component: () => import('../views/404.vue'),
  },
  {
    path: '/admin/login', //后端登录
    name: 'adminLogin',
    component: () => import('../views/admin/base/signup/index.vue'),
  },
  {
    path: '/', //客户端首页
    component: () => import('../views/client/main/index.vue'),
    // children: clientRoutes,
  },
  {
    path: '/admin', // 后端首页
    component: () => import('../views/admin/main/index.vue'),
    children: adminRoutes,
  },
  {
    path: '/post/:id', // 文章
    name: 'post',
    component: () => import('../views/client/post/index.vue'),
  },
  {
    path: '/test', // 监管测试
    name: 'test',
    component: () => import('../views/client/posts/index.vue'),
  },
  {
    path: '/catalog/:id', //分类专栏
    name: 'catalog',
    component: () => import('../views/client/catalog/index.vue'),
  },
  {
    path: '/label', //标签云
    name: 'label',
    component: () => import('@/views/client/label/index.vue'),
  },
  {
    path: '/friend', //标签云
    name: 'friend',
    component: () => import('@/views/client/friend/index.vue'),
  },
  {
    path: '/labelTimeline/:id', //标签时间线
    name: 'labelTimeline',
    component: () => import('@/views/client/labelTimeline/index.vue'),
  },
  {
    path: '/board', //留言板
    name: 'board',
    component: () => import('@/views/client/board/index.vue'),
  },
  {
    path: '/search/:word', //搜索结果
    name: 'search',
    component: () => import('@/views/client/search/index.vue'),
  },
  {
    path: '/about/', //关于
    name: 'about',
    component: () => import('@/views/client/about/index.vue'),
  },
];
export { adminRoutes };
export default routes;
