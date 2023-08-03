<template>
  <div class="dashboard__container dashboard__bag">
    <div class="u-padding-left-small">
      <div class="bag">
        <section class="bag__heading">
          <h2 class="heading--h2__style--5 bag__heading__h2">
            <svg
              class="bag__heading__icon heading--h2__style--5__icon heading--h2__style--5__icon--blue"
            >
              <use xlink:href="@/assets/images/sprite.svg#icon-bag12" />
            </svg>
            购物车
          </h2>

          <div class="bag__selected">
            {{ numberOfSelectedCards }} 已加入购物车
          </div>

          <base-button
            class="btn bag__delete"
            @click="deleteAllCardsThatAreSelected"
            :disabled="numberOfSelectedCards === 0 || itemsAreBeingRemoved"
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

        <div class="bag__content">
          <Card
            v-for="card in bagData"
            :key="card.id"
            :card="card"
            :style="'style4'"
            :withSelection="true"
            :selectedCards="selectedCards"
            @card-toggled="toggleCard($event)"
          ></Card>

          <empty-content
            class="empty-content--small"
            v-if="Object.keys(bagData).length === 0"
          >
          </empty-content>
        </div>
      </div>
    </div>

    <div class="checkout">
      <img src="@/assets/images/checkout.png" alt="" class="checkout__image" />

      <div class="checkout__price_details">
        总计
        <span>¥{{ totalPrice }}</span>
      </div>

      <div class="checkout__price_details">
        快递
        <span>$00.00</span>
      </div>

      <div class="checkout__price_details">
        折扣
        <span>¥{{ totalDiscount }}</span>
      </div>

      <div class="line"></div>

      <div class="checkout__total_price">
        总计
        <span>¥{{ totalPrice - totalDiscount }}</span>
      </div>
      <div class="checkout__btn">
        <base-button
          type="button"
          @click="navigateToCheckoutPage"
          class="btn-blue"
          :disabled="numberOfSelectedCards < 1"
          :innerText="numberOfSelectedCards < 1 ? '付款方式' : '立即付款'"
        ></base-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import Card from "@/components/shared/Card.vue";

export default {
  components: { Card },
  setup() {
    const store = useStore();
    const router = useRouter();

    const bagData = computed(() => store.getters["bag/getMyBag"]);

    const deleteBag = async () => {
      await store.dispatch("bag/deleteBag");
    };

    const selectedCards = computed(() => store.getters["bag/getSelectedCards"]);
    const numberOfSelectedCards = computed(
      () => store.getters["bag/getTheNumberOfSelectedCards"]
    );

    const itemsAreBeingRemoved = ref(false);
    const deleteAllCardsThatAreSelected = async () => {
      if (numberOfSelectedCards.value < 1 || itemsAreBeingRemoved.value) return;
      itemsAreBeingRemoved.value = true;
      try {
        await store.dispatch(
          "bag/deleteItemsWithIds",
          Object.keys(selectedCards.value)
        );
        store.dispatch("bag/resetSelectedCards");
      } catch (err) {
        console.log(err);
      }

      itemsAreBeingRemoved.value = false;
    };

    const toggleCard = (card) => {
      store.dispatch("bag/toggleSelectedCard", card);
    };
    const totalPrice = computed(
      () => store.getters["bag/getTotalPriceForSelectedCards"]
    );

    const totalDiscount = computed(
      () => store.getters["bag/getTotalDiscountForSelectedCards"]
    );
    const navigateToCheckoutPage = () => {
      if (numberOfSelectedCards.value >= 1) router.push("/dashboard/checkout");
    };

    return {
      navigateToCheckoutPage,

      totalPrice,
      totalDiscount,
      bagData,
      deleteBag,
      toggleCard,
      numberOfSelectedCards,
      deleteAllCardsThatAreSelected,
      selectedCards,
      itemsAreBeingRemoved,
    };
  },
};
</script>
