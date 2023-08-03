import { Alert } from "@/utils/Alert.js";

import * as bagApi from "@/api/bag.js";

export default {
  async fetchMyBag({ commit }) {
    try {
      const bag = await bagApi.getMyBag();
      commit("setBag", bag.data.data);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async getOneCard(_, cardId) {
    const card = await bagApi.getOneCard(cardId);
    return card;
  },
  async changeNumberOfOrders({ commit }, { cardId, numberOfOrders }) {
    try {
      await bagApi.updateCard(cardId, { numberOfOrders });
      commit("changeNumberOfOrders", { cardId, numberOfOrders });
      Alert("success", "修改成功");
    } catch (err) {
      Alert("error", "修改异常", 1000);
    }
  },
  async addToBag({ commit }, { product, property, size, numberOfOrders }) {
    const virtualId =
      "virtual" + Math.floor(Date.now() + Math.floor(Math.random() * 1000));

    commit("addToBag", {
      card: { numberOfOrders, property, size, id: virtualId },
      product,
    });
    try {
      const card = await bagApi.addToBag({
        productId: product.id,
        property,
        size,
      });

      if (card.data.status == "success") {
        commit("updateCardId", { cardId: card.data.data.id, virtualId });
        return Alert("success", "已加入购物车", 1000);
      }
    } catch (err) {
      commit("deleteCard", virtualId);

      Alert("error", "服务异常", 1000);
    }
  },

  async addToBagCustom({ commit }, { product, property, numberOfOrders }) {
    const virtualId =
      "virtual" + Math.floor(Date.now() + Math.floor(Math.random() * 1000));

    commit("addToBag", {
      card: { numberOfOrders, property, id: virtualId },
      product,
    });
    try {
      const card = await bagApi.addToBag({
        productId: product.id,
        property,
      });

      if (card.data.status == "success") {
        commit("updateCardId", { cardId: card.data.data.id, virtualId });
        return Alert("success", "已加入购物车", 1000);
      }
    } catch (err) {
      commit("deleteCard", virtualId);

      Alert("error", "服务异常", 1000);
    }
  },
  async deleteCard({ commit }, cardId) {
    if (cardId.toString().startsWith("virtual") || !cardId) return;
    try {
      await bagApi.deleteCard(cardId);
      commit("deleteCard", cardId);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteBag({ commit, getters }) {
    if (getters.getNumOfCards < 1) return;
    try {
      await bagApi.deleteBag();
      commit("deleteBag");
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },
  async deleteItemsWithIds({ commit }, ids) {
    if (ids.length < 1) return;
    try {
      await bagApi.deleteItemsWithIds(ids);

      commit("deleteItemsWithIds", ids);
    } catch (err) {
      Alert("error", "服务异常", 1000);
    }
  },

  selectCard({ commit }, card) {
    commit("selectCard", card);
  },
  deleteOneSelectedCard({ commit }, cardId) {
    commit("deleteOneSelectedCard", cardId);
  },
  resetSelectedCards({ commit }) {
    commit("resetSelectedCards");
  },
  toggleSelectedCard({ commit }, card) {
    commit("toggleSelectedCard", card);
  },
};
