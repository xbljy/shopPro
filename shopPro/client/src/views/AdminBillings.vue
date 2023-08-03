<template>
  <div class="dashboard__container">
    <div class="billings u-padding-left-small">
      <billings-statistics></billings-statistics>
      <table
        class="table billing__description u-margin-top-small"
        v-if="orders.length"
      >
        <tr class="table__row table__header equal_width">
          <th class="table__heading">订单</th>
          <th class="table__heading">用户</th>
          <th class="table__heading">支付方式</th>
          <th class="table__heading">卡号</th>
          <th class="table__heading">金额</th>
          <th class="table__heading">状态</th>
        </tr>

        <infinite-scroll
          :items="orders"
          :type="'table'"
          :reachedMax="reachedMax"
          :loading="itemsLoading"
          :loaded="itemsLoaded"
          @reached-bottom="fetchMoreBillings($event)"
          :classes="'table__row equal_width'"
        >
          <template #item="{ item }">
            <td class="table__data bold">
              <img
                v-for="order in item.orders"
                :key="order.name"
                class="table__img--small"
                :src="genOrderImage(order)"
                alt=""
              />
            </td>
            <td class="table__data">
              <img
                class="table__img--small"
                :src="'@/assets/images/users/' + item.user.photo[0].small_image"
                alt=""
              />
              <span class="table__data--username bold uppercase">
                {{ item.user.name }}
              </span>
            </td>
            <td class="table__data">
              <svg class="table__icon">
                <use xlink:href="@/assets/images/sprite.svg#icon-cart-plus" />
              </svg>
              {{ item.brand }}
            </td>
            <td class="table__data">*********{{ item.last4 }}</td>
            <td class="table__data bold">¥{{ item.balance / 100 }}</td>
            <td class="table__data">
              <span class="success">
                {{ item.chargingStatus }}
              </span>
            </td>
          </template>
        </infinite-scroll>
      </table>
    </div>
  </div>
</template>
<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import BillingsStatistics from "@/components/dashboard/billings/BillingsStatistics";

export default {
  components: { BillingsStatistics },
  setup() {
    const store = useStore();

    const orders = computed(() => store.getters["billings/getAllBillings"]);

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    const fetchBillings = async () => {
      itemsLoaded.value = false;
      itemsLoading.value = true;
      if (orders.value.length > 0) return;
      await store.dispatch("billings/fetchAllBillings", { limit: 8, skip: 0 });
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    fetchBillings();

    const productImage = (card) => {
      console.log(card);
      return card.product.properties.find((property) => property.propertyName == card.property)
        .images[0].small_image;
    };

    const getNumberOfBillings = computed(
      () => store.getters["billings/getNumberOfAllBillingsForAdmin"]
    );

    const fetchMore = async (itemsLength) => {
      await store.dispatch("billings/fetchMoreBillingsForAdmin", {
        skip: itemsLength * 1,
        limit: 8,
      });
    };

    const reachedMax = ref(false);
    const fetchMoreBillings = async (itemsLength) => {
      if (itemsLoading.value) return;
      itemsLoading.value = true;

      await fetchMore(itemsLength);

      reachedMax.value = getNumberOfBillings.value == itemsLength;

      itemsLoading.value = false;
    };

    const genOrderImage = order => require('@/assets/images/products/' + order.image).default;

    return {
      orders,
      productImage,
      fetchMoreBillings,
      reachedMax,
      itemsLoading,
      itemsLoaded,
      genOrderImage
    };
  },
};
</script>
