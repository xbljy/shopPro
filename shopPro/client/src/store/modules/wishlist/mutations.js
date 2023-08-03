export default {
  setWishlist(state, payload) {
    payload.forEach((wishitem) => {
      if (
        wishitem.product &&
        wishitem.product.id &&
        !state.wishlist[wishitem.product.id]
      ) {
        state.wishlist[wishitem.product.id] = wishitem.product;
      }
    });
  },
  addToWishList(state, product) {
    state.wishlist[product.id] = product;
  },
  deleteWishitem(state, productId) {
    delete state.wishlist[productId];
  },
  deleteWishlist(state) {
    state.wishlist = {};
  },
  deleteItemsWithIds(state, ids) {
    for (const id in ids) {
      if (state.wishlist[id]) delete state.wishlist[id];
    }
  },
};
