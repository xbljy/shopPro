export default {
  setUserData(state, payload) {
    state.user = payload;
    state.isUserExists = true;
  },
  setFullUserData(state, payload) {
    state.fullUserData = payload;
    state.isUserExists = true;
  },
  updateUserData(state, payload) {
    for (const prop in payload) {
      if (prop !== "photo") state.user[prop] = payload[prop];
    }
  },

  resetUserData(state) {
    for (const prop in state.user) {
      delete state.user[prop];
    }

    for (const prop in state.fullUserData) {
      delete state.fullUserData[prop];
    }
    state.isUserExists = false;
  },
};
