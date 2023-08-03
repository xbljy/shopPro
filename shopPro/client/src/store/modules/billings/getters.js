export default {
  getMyBillings(state) {
    return state.myBillings;
  },
  getAllBillings(state) {
    return state.allBillings;
  },

  getNumberOfAllBillingsForAdmin(state) {
    return state.allBillings.length;
  },

  getNumberOfMyBillings(state) {
    return state.myBillings.length;
  },
};
