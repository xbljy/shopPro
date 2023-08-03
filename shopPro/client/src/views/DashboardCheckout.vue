<template>
  <div class="dashboard__container">
    <div class="checkout__container u-padding-left-small">
      <div class="checkout__details">
        <header class="checkout__details--header">
          <div class="checkout__details--dots"></div>
          <h2 class="checkout__details--h2">支付清单</h2>
        </header>
        <ul
          class="checkout__details--list"
          v-for="card in selectedCards"
          :key="card.id"
        >
          <li class="checkout__details--item">
            <img
              :src="genCardImage(card)"
              alt=""
              class="checkout__details--img"
            />
            <h3 class="checkout__details--username">{{ card.product.name }}</h3>
            <div class="checkout__details--orders">
              {{ card.numberOfOrders }} 订单
            </div>
          </li>
        </ul>
      </div>
      <checkout :items="selectedCards"></checkout>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import Checkout from "@/components/dashboard/checkout/Checkout.vue";
export default {
  components: { Checkout },

  setup() {
    const store = useStore();
    const selectedCards = computed(() => store.getters["bag/getSelectedCards"]);

    const getImageOfProduct = (card) => {
      return card.product.properties.find(
        (property) => property.name == card.selectedProperty
      ).images[0].small_image;
    };

    const genCardImage = (card) => {
      return require('@/assets/images/products/' + getImageOfProduct(card)).default;
    }

    return {
      selectedCards,
      getImageOfProduct,
      genCardImage
    };
  },
};
</script>
