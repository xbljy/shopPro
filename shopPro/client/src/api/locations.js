import { api } from "./API.js";

export const createLocation = (data) => {
  return api("/api/v1/location", {
    method: "POST",
    data,
  });
};

export const getAllLocations = () => {
  return api(`/api/v1/location`, {
    method: "GET",
  });
};

export const deleteAllLocations = () => {
  return api(`/api/v1/location`, {
    method: "DELETE",
  });
};

export const getOneLocation = (id) => {
  return api(`/api/v1/location/${id}`, {
    method: "GET",
  });
};

export const updateLocation = (id, data) => {
  return api(`/api/v1/location/${id}`, {
    method: "PATCH",
    data,
  });
};

export const deleteOneLocation = (id) => {
  return api(`/api/v1/location/${id}`, {
    method: "DELETE",
  });
};
