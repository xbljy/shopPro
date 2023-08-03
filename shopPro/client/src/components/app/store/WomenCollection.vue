<template>
  <div>
    <div class="u-margin-bottom-meduim store__header">
      <h1 class="heading--h1__style--3">女性服装</h1>
      <p class="store__header--p">为您推荐</p>
      <img
        src="@/assets/images/categories/bubble-rose.png"
        alt=""
        class="store__header__bubble category__bubble--rose"
      />
      <img
        src="@/assets/images/categories/women.png"
        alt=""
        class="store__header__image"
      />
    </div>

    <infinite-scroll
      :loading="itemsLoading"
      :loaded="itemsLoaded"
      :reachedMax="reachedMax"
      :items="products"
      :classes="'store__products'"
      @reached-bottom="loadMoreProducts($event)"
    >
      <template #item="{ item }">
        <product-card
          :product="item"
          :parent="'products'"
          v-if="item.properties.length > 0"
        >
        </product-card>
      </template>
    </infinite-scroll>
    <filter-component
      ref="filterComponent"
      @filter-applied="reloadData()"
      @filter-reseted="reloadData()"
      :category="'women'"
      :filterSections="['priceRange', 'types', 'sorting', 'properties', 'sizes']"
    ></filter-component>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import FilterComponent from "./filter/FilterComponent.vue";

export default {
  components: { FilterComponent },
  setup() {
    const store = useStore();

    const products = computed(() => store.getters["products/getWomenProducts"]);

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    const loadData = async () => {
      itemsLoaded.value = false;
      itemsLoading.value = true;
      if (Object.keys(products.value).length == 0)
        await store.dispatch("products/fetchProductsToCollection", "women");
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    loadData();

    // 筛选
    const filterComponent = ref(null);
    const toggleFilterComponent = () => {
      filterComponent.value.toggleFilterComponent();
    };

    const reloadData = async () => {
      itemsLoading.value = true;
      itemsLoaded.value = false;
      // 加载筛选数据
      await store.dispatch("products/fetchProductsToCollection", "women");
      reachedMax.value = false;
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    // 无限滚动
    const getNumberOfProductsInCollection = computed(() =>
      store.getters["products/getNumberOfProductsInCollection"]("women")
    );

    const reachedMax = ref(false);
    const loadMoreProducts = async (itemsLength) => {
      if (itemsLoading.value) {
        return;
      }
      itemsLoading.value = true;
      await store.dispatch("products/fetchMoreProducts", {
        itemsLength,
        category: "women",
      });

      reachedMax.value = getNumberOfProductsInCollection.value == itemsLength;
      itemsLoading.value = false;
    };

    return {
      products,
      reloadData,
      toggleFilterComponent,
      loadData,
      filterComponent,
      loadMoreProducts,
      reachedMax,
      itemsLoading,
      itemsLoaded,
    };
  },
};
</script>
