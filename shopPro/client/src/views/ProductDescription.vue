<template>
  <div class="app__container custom custom-3">
    <div v-if="loaded && product.id">
      <product-details :product="product" v-if="product.id"></product-details>
      <reviews-section
        class="custom__padding"
        :reviews="productReviews"
        :product="product"
      ></reviews-section>
      <related-products class="custom__padding"></related-products>
    </div>
    <loader-app v-if="!loaded"></loader-app>
  </div>
</template>

<script>
import { ref, computed, watch, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import RelatedProducts from "@/components/app/store/RelatedProducts.vue";
import ReviewsSection from "@/components/app/store/reviews/ReviewsSection.vue";
export default {
  components: { RelatedProducts, ReviewsSection },
  props: ["id"],
  setup(props) {
    const route = useRoute();
    const store = useStore();
    const product = computed(() => store.getters["products/getCurProduct"]);
    const loaded = ref(false);
    const loadData = async (id) => {
      loaded.value = false;
      if (id) {
        await store.dispatch("products/fetchOneProduct", id);
        await store.dispatch("reviews/fetchReviewsForProduct", id);
        await store.dispatch("products/fetchRelatedToCurrentProduct", {
          type: product.value.type,
          category: product.value.category,
          id,
        });
      }

      loaded.value = true;
    };

    loadData(props.id);

    watch(route, (value) => {
      store.dispatch("products/resetCurProduct");
      loadData(value.path.split("/store/")[1]);
    });

    onUnmounted(() => {
      store.dispatch("products/resetCurProduct");
    });

    const productReviews = computed(
      () => store.getters["reviews/getCurrentReviews"]
    );

    return {
      product,
      productReviews,
      loaded,
    };
  },
};
</script>
