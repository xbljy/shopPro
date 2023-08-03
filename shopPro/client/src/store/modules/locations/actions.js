import * as locationsApi from "@/api/locations.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async createLocation({ commit }, locationData) {
    try {
      const location = await locationsApi.createLocation(locationData);

      commit("addToLocations", location.data.data);
      Alert("success", "创建成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async fetchLocations({ commit }) {
    try {
      const locations = await locationsApi.getAllLocations();
      commit("setLocations", locations.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async deleteAllLocations({ commit }) {
    try {
      await locationsApi.deleteAllLocations();

      commit("deleteAllLocations");
      Alert("success", "删除成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async getOneLocation({ commit }, locationId) {
    try {
      const location = await locationsApi.getOneLocation(locationId);

      commit("setCurrentLocation", location.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async deleteOneLocation({ commit }, locationId) {
    try {
      await locationsApi.deleteOneLocation(locationId);

      commit("deleteOneLocation", locationId);
      Alert("success", "删除成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async updateLocation({ commit }, { locationId, locationData }) {
    try {
      const updatedLocation = await locationsApi.updateLocation(
        locationId,
        locationData
      );

      commit("updateLocation", updatedLocation.data.data);
      Alert("success", "修改成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
};
