export enum BlogPostReleasesEnum {
  // 待提交
  WAIT_SUBMIT = 'WAIT_SUBMIT',
  // 待审核
  WAIT_AUDIT = 'WAIT_AUDIT',
  // 已通过
  AUDIT_PASS = 'AUDIT_PASS',
  // 未通过
  AUDIT_NOT_PASS = 'AUDIT_NOT_PASS',
}
export enum BlogPostStateEnum {
  //草稿
  DRAFT = 'DRAFT',
  // 发布
  RELEASE = 'RELEASE',
}

export interface BlogPost {
  id: string;
  /**
   * 标题
   */
  title: string;
  /**
   * 缩略图
   */
  postImg: string;
  /**
   * 资源id
   */
  resourceId: string;
  /**
   * 发布状态
   */
  state: BlogPostStateEnum;
  /**
   * 审核状态
   */
  releases: BlogPostReleasesEnum;
  /**
   * 副标题
   */
  subtitle: string;
  /**
   * 内容
   */
  content: string;
  /**
   * 标签idList
   */
  labelIdList: string[];
  /**
   * 审核记录
   */
  auditLogging: string;
}
