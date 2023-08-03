import { api } from "./API.js";
import { formatFilter } from "./apiFeatures.js";

export const fetchProducts = (query) => {
  if (query && Object.keys(query).length > 0) query = formatFilter(query);
  return api(`/api/v1/product`, {
    method: "GET",
    params: {
      query,
    },
  });
};

export const fetchOneProduct = (productId) => {
  return api(`/api/v1/product/${productId}`, {
    method: "GET",
  });
};

export const fetchRelatedToCurrentProduct = ({ type, category, id }) => {
  let query = {
    type: { eq: type },
    category: { eq: category },
    id: { ne: id },
  };
  return api(`/api/v1/product/get-related-to-current-product`, {
    method: "GET",
    params: {
      query,
    },
  });
};

export const deleteProduct = (productId) => {
  return api(`/api/v1/product/${productId}`, {
    method: "Delete",
  });
};

export const fetchNewlyAddedProducts = () => {
  return api("/api/v1/product/get-newly-added-products", {
    method: "GET",
  });
};

export const fetchTrendyProducts = () => {
  return api("/api/v1/product/get-trendy-products", {
    method: "GET",
  });
};

export const fetchRecommendedProducts = () => {
  return api("/api/v1/product/get-recommended-products", {
    method: "GET",
  });
};

export const createProduct = (data) => {
  return api("/api/v1/product", {
    method: "POST",
    data,
  });
};

export const editProduct = ({ productId, productData }) => {
  return api(`/api/v1/product/${productId}`, {
    method: "PATCH",
    data: productData,
  });
};

export const addPropertyToProduct = ({ id, property }) => {
  const data = new FormData();

  for (const prop in property.images) {
    data.append(`images`, property.images[prop]);
  }

  property.sizes.forEach((item, index) => {
    data.append(`sizes[${index}][size]`, item.size);
    data.append(`sizes[${index}][quantity]`, item.quantity);
  });

  delete property.images;
  delete property.sizes;

  for (const prop in property) {
    data.append(prop, property[prop]);
  }

  return api(`/api/v1/product/add-property/${id}`, {
    method: "PATCH",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateProperty = ({ id, property }) => {
  const data = new FormData();
  if (property.images)
    for (const prop in property.images) {
      data.append(`images`, property.images[prop]);
    }

  property.sizes.forEach((item, index) => {
    data.append(`sizes[${index}][size]`, item.size);
    data.append(`sizes[${index}][quantity]`, item.quantity);
  });

  delete property.images;
  delete property.sizes;

  for (const prop in property) {
    data.append(prop, property[prop]);
  }

  return api(`/api/v1/product/update-property/${id}`, {
    method: "PATCH",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProperty = ({ id, propertyName }) => {
  return api(`/api/v1/product/delete-property/${id}/${propertyName}`, {
    method: "DELETE",
  });
};
