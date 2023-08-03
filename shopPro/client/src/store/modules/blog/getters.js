export default {
  getAllPosts(state) {
    console.log(state.posts);
    return state.posts;
  },
  getNumberOfPosts(state) {
    return Object.keys(state.posts).length;
  },
  getOnePost(state) {
    return (id) => {
      if (id) return state.posts[id];
    };
  },
  getRecentPosts(state) {
    return state.recentPosts;
  },

  getPopularPosts(state) {
    return state.popularPosts;
  },
  getPinnedPosts(state) {
    return state.pinnedPosts;
  },
  getCurPost(state) {
    return state.curPost;
  },
  getNewlyAddedPosts(state) {
    return state.newlyAddedPosts;
  },
  getRecommendedPosts(state) {
    return state.recommendedPosts;
  },
};
