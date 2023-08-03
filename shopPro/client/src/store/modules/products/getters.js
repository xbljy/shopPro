export default {
  getProducts(state) {
    return state.products;
  },
  getNumberOfProductsForAdmin(state) {
    return Object.keys(state.products).length;
  },
  getFruitProducts(state) {
    return state.fruitProducts;
  },
  getSeafoodProducts(state) {
    return state.seafoodProducts;
  },
  getMeatProducts(state) {
    return state.meatProducts;
  },
  getFrozenfoodProducts(state) {
    return state.frozenfoodProducts;
  },
  getVegetablesProducts(state) {
    return state.vegetablesProducts;
  },
  getAccessoriesProducts(state) {
    return state.accessoriesProducts;
  },
  getNumberOfProductsInCollection(state) {
    return (category) => Object.keys(state[`${category}Products`]).length;
  },
  getOneProduct(state) {
    return (id) => {
      return state.products[id];
    };
  },
  getCurProduct(state) {
    return state.curProduct;
  },
  getNewlyAddedProducts(state) {
    return state.newlyAddedProducts;
  },

  getRecommendedProducts(state) {
    return state.recommendedProducts;
  },

  getTrendyProducts(state) {
    return state.trendyProducts;
  },
  getRelatedToCurrentProduct(state) {
    return state.relatedToCurrentProduct;
  },
  getPropertiesOfProduct(state) {
    return (id) => {
      if (id && state.products[id] && state.products[id].properties)
        return state.products[id].properties;
    };
  },
  getTypes(state) {
    return (category) => {
      category = state.collectionMap[category];
      return state.collections[category].types;
    }
  },

  getTags(state) {
    return (category) => {
      category = state.collectionMap[category];
      return state.collections[category].tags;
    }
  },
  getSizes(state) {
    return (category) => {
      let sizes = [];

      if (category == "shoes") sizes = state.sizes["numericalSizes"];
      else if (category == "accessories" || category == "bags") sizes = [];
      else if (category == "kids")
        sizes = [...state.sizes["kidsSizes"], ...state.sizes["numericalSizes"]];
      else {
        sizes = [...state.sizes["sizes"], ...state.sizes["numericalSizes"]];
      }

      return sizes;
    };
  },
  getIsloading(state) {
    return state.isLoading;
  },
  getFilterQuery(state) {
    return (category) => state.filterQuery[category];
  },
  getProperties(state) {
    return state.properties;
  },
  getCategory(state) {
    return state.category
  }
};
