import * as billingsApi from "@/api/billings.js";
import { Alert } from "@/utils/Alert.js";
export default {
  async fetchMyBillings({ commit }, query) {
    try {
      const myBillings = await billingsApi.fetchMyBillings(query);
      commit("setMyBillings", myBillings.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchAllBillings({ commit }, query) {
    try {
      const billings = await billingsApi.fetchAllBillings(query);

      commit("setAllBillings", billings.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchMoreBillingsForAdmin({ commit }, query) {
    try {
      const data = await billingsApi.fetchAllBillings(query);
      commit("addToAllBillings", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async fetchMoreBillingsForUser({ commit }, query) {
    try {
      const data = await billingsApi.fetchMyBillings(query);
      commit("addToMyBillings", data.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
};
