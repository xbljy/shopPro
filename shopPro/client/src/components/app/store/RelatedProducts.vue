<template>
  <section
    class="home__products u-margin-top-big"
    v-show="Object.keys(products).length > 0"
  >
    <h2 class="heading--h2">
      <svg class="heading--h2__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-flash"></use>
      </svg>
      相关产品
    </h2>
    <base-button
      class="btn-dark btn-small"
      :innerText="'查看更多'"
      @click="$router.push('/store')"
    ></base-button>
    <Carousel
      :settings="settings"
      v-if="Object.keys(products).length"
      :breakpoints="breakpoints"
    >
      <Slide class="auto_width" v-for="product in products" :key="product.id">
        <product-card
          :product="product"
          v-if="product.properties.length > 0"
          :parent="'relatedProducts'"
        ></product-card>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const carouselSettings = {
      transition: 200,
    };

    const breakpoints = {
      1275: {
        itemsToShow: 4,
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
      () => store.getters["products/getRelatedToCurrentProduct"]
    );

    return {
      settings: carouselSettings,
      products,
      breakpoints,
    };
  },
};
</script>
