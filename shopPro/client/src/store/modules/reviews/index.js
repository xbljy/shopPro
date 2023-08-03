import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

export default {
  namespaced: true,
  state() {
    return {
      allReviews: {}, // 所有商品的评论
      currentReviews: {}, // 当前商品的评论
      myReviews: {},
      currentReview: {},
    };
  },
  actions,
  mutations,
  getters,
};
