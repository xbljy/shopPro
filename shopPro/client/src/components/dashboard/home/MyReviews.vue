<template>
  <section class="reviews u-margin-top-big">
    <section class="dashboard_home__carousel__heading">
      <h2 class="heading--h2 heading--h2__style--5">
        <svg
          class="heading--h2__style--5__icon heading--h2__style--5__icon--green"
        >
          <use xlink:href="@/assets/images/sprite.svg#icon-star" />
        </svg>
        所有评论
      </h2>
    </section>

    <Carousel
      :settings="settings"
      :breakpoints="breakpoints"
      class="u-margin-right-small"
      v-if="reviews && reviews.length > 0"
    >
      <Slide class="auto_width" v-for="review in reviews" :key="review.id">
        <review-card :review="review"></review-card>
      </Slide>
      <template #addons>
        <Navigation v-if="Object.keys(reviews).length > 0" />
      </template>
    </Carousel>

    <empty-content
      v-if="Object.keys(reviews).length == 0"
      class="empty-content--small"
    ></empty-content>
  </section>
</template>
<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const carouselSettings = {
      transition: 400,
    };

    const breakpoints = {
      1215: {
        itemsToShow: 3,
        itemsToScroll: 3,
      },
      1000: {
        itemsToShow: 3.5,
        itemsToScroll: 3,
      },
      910: {
        itemsToShow: 3.7,
        itemsToScroll: 3,
      },

      800: {
        itemsToShow: 3.2,
        itemsToScroll: 3,
      },

      700: {
        itemsToShow: 2.8,
        itemsToScroll: 2,
      },

      600: {
        itemsToShow: 2.3,
        itemsToScroll: 2,
      },

      500: {
        itemsToShow: 2,
        itemsToScroll: 1,
      },
      280: {
        itemsToShow: 1,
        itemsToScroll: 1,
      },
    };

    const reviews = computed(() => store.getters["reviews/getMyReviews"]);

    (async () => {
      await store.dispatch("reviews/fetchMyReviews");
    })();

    return {
      settings: carouselSettings,
      reviews,
      breakpoints,
    };
  },
};
</script>
