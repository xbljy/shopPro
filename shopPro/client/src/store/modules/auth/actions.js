import {
  login,
  register,
  myAccount,
  isLoggedIn,
  updateUserData,
  updateMyPassword,
  logout,
} from "@/api/auth.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async register({ commit }, payload) {
    try {
      const userData = await register(payload);
      if (userData.data.status !== "success") return null;
      commit("setUserData", userData.data.data);
      Alert("success", "注册成功", 2000);
      return true;
    } catch (err) {
      Alert("error", err.message, 3000);
    }
  },

  async login({ commit }, payload) {
    try {
      const userData = await login(payload);
      if (userData.data.status !== "success") return null;

      commit("setUserData", userData.data.data);
      commit("wishlist/setWishlist", userData.data.data.wishlist, {
        root: true,
      });
      commit("bag/setBag", userData.data.data.bag, { root: true });
      Alert("success", "登录成功", 2000);
      return true;
    } catch (err) {
      Alert("error", "邮箱或密码错误", 3000);
    }
  },
  async getMyAccount({ commit }) {
    const userData = await myAccount();

    commit("setFullUserData", userData);
  },
  async autoLogin({ commit }) {
    try {
      const data = await isLoggedIn();

      if (data.data.currentUser) {
        commit("setUserData", data.data.currentUser);
        commit("wishlist/setWishlist", data.data.currentUser.wishlist, {
          root: true,
        });
        commit("bag/setBag", data.data.currentUser.bag, { root: true });
      }
    } catch (err) {
      return;
    }
  },

  async updateUserData({ commit }, payload) {
    try {
      commit("updateUserData", payload);

      const data = await updateUserData(payload);
      if (data.data.status == "success") {
        Alert("success", "修改成功", 2000);
      } else {
        Alert("error", "修改失败", 2000);
      }
    } catch (err) {
      Alert("error", "修改异常", 2000);
    }
  },

  async updateMyPassword(_, payload) {
    try {
      const data = await updateMyPassword(payload);
      if (data.data.status == "success") {
        Alert("success", "密码修改成功", 2000);
      } else {
        Alert("error", "密码修改失败", 2000);
      }
    } catch (err) {
      Alert("error", "密码修改异常", 2000);
    }
  },

  async logUserOut({ commit }) {
    try {
      await logout();

      commit("resetUserData");
    } catch (err) {
      Alert("error", "退出失败", 2000);
    }
  },
};
