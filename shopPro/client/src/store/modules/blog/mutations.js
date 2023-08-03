export default {
  setPosts(state, posts) {
    state.posts = {};
    posts.forEach((item) => {
      state.posts[item.id] = item;
      if (item.pinned) state.pinnedPosts[item.id] = item;
    });
  },
  addToPosts(state, posts) {
    posts.forEach((item) => {
      state.posts[item.id] = item;
      if (item.pinned) state.pinnedPost = item;
    });
  },
  createPost(state, payload) {
    state.posts[payload.id] = payload;
  },
  setRecentPosts(state, posts) {
    state.recentPosts = posts;
  },
  setPopularPosts(state, posts) {
    state.popularPosts = posts;
  },
  setCurPost(state, post) {
    state.curPost = post;
  },
  resetCurPost(state) {
    state.curPost = {};
  },
  setPinnedPost(state, { postId, pinned }) {
    state.posts[postId].pinned = pinned;
    if (pinned) {
      state.pinnedPosts[postId] = state.posts[postId];
    } else {
      delete state.pinnedPosts[postId];
    }
  },
  setNewlyAddedPosts(state, posts) {
    state.newlyAddedPosts = posts;
  },
  setRecommendedPosts(state, posts) {
    state.recommendedPosts = posts;
  },
  editPost(state, { postId, data }) {
    state.posts[postId] = data;
  },
  deletePost(state, postId) {
    delete state.posts[postId];
  },
  deleteAllPosts(state) {
    state.posts = {};
  },
};
