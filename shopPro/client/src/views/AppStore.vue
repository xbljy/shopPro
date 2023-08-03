<template>
  <div class="app">
    <teleport to="#taps"
      ><shortcuts-app
        class="taps"
        ref="taps"
        :behavior="'single'"
        :tags="navbarShortcuts"
        :initialValue="[curCategory]"
        @selection-updated="updateCategoryValue($event)"
      ></shortcuts-app
    ></teleport>

    <div class="app__container">
      <div>
        <keep-alive>
          <component
            :is="selectedCollection"
            :ref="
              (el) => {
                curCollectionComponent = el;
              }
            "
          ></component>
        </keep-alive>

        <button class="btn btn-big btn-filter" @click="toggleFilterComponent">
          <svg class="btn__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-equalizer"></use>
          </svg>
          筛选
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed } from "vue";
import PriceSlider from "@/components/app/store/filter/PriceSlider.vue";

import FruitCollection from "@/components/app/store/FruitCollection.vue";
import SeafoodCollection from "@/components/app/store/SeafoodCollection.vue";
import MeatCollection from "@/components/app/store/MeatCollection.vue";
import FrozenfoodCollection from "@/components/app/store/FrozenfoodCollection.vue";
import VegetablesCollection from "@/components/app/store/VegetablesCollection.vue";
export default {
  props: ["query"],
  components: {
    PriceSlider,
    FruitCollection,
    SeafoodCollection,
    MeatCollection,
    FrozenfoodCollection,
    VegetablesCollection
  },
  emits: ["filter-reseted"],
  setup(props) {
    const router = useRouter();
    const store = useStore();

    const products = computed(() => store.getters["products/getProducts"]);

    const curCollectionComponent = ref(null);

    const taps = ref(null);
    const collectionsComponentsNames = {
      fruit: "FruitCollection",
      seafood: "SeafoodCollection",
      meat: "MeatCollection",
      frozenfood: "FrozenfoodCollection",
      vegetables: "VegetablesCollection"
    };

    const navbarShortcuts = [{key: "fruit", value: "新鲜水果"}, {key: "seafood", value: "海鲜水产"}, {key: "meat", value: "精选肉类"}, {key: "frozenfood", value: "冷饮冻食"}, {key: "vegetables", value: "蔬菜蛋品"}];

    const selectedCollection = ref(
      collectionsComponentsNames[props.query.category] || "新鲜水果"
    );

    const curCategory = ref(props.query.category || "fruit");

    const updateCategoryValue = (newValue) => {
      selectedCollection.value = collectionsComponentsNames[newValue];
      curCategory.value = newValue[0];
      router.replace({ query: { category: newValue[0] } });
    };

    const toggleFilterComponent = () => {
      curCollectionComponent.value.toggleFilterComponent();
    };

    const isFilterWinowActive = computed(() =>
      curCollectionComponent.value &&
      curCollectionComponent.value.filterComponent
        ? curCollectionComponent.value.filterComponent.filterComponent
        : false
    );

    return {
      navbarShortcuts,
      curCategory,
      products,
      updateCategoryValue,
      taps,
      toggleFilterComponent,
      selectedCollection,
      curCollectionComponent,
      isFilterWinowActive,
    };
  },
};
</script>
