export default {
  setAllBillings(state, billings) {
    state.allBillings = billings;
  },
  setMyBillings(state, billings) {
    state.myBillings = billings;
  },
  addToAllBillings(state, billings) {
    state.allBillings.push(...billings);
  },
  addToMyBillings(state, billings) {
    state.myBillings.push(...billings);
  },
};
