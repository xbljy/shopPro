<template>
  <div class="dashboard__container">
    <div class="u-padding-left-small">
      <div class="favorites">
        <section class="favorites__heading">
          <h2 class="heading--h2__style--5 favorites__heading__h2">
            <svg
              class="favorites__heading__icon heading--h2__style--5__icon heading--h2__style--5__icon--red"
            >
              <use xlink:href="@/assets/images/sprite.svg#icon-heart" />
            </svg>
            我的喜欢
          </h2>

          <div class="favorites__selected">
            {{ numberOfSelectedProducts }} 已选择
          </div>

          <base-button
            class="btn bag__delete"
            @click="deleteProducts"
            :disabled="numberOfSelectedProducts === 0 || itemsAreBeingRemoved"
          >
            <template #content>
              <svg
                class="bag__delete--icon btn__icon"
                :class="{ rotate: itemsAreBeingRemoved }"
              >
                <use
                  xlink:href="@/assets/images/sprite.svg#icon-loader"
                  v-show="itemsAreBeingRemoved"
                />
                <use
                  xlink:href="@/assets/images/sprite.svg#icon-trash-2"
                  v-show="!itemsAreBeingRemoved"
                />
              </svg>
            </template>
          </base-button>
        </section>

        <div class="favorites__content">
          <empty-content
            v-if="Object.keys(wishlistData).length === 0"
            class="empty-content--small"
          >
          </empty-content>
          <liked-product-card
            v-else
            v-for="product in wishlistData"
            :key="product.id"
            :product="product"
            :style="'style4'"
            :withSelection="true"
            @product-toggled="toggleProduct($event)"
          ></liked-product-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LikedProductCard from "@/components/shared/LikedProduct.vue";

import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
  components: { LikedProductCard },

  setup() {
    const store = useStore();
    const wishlistData = computed(
      () => store.getters["wishlist/getMyWishlist"]
    );

    const deleteWishlist = async () => {
      await store.dispatch("wishlist/deleteWishlist");
    };

    let selectedProductsObj = ref({});
    const toggleProduct = (id) => {
      if (selectedProductsObj.value[id]) {
        delete selectedProductsObj.value[id];
      } else {
        selectedProductsObj.value[id] = id;
      }
    };

    const itemsAreBeingRemoved = ref(false);
    const deleteProducts = async () => {
      if (
        Object.entries(selectedProductsObj.value).length < 1 ||
        itemsAreBeingRemoved.value
      )
        return;
      itemsAreBeingRemoved.value = true;
      await store.dispatch(
        "wishlist/deleteItemsWithIds",
        selectedProductsObj.value
      );

      selectedProductsObj.value = {};

      itemsAreBeingRemoved.value = false;
    };

    const numberOfSelectedProducts = computed(
      () => Object.entries(selectedProductsObj.value).length
    );

    return {
      wishlistData,
      deleteWishlist,
      toggleProduct,
      deleteProducts,
      numberOfSelectedProducts,
      itemsAreBeingRemoved,
    };
  },
};
</script>
