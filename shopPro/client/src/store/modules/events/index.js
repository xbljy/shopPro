import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default {
  namespaced: true,
  state() {
    return {
      events: {},
      currentEvent: {},
    };
  },
  getters,
  mutations,
  actions,
};
