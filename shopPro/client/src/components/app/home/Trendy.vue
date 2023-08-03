<template>
  <section class="home__products u-margin-bottom-huge">
    <h2 class="heading--h2">
      <svg class="heading--h2__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-fire"></use>
      </svg>
      流行
    </h2>
    <base-button
      class="btn-dark btn-small"
      :innerText="'查看更多'"
      @click="$router.push('/store')"
    ></base-button>
    <p class="sub__title">火爆</p>
    <Carousel
      v-if="Object.keys(products).length > 0"
      :settings="settings"
      :breakpoints="breakpoints"
    >
      <Slide class="auto_width" v-for="product in products" :key="product.id">
        <product-card
          :product="product"
          :parent="'trendyProducts'"
          v-if="product.properties.length > 0"
        ></product-card>
      </Slide>
      <template #addons>
        <Navigation v-if="!emptyContent" />
      </template>
    </Carousel>
    <content-loader v-show="contentLoading"></content-loader>
    <empty-content
      v-show="emptyContent"
      class="empty-content--small"
    ></empty-content>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    const carouselSettings = {
      transition: 200,
    };

    const breakpoints = {
      1275: {
        itemsToShow: 4.5,
        itemsToScroll: 4,
      },
      1000: {
        itemsToShow: 4,
        itemsToScroll: 3,
      },
      760: {
        itemsToShow: 3,
        itemsToScroll: 3,
      },

      660: {
        itemsToShow: 2.5,
        itemsToScroll: 2,
      },

      500: {
        itemsToShow: 2,
        itemsToScroll: 2,
      },
      280: {
        itemsToShow: 1,
        itemsToScroll: 1,
      },
    };

    const products = computed(
      () => store.getters["products/getTrendyProducts"]
    );

    const contentLoaded = ref(false);
    const contentLoading = ref(false);
    const loadData = async () => {
      if (contentLoaded.value || contentLoading.value) return;
      contentLoading.value = true;
      if (Object.keys(products.value).length == 0)
        await store.dispatch("products/fetchTrendyProducts");

      contentLoading.value = false;
      contentLoaded.value = true;
    };

    loadData();

    const emptyContent = computed(
      () => contentLoaded.value && Object.keys(products.value).length == 0
    );

    return {
      settings: carouselSettings,
      products,
      contentLoading,
      emptyContent,
      breakpoints,
    };
  },
};
</script>
