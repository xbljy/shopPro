import { api } from "./API.js";

export const getMyBag = () => {
  return api("/api/v1/bag", {
    method: "GET",
  });
};

export const getOneCard = (cardId) => {
  return api(`/api/v1/bag/${cardId}`, {
    method: "GET",
  });
};

export const updateCard = (cardId, data) => {
  console.log(data);
  return api(`/api/v1/bag/${cardId}`, {
    method: "PATCH",
    data,
  });
};

export const addToBag = ({ productId, size, property, numberOfOrders = 1 }) => {
  return api(`/api/v1/product/${productId}/bag`, {
    method: "POST",
    data: {
      size,
      property,
      numberOfOrders,
    },
  });
};

export const deleteCard = (cardId) => {
  return api(`/api/v1/bag/${cardId}`, {
    method: "DELETE",
  });
};

export const deleteBag = () => {
  return api(`/api/v1/bag`, {
    method: "DELETE",
  });
};

export const deleteItemsWithIds = (ids) => {
  console.log(ids);
  return api("api/v1/bag/delete-by-ids", {
    method: "DELETE",
    data: { ids },
  });
};

export const makeCardsPaid = (ids) => {
  return api("api/v1/bag/make-cards-paid", {
    method: "PATCH",
    data: { ids },
  });
};
