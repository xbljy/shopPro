export default {
  getMyBag(state) {
    return state.bag;
  },
  getNumOfCards(state) {
    return Object.keys(state.bag).length;
  },
  isAddedToBag(state) {
    return (productId, size, property) => {
      for (const cardId in state.bag) {
        if (
          state.bag[cardId].product.id == productId &&
          state.bag[cardId].property == property &&
          state.bag[cardId].size == size
        )
          return state.bag[cardId];
      }
      return false;
    };
  },
  isAddedToBagCustom(state) {
    return (productId, property) => {
      for (const cardId in state.bag) {
        if (
          state.bag[cardId].product.id == productId &&
          state.bag[cardId].property == property
        )
          return state.bag[cardId];
      }
      return false;
    };
  },
  getSelectedCards(state) {
    return state.selectedCards;
  },
  getTheNumberOfSelectedCards(state) {
    return Object.keys(state.selectedCards).length;
  },
  getTotalPriceForSelectedCards(state) {
    const cardsArray = Object.values(state.selectedCards);
    if (cardsArray.length == 0) {
      return 0;
    }

    return cardsArray
      .map(
        (card) =>
          card.product.properties.find((property) => property.propertyName == card.property)
            .price * card.numberOfOrders
      )
      .reduce((a, b) => a + b);
  },

  getTotalDiscountForSelectedCards(state) {
    const cardsArray = Object.values(state.selectedCards);
    if (cardsArray.length == 0) {
      return 0;
    }

    return Math.round(
      cardsArray
        .map((card) => {
          const item = card.product.properties.find(
            (property) => property.propertyName == card.property
          );
          if (item.priceDiscount > 0)
            return item.priceDiscount * 1 * card.numberOfOrders * item.price;
          else if (item.priceDiscount == 0 && card.product.global_discount > 0)
            return (
              card.product.global_discount *
              1 *
              card.numberOfOrders *
              item.price
            );
          else return 0;
        })
        .reduce((a, b) => a + b)
    );
  },
};
