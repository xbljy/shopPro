import * as wishlistApi from "@/api/wishlist.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async fetchWishlist({ commit }) {
    try {
      const wishlist = await wishlistApi.getWishlist();
      commit("setWishlist", wishlist.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async addToWishList({ commit }, product) {
    try {
      await wishlistApi.addToWishList(product.id);
      commit("addToWishList", product);
      Alert("success", "已加入喜欢列表");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteWishitem({ commit }, productId) {
    try {
      if (!productId) return;
      await wishlistApi.deleteWishitem(productId);
      commit("deleteWishitem", productId);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteWishlist({ commit, getters }) {
    try {
      if (getters.getNumOfWishtems < 1) return;
      await wishlistApi.deleteWishlist();
      commit("deleteWishlist");
      Alert("success", "删除成功");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteItemsWithIds({ commit }, ids) {
    try {
      if (ids.length < 1) return;
      await wishlistApi.deleteItemsWithIds(ids);
      commit("deleteItemsWithIds", ids);
      Alert("success", "删除成功");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
};
