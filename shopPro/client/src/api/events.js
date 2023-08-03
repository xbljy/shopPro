import { api } from "./API.js";

export const getAllEvents = () => {
  return api(`/api/v1/events`, {
    method: "GET",
  });
};

export const getOneEvent = (eventId) => {
  console.log(eventId);
  return api(`/api/v1/events/${eventId}`, {
    method: "GET",
  });
};

export const updateOneEvent = (eventId, updatedEventData) => {
  const form = new FormData();
  console.log(updatedEventData);
  if (updatedEventData.coverImage && updatedEventData.coverImage.length > 0) {
    form.append("coverImage", updatedEventData.coverImage[0]);
  }
  delete updatedEventData.coverImage;

  for (const prop in updatedEventData) {
    form.append(prop, updatedEventData[prop]);
  }
  return api(`/api/v1/events/${eventId}`, {
    method: "PATCH",
    data: form,
  });
};

export const createEvent = (eventData) => {
  const form = new FormData();

  form.append("coverImage", eventData.coverImage[0]);
  delete eventData.coverImage;

  for (const prop in eventData) {
    form.append(prop, eventData[prop]);
  }
  return api(`/api/v1/events`, {
    method: "POST",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteOneEvent = (eventId) => {
  return api(`/api/v1/events/${eventId}`, {
    method: "DELETE",
  });
};
