import * as reviewsApi from "@/api/reviews.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async fetchAllReviews({ commit }) {
    try {
      const reviews = await reviewsApi.fetchAllReviews();

      commit("setAllReviews", reviews.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchMyReviews({ commit }) {
    try {
      const reviews = await reviewsApi.fetchMyReviews();

      commit("setMyReviews", reviews.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async createReview({ commit }, { data, productId }) {
    try {
      console.log(data, productId);
      const review = await reviewsApi.createReview({ data, productId });
      console.log(review);
      commit("addReview", review.data.data);
      Alert("success", "创建成功");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchReviewsForProduct({ commit }, productId) {
    try {
      const reviews = await reviewsApi.fetchReviewsForProduct(productId);

      commit("setReviewsForCurrentProduct", reviews.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchOneReview({ commit }, reviewId) {
    try {
      const review = await reviewsApi.getOneReview(reviewId);

      commit("setCurrentReview", review.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async updateReview({ commit }, { reviewId, data }) {
    try {
      const newReview = await reviewsApi.updateReview(reviewId, data);

      commit("updateReview", newReview);
      Alert("success", "修改成功");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async deleteMyReview({ commit }, reviewId) {
    try {
      await reviewsApi.deleteMyReview(reviewId);

      commit("deleteOneReview", reviewId);
      Alert("success", "删除成功");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteAllReviews({ commit }) {
    try {
      await reviewsApi.deleteAllReviews();
      commit("deleteAllReviews");
      Alert("success", "删除成功");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
};
