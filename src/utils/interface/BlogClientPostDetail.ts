export interface BlogClientPostDetail {
  id: number;
  userId: number;
  deleted: boolean | null;
  createTime: string;
  updateTime: string;
  state: string;
  releases: string;
  title: string;
  postImg: string;
  subtitle: string;
  content: string;
  resourceId: number;
  //审核记录
  auditLogging: string | null;
  labelList: string[] | null;
  user: User;
  stats: PostStats;
}

export interface User {
  // 用户信息
  id: number;
  // 昵称
  nickname: string;
  // 生日
  birthday: string | null;
  gender: number;
  /**
   * 座右铭
   */
  motto: string;
  score: number;
  status: string | null;
  email: string;
  phone: string;
  github: string | null;
  gitee: string | null;
  /**
   * 头像
   */
  avatar: string;
  // 统计
  stats: UserStats;
}
export interface UserStats {
  // 评论数
  commentNumber: number;
  // 发布文章数
  postNumber: number;
  // 获赞数
  praisedNumber: number;
}
export interface PostStats {
  // 喜欢数
  likeNumber: number;
  // 展示量
  viewNumber: number;
  // 评论数量
  commentNumber: number;
  // 字数统计
  contentNumber: number;
  // 阅读时长
  readingTime: string;
}
