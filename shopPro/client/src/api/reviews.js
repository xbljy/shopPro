import { api } from "./API.js";

export const createReview = ({ data, productId }) => {
  return api(`/api/v1/reviews?product=${productId}`, {
    method: "POST",
    data,
  });
};

export const fetchReviewsForProduct = (productId) => {
  return api(`/api/v1/reviews/get-product-reviews/${productId}`, {
    method: "GET",
  });
};

export const getOneReview = (reviewId) => {
  return api(`/api/v1/reviews/${reviewId}`, {
    method: "GET",
  });
};

export const updateReview = (reviewId, data) => {
  return api(`/api/v1/reviews/${reviewId}`, {
    method: "PATCH",
    data,
  });
};

export const deleteMyReview = (reviewId) => {
  return api(`/api/v1/reviews/${reviewId}`, {
    method: "DELETE",
  });
};

export const fetchMyReviews = () => {
  return api(`/api/v1/reviews/get-my-reviews`, {
    method: "GET",
  });
};

export const deleteAllReviews = () => {
  return api(`/api/v1/reviews`, {
    method: "DELETE",
  });
};

export const fetchAllReviews = () => {
  return api(`/api/v1/reviews`, {
    method: "GET",
  });
};
