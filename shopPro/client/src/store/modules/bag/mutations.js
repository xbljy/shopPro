export default {
  setBag(state, payload) {
    payload.forEach((card) => {
      if (card.product && card.product.id) {
        state.bag[card.id] = {
          ...card,
        };
      }
    });
  },
  addToBag(state, { card, product }) {
    delete card.product;

    state.bag[card.id] = {
      ...card,
      product,
    };
  },
  changeNumberOfOrders(state, { cardId, numberOfOrders }) {
    state.bag[cardId]["numberOfOrders"] = numberOfOrders;
  },
  updateCardId(state, { cardId, virtualId }) {
    state.bag[virtualId]["id"] = cardId;
    delete Object.assign(state.bag, { [cardId]: state.bag[virtualId] })[
      virtualId
    ];
  },
  deleteCard(state, cardId) {
    delete state.bag[cardId];
    if (state.selectedCards[cardId]) delete state.selectedCards[cardId];
  },
  deleteBag(state) {
    state.bag = {};
    state.selectedCards = {};
  },
  deleteItemsWithIds(state, ids) {
    ids.forEach((id) => {
      if (state.bag[id]) delete state.bag[id];
      if (state.selectedCards[id]) delete state.selectedCards[id];
    });
  },
  selectCard(state, card) {
    state.selectedCards[card.id] = card;
  },
  toggleSelectedCard(state, card) {
    if (state.selectedCards[card.id]) delete state.selectedCards[card.id];
    else state.selectedCards[card.id] = card;
  },
  deleteOneSelectedCard(state, cardId) {
    delete state.selectedCards[cardId];
  },
  resetSelectedCards(state) {
    state.selectedCards = {};
  },
};
