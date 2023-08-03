import * as postsApi from "@/api/posts.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async fetchPosts({ commit, getters }, query) {
    try {
      const currentPosts = getters.getAllPosts;
      if (Object.keys(currentPosts).length > 0) return;
      query = { limit: 8, skip: 0, ...query };
      const data = await postsApi.fetchPosts(query);

      commit("setPosts", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchMorePosts({ commit }, query) {
    try {
      query = { limit: 5, ...query };
      const data = await postsApi.fetchPosts(query);

      commit("addToPosts", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchOnePost({ commit }, id) {
    try {
      const data = await postsApi.fetchOnePost(id);

      commit("setCurPost", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchRecentPosts({ commit }) {
    try {
      const data = await postsApi.fetchRecentPosts();

      commit("setRecentPosts", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchPopularPosts({ commit }) {
    try {
      const data = await postsApi.fetchPopularPosts();

      commit("setPopularPosts", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async fetchRecommendedPosts({ commit }) {
    try {
      const data = await postsApi.fetchRecommendedPosts();

      commit("setRecommendedPosts", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async createPost({ commit }, payload) {
    try {
      if (Object.keys(payload).length < 1) return;
      const data = await postsApi.createPost(payload);

      commit("createPost", { ...data.data.data });
      Alert("success", "发布成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async editPost({ commit }, { postId, postData }) {
    if (Object.keys(postData).length < 1) return;

    try {
      const data = await postsApi.editPost({
        postId,
        postData: { ...postData },
      });

      commit("editPost", { postId, data: data.data.data });
      Alert("success", "编辑成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async setPinnedPost({ commit }, { postId, pinned }) {
    try {
      await postsApi.editPost({ postId, postData: { pinned } });
      commit("setPinnedPost", { postId, pinned });
      Alert("success", `post ${pinned ? "收藏" : "取消收藏"}成功`, 1000);
    } catch (err) {
      console.log(err);
      Alert("error", "服务异常", 1000);
    }
  },
  async deletePost({ commit }, id) {
    commit("deletePost", id);
    try {
      await postsApi.deletePost(id);
      Alert("success", "文章删除成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  resetCurPost({ commit }) {
    commit("resetCurPost");
  },
};
