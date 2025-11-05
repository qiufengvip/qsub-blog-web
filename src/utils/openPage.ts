/**
 * 打开文章页面
 * @param postId 文章id
 */
export const openPost = (postId: number) => {
  if (postId > 0) {
    window.open(`/post/${postId}`);
  } else {
    if (postId === -1) {
      // 留言板
      window.open(`/board`);
    }
    if (postId === -2) {
      // 朋友
      window.open(`/friend`);
    }
    if (postId === -3) {
      // 关于
      window.open(`/about`);
    }
  }
};

/**
 * 打开标签时间线
 * @param labelId 标签id
 */
export const openLabelTImeLine = (labelId: number) => {
  if (labelId) {
    window.open(`/labelTimeline/${labelId}`);
  }
};

/**
 * 打开搜索
 * @param word 搜索关键词
 */
export const openSearch = (word: string) => {
  if (word) {
    window.open(`/search/${word}`);
  }
};

/**
 * 打开一个完整链接
 * @param uri
 */
export const openLink = (uri: string) => {
  if (uri) {
    window.open(`${uri}`);
  }
};

export const openRouter = (uri: string) => {
  console.log(uri);
  window.location.href = uri;
};
