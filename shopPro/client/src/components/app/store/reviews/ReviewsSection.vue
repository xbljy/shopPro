<template>
  <section class="reviews">
    <h2 class="heading--h2">
      <svg class="heading--h2__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-star-empty"></use>
      </svg>
      所有评论
    </h2>
    <base-button
      class="btn-blue"
      @click="openAddReviewPopup()"
      :innerText="'添加评论'"
      :disabled="false && !isBuyer || isUserAddedReviewForThatProduct"
    >
    </base-button>

    <Carousel
      :settings="settings"
      :breakpoints="breakpoints"
      class="u-margin-top-small"
      v-if="Object.keys(reviews).length > 0"
    >
      <Slide class="auto_width" v-for="review in reviews" :key="review.id">
        <review-card :review="review"></review-card>
      </Slide>
      <template #addons>
        <Navigation v-if="Object.keys(reviews).length > 0" />
      </template>
    </Carousel>

    <empty-content v-if="Object.keys(reviews).length == 0"></empty-content>

    <add-review ref="addReviewComponent"></add-review>
  </section>
</template>
<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import AddReview from "./AddReview.vue";
export default {
  props: ["reviews", "product"],
  components: { AddReview },
  setup(props) {
    const store = useStore();

    const carouselSettings = {
      transition: 400,
    };

    const breakpoints = {
      1000: {
        itemsToShow: 3.9,
        itemsToScroll: 3,
      },
      910: {
        itemsToShow: 3.5,
        itemsToScroll: 3,
      },

      870: {
        itemsToShow: 2.1,
        itemsToScroll: 2,
      },

      800: {
        itemsToShow: 2,
        itemsToScroll: 2,
      },

      700: {
        itemsToShow: 1.8,
        itemsToScroll: 1,
      },

      600: {
        itemsToShow: 1.5,
        itemsToScroll: 1,
      },

      280: {
        itemsToShow: 1.1,
        itemsToScroll: 1,
      },
    };

    const userId = computed(() => {
      return store.getters["auth/getUserId"];
    });

    // const isBuyer = computed(() => {
    //   return true || props.product
    //     ? props.product.buyers.find((id) => id == userId.value)
    //     : false;
    // });
    const isBuyer = ref(true);

    const isUserAddedReviewForThatProduct = computed(() =>
      props.reviews
        ? Object.values(props.reviews).find(
            (review) => review.user.id == userId.value
          )
        : false
    );

    const addReviewComponent = ref(null);
    const openAddReviewPopup = () => {
      debugger
      if (!isBuyer.value) return;
      addReviewComponent.value.openAddReviewPopup();
    };

    return {
      settings: carouselSettings,
      breakpoints,
      addReviewComponent,
      openAddReviewPopup,
      isBuyer,
      isUserAddedReviewForThatProduct,
    };
  },
};
</script>
