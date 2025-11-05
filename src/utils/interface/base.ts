export interface UserLogin {
  userName: string; // 用户名 手机号 邮箱
  password: string; // 密码
  verify: string; //验证码
}

export interface UserSingIn {
  nickname: string; // 昵称
  userName: string; // 用户名
  mail: string; // 邮箱
  verify: string; // 验证码
  mailVerify: string; //邮箱验证码
  password: string; // 密码
  confirmPassword: string; // 确认密码
}

export interface User {
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 是否删除
   */
  deleted: boolean;
  /**
   * 邮箱
   */
  email: string;
  gitee: string;
  github: string;
  /**
   * 头像
   */
  avatar: string;
  id: number;
  /**
   * 注册ip
   */
  ip: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 排序
   */
  rn: string;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 生日
   */
  birthday: string;

  /**
   * 性别
   */
  gender: number;

  /**
   * 免审核
   */
  auditFree: number;

  /**
   * 个性签名
   */
  motto: string;

  /**
   * 用户积分
   */
  score: number;
  /**
   * 封禁到期时间
   */
  blockedTime: string;
  /**
   * 最后一次到期时间
   */
  lastLoginTime: string;

  /**
   * 注册日期
   */
  createTime: string;
}
