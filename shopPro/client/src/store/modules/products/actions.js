import * as productsApi from "@/api/products.js";
import { Alert } from "@/utils/Alert.js";

export default {
  async fetchProductsForAdmin({ commit }, query) {
    try {
      commit("clearProductsForAdmin");

      const data = await productsApi.fetchProducts(query);

      commit("setProductsForAdmin", data.data.data);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },
  async fetchMoreProductsForAdmin({ commit }, query) {
    try {
      const data = await productsApi.fetchProducts(query);
      commit("addToProductsForAdmin", data.data.data);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },
  async fetchMoreProducts({ commit, getters }, { itemsLength, category }) {
    try {
      const query = getters.getFilterQuery(category);
      const data = await productsApi.fetchProducts({
        ...query,
        skip: itemsLength,
      });

      commit("addToProducts", { data: data.data.data, category });
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async fetchProductsToCollection({ commit, getters }, collectionName) {
    try {
      const query = getters.getFilterQuery(collectionName);

      commit("clearDataForCollection", collectionName + "Products");
      const data = await productsApi.fetchProducts(query);

      commit("setProductsInCollection", {
        products: data.data.data,
        collection: collectionName + "Products",
      });
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async fetchOneProduct({ commit }, productId) {
    try {
      const data = await productsApi.fetchOneProduct(productId);

      commit("setCurProduct", data.data.data);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },
  async fetchRelatedToCurrentProduct({ commit }, { type, category, id }) {
    try {
      const products = await productsApi.fetchRelatedToCurrentProduct({
        type,
        category,
        id,
      });
      commit("setRelatedToCurrentProduct", {
        products: products.data.data,
        id,
      });
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async deleteProduct({ commit }, productId) {
    try {
      commit("deleteProduct", productId);

      await productsApi.deleteProduct(productId);

      Alert("success", "删除成功", 1000);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  resetCurProduct({ commit }) {
    commit("resetCurProduct");
  },

  async fetchNewlyAddedProducts({ commit }) {
    try {
      const data = await productsApi.fetchNewlyAddedProducts();

      commit("setNewlyAddedProdcuts", data.data.data);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },
  async fetchRecommendedProducts({ commit }) {
    try {
      const data = await productsApi.fetchRecommendedProducts();

      commit("setRecomendedProducts", data.data.data);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async fetchTrendyProducts({ commit }) {
    try {
      const data = await productsApi.fetchTrendyProducts();
      commit("setTrendyProducts", data.data.data);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },
  async createProduct({ commit }, payload) {
    try {
      const data = await productsApi.createProduct(payload);

      commit("addProduct", data.data.data);
      Alert("success", "创建成功", 1000);

      return data.data.data.id;
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },
  async addPropertyToProduct({ commit }, { id, property }) {
    try {
      console.log(property);
      const data = await productsApi.addPropertyToProduct({
        id,
        property,
      });

      commit("updateProductData", { id, product: data.data.product });

      Alert("success", "添加成功", 1000);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async editProduct({ commit }, { productId, updatedProductData }) {
    try {
      const data = await productsApi.editProduct({
        productId,
        productData: { ...updatedProductData },
      });
      commit("updateProductData", {
        id: productId,
        product: data.data.data,
      });
      Alert("success", "修改成功", 1000);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async deletePropertyOfProduct({ commit }, { id, propertyName }) {
    try {
      commit("deletePropertyOfProduct", { id, propertyName });

      await productsApi.deleteProperty({ id, propertyName });
      Alert("success", "删除成功", 1000);
    } catch (err) {
      Alert("error", err.message, 1000);
    }
  },

  async updatePropertyOfProduct({ commit }, { id, property }) {
    try {
      const newProduct = await productsApi.updateProperty({ id, property });
      commit("updateProductData", {
        id: newProduct.data.product.id,
        product: newProduct.data.product,
      });

      Alert("success", "修改成功", 1000);
    } catch (err) {
      console.log(err);
      Alert("error", err.message, 1000);
    }
  },
  setFilterQuery({ commit }, payload) {
    commit("setFilterQuery", payload);
  },
  resetFilterQuery({ commit }, { category }) {
    console.log(category);
    commit("resetFilterQuery", category);
  },
  updateOneQuery({ commit }, { category, payload }) {
    commit("updateOneQuery", { category, payload });
  },
};
