import { api } from "./API.js";

export const fetchPosts = (query) => {
  return api(`/api/v1/posts?sort=-createdAt`, {
    method: "GET",
    params: { query },
  });
};

export const fetchOnePost = (id) => {
  return api(`/api/v1/posts/${id}`, {
    method: "GET",
  });
};

export const deletePost = (id) => {
  return api(`/api/v1/posts/${id}`, {
    method: "DELETE",
  });
};

export const createPost = (data) => {
  const form = new FormData();

  for (const prop in data.images) {
    form.append(`images`, data.images[prop]);
  }

  form.append("coverImage", data.coverImage[0]);

  delete data.images;
  delete data.coverImage;
  for (const prop in data) {
    form.append(prop, data[prop]);
  }
  return api("/api/v1/posts", {
    method: "POST",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editPost = ({ postId, postData }) => {
  const form = new FormData();

  if (postData.images && postData.images.length !== 0) {
    for (const prop in postData.images) {
      form.append("images", postData.images[prop]);
    }
  }

  if (postData.coverImage && postData.coverImage.length !== 0) {
    form.append("coverImage", postData.coverImage[0]);
  }

  if (postData.images) delete postData.images;
  if (postData.coverImage) delete postData.coverImage;

  for (const prop in postData) {
    form.append(prop, postData[prop]);
  }
  return api(`/api/v1/posts/${postId}`, {
    method: "PATCH",
    data: form,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const fetchRecentPosts = () => {
  return api(
    `/api/v1/posts?sort=-publishedAt&limit=6&fields=pinned,id,publisher,summary,title,coverImage,createdAt`,
    {
      method: "GET",
    }
  );
};

export const fetchPopularPosts = () => {
  return api(
    `/api/v1/posts?limit=6&fields=pinned,id,publisher,summary,title,coverImage,createdAt`,
    {
      method: "GET",
    }
  );
};

export const fetchRecommendedPosts = () => {
  return api(
    `/api/v1/posts?sort=publishedAt&limit=6&fields=pinned,id,publisher,summary,title,coverImage,createdAt`,
    {
      method: "GET",
    }
  );
};
