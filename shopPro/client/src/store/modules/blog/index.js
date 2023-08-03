import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";
export default {
  namespaced: true,
  state() {
    return {
      posts: {},
      pinnedPosts: {},
      curPost: {},
      recentPosts: {},
      popularPosts: {},
      newlyAddedPosts: [],
      recommendedPosts: [],
    };
  },
  mutations,
  actions,
  getters,
};
