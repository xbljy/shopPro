import { api } from "./API.js";

export const addToWishList = (productId) => {
  return api(`/api/v1/product/${productId}/wishlist`, {
    method: "POST",
  });
};

export const getWishlist = () => {
  return api(`/api/v1/wishlist`, {
    method: "GET",
  });
};

export const deleteWishitem = (productId) => {
  return api(`/api/v1/wishlist/${productId}`, {
    method: "DELETE",
  });
};

export const deleteWishlist = () => {
  return api(`/api/v1/wishlist`, {
    method: "DELETE",
  });
};

export const deleteItemsWithIds = (ids) => {
  return api("api/v1/wishlist/delete-items-with-ids", {
    method: "DELETE",
    data: { ids: Object.keys(ids) },
  });
};
