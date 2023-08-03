<template>
  <section class="home__categories u-margin-bottom-huge">
    <h2 class="heading--h2 fade_in_left">
      <svg class="heading--h2__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-th-list"></use>
      </svg>
      所有类目
    </h2>
    <base-button
      class="btn-dark btn-small fade_in_right"
      :innerText="'逛商城'"
      @click="$router.push('/store')"
    ></base-button>
    <Carousel :settings="settings">
      <Slide
        class="auto_width"
        v-for="category in categories"
        :key="category.title"
        @mousedown="drag = false"
        @mousemove="drag = true"
        @mouseup="drag ? (drag = false) : navigate(category.image)"
      >
        <category-card
          :color="category.color"
          :title="category.title"
          :image="category.image"
        ></category-card>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, computed } from "vue";

import CategoryCard from "./CategoryCard.vue";
import BaseButton from "@/components/layout/BaseButton.vue";
export default {
  components: {
    CategoryCard,
    BaseButton,
  },
  props: ["loading"],
  setup() {
    const router = useRouter();
    const itemsToShow = computed(() => {
      if (window.innerWidth > 1100) return window.innerWidth / 420;
      else return window.innerWidth / 380;
    });

    const carouselSettings = {
      itemsToShow: itemsToShow.value,
      transition: 400,
      itemsToScroll: Math.floor(itemsToShow.value),
    };

    const drag = ref(false);

    const navigate = (category) => {
      router.push(`/store?category=${category}`);
    };

    /*
      类目
    */
    const categories = [
      {
        color: "green",
        title: "新鲜水果",
        image: "fruit"
      },
      {
        color: "orange",
        title: "海鲜水产",
        image: "seafood"
      },
      {
        color: "rose",
        title: "精选肉类",
        image: "meat"
      },
      {
        color: "violet",
        title: "冷饮冻食",
        image: "frozenfood"
      },
      {
        color: "yellow",
        title: "蔬菜蛋品",
        image: "vegetables"
      }
    ];

    return {
      settings: carouselSettings,
      navigate,
      drag,
      categories,
    };
  },
};
</script>
