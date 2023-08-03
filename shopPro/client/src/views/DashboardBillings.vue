<template>
  <div class="dashboard__container">
    <div class="billings u-padding-left-small">
      <billings-statistics></billings-statistics>
      <table class="table billing__description u-margin-top-small">
        <tr class="table__row table__header equal_width">
          <th class="table__heading">订单</th>
          <th class="table__heading">日期</th>
          <th class="table__heading">付款方式</th>
          <th class="table__heading">付款账号</th>
          <th class="table__heading">支出</th>
          <th class="table__heading">状态</th>
        </tr>

        <infinite-scroll
          :items="orders"
          :type="'table'"
          :loading="itemsLoading"
          :loaded="itemsLoaded"
          :reachedMax="reachedMax"
          @reached-bottom="fetchMoreBillings($event)"
          :classes="'table__row equal_width'"
        >
          <template #item="{ item }">
            <td class="table__data bold">
              <img
                v-for="order in item.orders"
                :key="order.name"
                class="table__img--small"
                :src="genOrderImage(item)"
                alt=""
              />
            </td>
            <td class="table__data">
              {{ new Date(item.time).toLocaleString().split(",")[0] }}
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

    const orders = computed(() => store.getters["billings/getMyBillings"]);

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    const fetchBillings = async () => {
      if (orders.value.length > 0) return;
      itemsLoaded.value = false;
      itemsLoading.value = true;
      await store.dispatch("billings/fetchMyBillings", { skip: 0, limit: 8 });
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    fetchBillings();

    const productImage = (card) => {
      console.log(card);
      return card.product.properties.find((property) => property.propertyName == card.property)
        .images[0].small_image;
    };

    // 无限滚动
    const getNumberOfBillings = computed(
      () => store.getters["billings/getNumberOfMyBillings"]
    );

    const reachedMax = ref(false);
    const fetchMoreBillings = async (itemsLength) => {
      if (itemsLoading.value) {
        return;
      }
      console.log("req-sent");
      itemsLoading.value = true;
      await store.dispatch("billings/fetchMoreBillingsForUser", {
        skip: itemsLength * 1,
        limit: 5,
      });

      reachedMax.value = getNumberOfBillings.value == itemsLength;

      itemsLoading.value = false;
    };

    const genOrderImage = (item) => {
      return require('@/assets/images/products/' + order.image).default;
    }

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
