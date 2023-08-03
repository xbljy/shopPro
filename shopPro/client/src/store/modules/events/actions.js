import * as eventsApi from "@/api/events.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async createEvent({ commit }, eventData) {
    try {
      const newEventData = await eventsApi.createEvent(eventData);
      commit("createEvent", newEventData.data.data);
      Alert("success", "创建成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteOneEvent({ commit }, eventId) {
    commit("deleteOneEvent", eventId);
    try {
      await eventsApi.deleteOneEvent(eventId);
      Alert("success", "删除成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async fetchEvents({ commit }) {
    try {
      const events = await eventsApi.getAllEvents();
      commit("setEvents", events.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  async fetchCurrentEvent({ commit }, eventId) {
    try {
      const event = await eventsApi.getOneEvent(eventId);
      console.log(event);
      commit("setCurrentEvent", event.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async updateOneEvent({ commit }, { eventId, updatedEventData }) {
    try {
      const updatedEvent = await eventsApi.updateOneEvent(
        eventId,
        updatedEventData
      );

      commit("updateOneEvent", updatedEvent.data.data);
      Alert("success", "修改成功", 1000);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
};
