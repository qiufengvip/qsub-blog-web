export interface BlogPostStats {
  // 喜欢数量
  likeNumber: number;
  // 浏览数量
  viewNumber: number;
}

export interface BlogPostSketch {
  //文章id
  id: number;
  // 发布用户id
  userId: number;
  // 发布用户名称
  userName: string;
  // 发布时间
  createTime: string;
  // 文章标题
  title: string;
  // 文章缩略图
  postImg: string | undefined;
  // 副标题
  subtitle: string;
  // 栏目id
  resourceId: number;
  // 栏目名称
  resourceName: string;
  // 统计信息
  stats: BlogPostStats;
}
