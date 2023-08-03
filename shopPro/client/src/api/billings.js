import { api } from "./API.js";

export const createPayment = (cardIds) => {
  return api("/api/v1/billing/stripe", {
    method: "POST",

    data: { cardIds },
  });
};

export const fetchMyBillings = (query) => {
  return api("/api/v1/billing/get-my-billings", {
    method: "GET",
    params: { query },
  });
};

export const fetchAllBillings = (query) => {
  return api("/api/v1/billing", {
    method: "GET",
    params: { query },
  });
};
