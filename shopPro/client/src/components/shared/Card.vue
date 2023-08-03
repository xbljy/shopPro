<template>
  <div
    class="product product__style--2 normal_cursor"
    :class="{ 'product__style--4': style == 'style4', no_sizes: !card.size }"
    v-if="card.id"
  >
    <div class="selection non__click" v-if="withSelection">
      <input
        :id="'checkbox' + card.id"
        type="checkbox"
        class="selection__checkbox non__click"
        @change="toggleCard(card)"
        :checked="selectedCards && selectedCards[card.id] ? true : false"
      />
      <label
        :for="'checkbox' + card.id"
        class="selection__label non__click"
      ></label>
    </div>
    <img
      class="product__image"
      :src="productImage"
      alt=""
    />

    <h5 class="heading--h5">{{ card.product.name }}</h5>

    <div class="product__rating">
      <svg class="product__icon product__star">
        <use xlink:href="@/assets/images/sprite.svg#icon-star-full"></use>
      </svg>
      {{ card.product.ratingsAverage }}
    </div>

    <ul class="product__size--list" v-if="card.size">
      <li class="product__size--item">
        {{ card.size ? card.size : "" }}
      </li>
    </ul>

    <ul class="product__property--list non__click">
      <li
        ref="property"
        class="product__property--item non__click"
      >{{card.property}}</li>
    </ul>

    <div class="product__price">¥{{ curPrice }}</div>

    <div
      v-if="style !== 'style4'"
      class="product__controller--div non__click"
      @click="deleteCard(card.id)"
    >
      <svg
        class="product__icon product__trash--icon"
        :class="{ rotate: cardIsBeingDeleted }"
      >
        <use
          xlink:href="@/assets/images/sprite.svg#icon-loader"
          v-show="cardIsBeingDeleted"
        ></use>
        <use
          xlink:href="@/assets/images/sprite.svg#icon-trash-2"
          v-show="!cardIsBeingDeleted"
        ></use>
      </svg>
    </div>

    <div v-else class="product__num_of_orders non__click">
      <button
        class="btn increament non__click"
        @click="increaseNumberOfOrders(card)"
        :disabled="card.numberOfOrders == maxQuantity"
      >
        <svg
          class="increament__icon non__click"
          :class="{ rotate: ordersNumberIsBeingIncreased }"
        >
          <use
            xlink:href="@/assets/images/sprite.svg#icon-loader"
            v-show="ordersNumberIsBeingIncreased"
          ></use>
          <use
            xlink:href="@/assets/images/sprite.svg#icon-plus1"
            v-show="!ordersNumberIsBeingIncreased"
          />
        </svg>
      </button>

      <input
        class="input--small"
        type="number"
        v-model="numberOfOrders"
        @blur="changeNumberOfOrders()"
        @keypress.enter="changeNumberOfOrders()"
        :max="maxQuantity"
        min="1"
      />

      <button
        class="btn increament non__click"
        @click="decreaseNumberOfOrders(card)"
        :disabled="card.numberOfOrders == 1"
      >
        <svg
          class="increament__icon non__click"
          :class="{ rotate: ordersNumberIsBeingDecreased }"
        >
          <use
            xlink:href="@/assets/images/sprite.svg#icon-loader"
            v-show="ordersNumberIsBeingDecreased"
          ></use>
          <use
            xlink:href="@/assets/images/sprite.svg#icon-window-minimize"
            v-show="!ordersNumberIsBeingDecreased"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { useBag } from "@/hooks/bag.js";

export default {
  props: ["card", "style", "withSelection", "selectedCards"],
  setup(props, { emit }) {
    const store = useStore();

    const router = useRouter();

    const navigate = (e, id) => {
      if (!Array.from(e.target.classList).includes("non__click")) {
        router.push("/store/" + id);
      }
    };
    // 选择图片
    const curPrice = ref(0);
    const selectedImage = (card) => {
      const selectedImageIndex = card.product.properties.findIndex(
        (property) => property.propertyName == card.property
      );
      if (selectedImageIndex == -1) return "";
      curPrice.value = props.card.product.properties[selectedImageIndex].price;
      return props.card.product.properties[selectedImageIndex].images[0]
        .medium_image;
    };

    const cardIsBeingDeleted = ref(false);
    const deleteCard = async (cardId) => {
      if (cardId.startsWith("virtual") || cardIsBeingDeleted.value) return;
      cardIsBeingDeleted.value = true;
      await store.dispatch("bag/deleteCard", cardId);
      cardIsBeingDeleted.value = false;
    };

    const toggleCard = (card) => {
      emit("card-toggled", card);
    };
    const productImage = require(`@/assets/images/products/${selectedImage(props.card)}`).default;

    // 购物车hook
    const {
      increaseNumberOfOrders,
      decreaseNumberOfOrders,
      ordersNumberIsBeingDecreased,
      ordersNumberIsBeingIncreased,
      changeNumberOfOrders,
      numberOfOrders,
      maxQuantity,
    } = useBag(props.card.product, props.card);

    return {
      navigate,
      selectedImage,
      deleteCard,
      toggleCard,
      increaseNumberOfOrders,
      decreaseNumberOfOrders,
      ordersNumberIsBeingDecreased,
      ordersNumberIsBeingIncreased,
      cardIsBeingDeleted,
      changeNumberOfOrders,
      numberOfOrders,
      maxQuantity,
      curPrice,
      productImage
    };
  },
};
</script>
