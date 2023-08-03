import { api } from "./API.js";

export const register = (data) => {
  return api("/api/v1/users/signup", {
    method: "POST",
    data,
  });
};

export const login = (data) => {
  return api("/api/v1/users/login", {
    method: "POST",
    data,
  });
};

export const logout = () => {
  return api("/api/v1/users/logout");
};

export const myAccount = () => {
  return api("/api/v1/users/me", {
    method: "GET",
  });
};

export const isLoggedIn = () => {
  return api("/api/v1/users/is-logged-in", {
    method: "GET",
  });
};

export const updateUserData = (userData) => {
  const data = new FormData();
  for (const prop in userData) {
    data.set(prop, userData[prop]);
  }
  return api(`/api/v1/users/updateMe`, {
    method: "patch",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

export const updateMyPassword = (data) => {
  return api(`/api/v1/users/updateMyPassword`, {
    method: "patch",
    data,
  });
};
