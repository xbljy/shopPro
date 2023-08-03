export default {
  setProductsForAdmin(state, payload) {
    payload.forEach((product) => {
      state.products[product.id] = product;
    });
  },
  clearProductsForAdmin(state) {
    for (const productId in state.products) {
      delete state.products[productId];
    }
  },
  addToProductsForAdmin(state, payload) {
    payload.forEach((product) => {
      state.products[product.id] = product;
    });
  },

  clearDataForCollection(state, collection) {
    for (const productId in state[collection]) {
      delete state[collection][productId];
    }
  },

  setProductsInCollection(state, { products, collection }) {
    products.forEach((product) => {
      state[collection][product.id] = product;
    });
  },
  setCountOfProducts(state, { category, count }) {
    state.productsMetadata[category].maxCount = count;
  },
  addToProducts(state, { data, category }) {
    data.forEach((product) => {
      state[`${category}Products`][product.id] = product;
    });
  },
  setRelatedToCurrentProduct(state, { products, id }) {
    state.relatedToCurrentProduct = {};

    products.forEach((product) => {
      if (product.id !== id)
        state.relatedToCurrentProduct[product.id] = product;
    });
  },
  addProduct(state, payload) {
    state.products[payload.id] = payload;
  },
  deleteProduct(state, id) {
    delete state.products[id];
  },
  updateProductData(state, { id, product }) {
    state.products[id] = product;
  },

  deletePropertyOfProduct(state, { id, propertyName }) {
    const index = state.products[id].properties.findIndex(
      (property) => property.propertyName == propertyName
    );
    if (index > -1) state.products[id].properties.splice(index, 1);
  },
  setCurProduct(state, product) {
    state.curProduct = product;
  },
  resetCurProduct(state) {
    state.curProduct = {};
  },
  setNewlyAddedProdcuts(state, payload) {
    payload.forEach((product) => {
      state.newlyAddedProducts[product.id] = product;
    });
  },
  setRecomendedProducts(state, payload) {
    payload.forEach((product) => {
      state.recommendedProducts[product.id] = product;
    });
  },
  setTrendyProducts(state, payload) {
    payload.forEach((product) => {
      state.trendyProducts[product.id] = product;
    });
  },

  setFilterQuery(state, payload) {
    state.filterQuery = payload;
  },
  updateOneQuery(state, { category, payload }) {
    const prop = Object.keys(payload)[0];
    state.filterQuery[category][prop] = payload[prop];
  },
  resetFilterQuery(state, category) {
    console.log(category);
    state.filterQuery[category] = {
      age_group: "",
      gender: "",
      sizes: [],
      sort: "",
      types: [],
      price: [0, 1000],
      properties: [],
      category,
      limit: 10,
    };
  },
};
