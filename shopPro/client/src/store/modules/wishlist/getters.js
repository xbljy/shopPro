export default {
  getMyWishlist(state) {
    return state.wishlist;
  },
  getNumOfWishtems(state) {
    return Object.keys(state.wishlist).length;
  },
};
