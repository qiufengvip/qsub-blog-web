import { User } from '@/utils/interface/base';

export interface BlogComment {
  /**
   * 评论id
   */
  id: number;
  /**
   * 用户id
   */
  userId: number;
  /**
   * 文章或栏目id
   */
  postId: number;
  /**
   * 父评论id
   */
  parentId: number;
  /**
   * 评论分片id
   */
  packetId: number;
  /**
   * 评论内容
   */
  content: string;
  /**
   * 评论时间
   */
  createTime: string;
  /**
   * 归属地
   */
  ipPlace: string;
  /**
   * 当前用户信息
   */
  user: User;
  /**
   * 父节点用户信息
   */
  parentUser: User;
}
