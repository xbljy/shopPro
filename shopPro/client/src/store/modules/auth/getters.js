export default {
  getUserData(state) {
    return state.user;
  },
  getUserId(state) {
    return state.user.id;
  },
  isUserExists(state) {
    return state.isUserExists;
  },
  isUserAdmin(state) {
    console.log(state, "9999999")
    return state.user.role == "admin";
  },
};
