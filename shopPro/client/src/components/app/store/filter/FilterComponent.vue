<template>
  <transition name="slide-up" mode="in-out">
    <div class="filter" v-show="filterComponent" ref="filterComponentElement">
      <div class="filter__close--div">
        <svg class="filter__close" @click="closeFilterComponent">
          <use xlink:href="@/assets/images/sprite.svg#icon-times"></use>
        </svg>
      </div>

      <section class="filter__section" v-if="filterSections.includes('types')">
        <h4 class="heading--h4 heading--h4__style--2">分类</h4>
        <switch-app
          :behavior="'multible'"
          ref="typesApp"
          :tags="types"
          size="m"
          @selection-updated="updateFilter({ types: $event })"
          :initialValue="curFitlerData['types']"
        >
        </switch-app>
      </section>

      <section
        class="filter__section"
        v-if="filterSections.includes('priceRange')"
      >
        <h4 class="heading--h4 heading--h4__style--2">价格区间</h4>
        <price-slider
          ref="priceSlider"
          @value-updated="updateFilter({ price: $event })"
          :initialValue="curFitlerData['price']"
        ></price-slider>
      </section>

      <section class="filter__section">
        <h4 class="heading--h4 heading--h4__style--2">季节</h4>
        <switch-app
          :behavior="'multible'"
          ref="seasonsApp"
          :tags="['春季', '夏季', '秋季', '冬季']"
          size="m"
          @selection-updated="updateFilter({ collection_season: $event })"
          :initialValue="curFitlerData['collection_season']"
        >
        </switch-app>
      </section>

      <section
        class="filter__section"
        v-if="filterSections.includes('sorting')"
      >
        <h4 class="heading--h4 heading--h4__style--2">排序</h4>
        <SelectBox
          @value-updated="updateFilter({ sort: $event })"
          ref="sortApp"
          :values="sortAppValues"
          :selected="getCurrentSorting"
        ></SelectBox>
      </section>

      <section class="filter__section">
        <h4 class="heading--h4 heading--h4__style--2">标签</h4>
        <switch-app
          :behavior="'multible'"
          ref="tagsApp"
          :tags="tags"
          size="m"
          @selection-updated="updateFilter({ tags: $event })"
          :initialValue="curFitlerData['tags']"
        >
        </switch-app>
      </section>

      <div class="controls--div">
        <button class="btn btn-dark btn-small" @click="resetFilterComponent()">
          重置
        </button>
        <button class="btn btn-blue btn-small" @click="apply()">确定</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import PriceSlider from "./PriceSlider.vue";

export default {
  props: ["filterSections", "category"],
  emits: ["FilterApplied", "FilterClosed", "FilterReseted", "FilterToggled"],
  components: { PriceSlider },
  setup(props, { emit }) {
    const store = useStore();

    const filterComponent = ref(false);
    const filterComponentElement = ref(null);

    const toggleFilterComponent = () => {
      filterComponent.value = !filterComponent.value;
      emit("FilterToggled");
    };

    const closeFilterComponent = () => {
      filterComponent.value = false;
      emit("FilterClosed");
    };

    const openFilterComponent = () => {
      filterComponent.value = true;
      emit("FilterOpenned");
    };

    const types = store.getters["products/getTypes"](props.category);
    const tags = store.getters["products/getTags"](props.category);
    const properties = store.getters["products/getProperties"];
    const sizes = computed(() =>
      store.getters["products/getSizes"](props.category)
    );

    const sortAppValues = ["价格", "最新", "评价"];

    const genderApp = ref(null);
    const typesApp = ref(null);
    const sizesApp = ref(null);
    const tagsApp = ref(null);
    const seasonsApp = ref(null);
    const propertiesApp = ref(null);
    const sortApp = ref(null);
    const priceSlider = ref(null);

    const updateFilter = (query) => {
      store.dispatch("products/updateOneQuery", {
        category: props.category,
        payload: query,
      });
    };

    const curFitlerData = computed(() => {
      let filterQuery = store.getters["products/getFilterQuery"];
      return filterQuery(props.category);
    });

    const getCurrentSorting = computed(() => {
      if (curFitlerData.value["sort"] == "properties.price") return "价格";
      if (curFitlerData.value["sort"] == "-createdAt") return "最新";
      if (curFitlerData.value["sort"] == "-ratingsAverage") return "评价";

      return null;
    });

    const apply = async () => {
      emit("FilterApplied");
      closeFilterComponent();
    };

    const resetShortcuts = (prop) => {
      prop.value.updateSelectedItems([]);
    };

    const resetFilterComponent = async () => {
      if (sortApp.value) sortApp.value.resetSelection();
      if (priceSlider.value) priceSlider.value.resetValue();
      if (genderApp.value) resetShortcuts(genderApp);
      if (sizesApp.value) resetShortcuts(sizesApp);
      if (typesApp.value) resetShortcuts(typesApp);
      if (tagsApp.value) resetShortcuts(tagsApp);
      if (seasonsApp.value) resetShortcuts(seasonsApp);
      if (propertiesApp.value) resetShortcuts(propertiesApp);

      store.dispatch("products/resetFilterQuery", { category: props.category });

      emit("FilterReseted");
    };

    return {
      types,
      tags,
      properties,
      sizes,
      sortApp,
      priceSlider,
      sortAppValues,
      apply,
      updateFilter,
      closeFilterComponent,
      typesApp,
      tagsApp,
      seasonsApp,
      sizesApp,
      propertiesApp,
      genderApp,
      filterComponent,
      filterComponentElement,
      curFitlerData,
      resetFilterComponent,
      openFilterComponent,
      toggleFilterComponent,

      getCurrentSorting,
    };
  },
};
</script>
