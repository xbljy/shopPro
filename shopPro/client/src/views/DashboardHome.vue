<template>
  <div class="dashboard__container dashboard_home">
    <div class="dashboard_home__content u-padding-left-small">
      <div class="u-padding-right-small">
        <dashboard-header class="u-margin-right-small"></dashboard-header>
        <base-carousel
          class="u-margin-right-small"
          :items="wishlist"
          :title="'favorites'"
          :link="'/dashboard/favorites'"
          :icon="'heart'"
        >
        </base-carousel>
        <base-carousel
          class="u-margin-right-small"
          :items="bag"
          :title="'bag'"
          :link="'/dashboard/bag'"
          :icon="'shopping-cart1'"
        ></base-carousel>
      </div>
      <aside class="dashboard_home__sidebar">
        <dashboard-notification></dashboard-notification>
        <dashboard-to-do-list></dashboard-to-do-list>
      </aside>
    </div>

    <my-reviews class="u-padding-left-small"></my-reviews>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

import Header from "@/components/dashboard/home/Header.vue";
import BaseCarousel from "@/components/dashboard/home/BaseCarousel.vue";
import Notification from "@/components/dashboard/home/Notification.vue";
import ToDoList from "@/components/dashboard/home/ToDoList.vue";
import MyReviews from "@/components/dashboard/home/MyReviews.vue";
export default {
  props: ["dashboard"],
  components: {
    DashboardHeader: Header,
    BaseCarousel,
    DashboardNotification: Notification,
    DashboardToDoList: ToDoList,
    MyReviews,
  },
  setup() {
    const store = useStore();
    const wishlist = computed(() => store.getters["wishlist/getMyWishlist"]);
    const bag = computed(() => store.getters["bag/getMyBag"]);

    return {
      wishlist,
      bag,
    };
  },
};
</script>
