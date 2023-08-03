<template>
  <div>
    <infinite-scroll
      :reachedMax="reachedMax"
      :loading="itemsLoading"
      :loaded="itemsLoaded"
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
      :category="'fruit'"
      :filterSections="[
        'gender',
        'priceRange',
        'types',
        'sorting',
        'properties',
        'sizes',
      ]"
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

    const products = computed(
      () => store.getters["products/getFruitProducts"]
    );

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    const loadData = async () => {
      itemsLoaded.value = false;
      itemsLoading.value = true;
      if (Object.keys(products.value).length == 0)
        await store.dispatch(
          "products/fetchProductsToCollection",
          "fruit"
        );
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

      // 加载删选后数据
      await store.dispatch("products/fetchProductsToCollection", "fruit");
      reachedMax.value = false;
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    // 无限滚动
    const getNumberOfProductsInCollection = computed(() =>
      store.getters["products/getNumberOfProductsInCollection"]("fruit")
    );

    const reachedMax = ref(false);
    const loadMoreProducts = async (itemsLength) => {
      if (itemsLoading.value) {
        return;
      }
      itemsLoading.value = true;
      await store.dispatch("products/fetchMoreProducts", {
        itemsLength,
        category: "fruit",
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
