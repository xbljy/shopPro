<template>
  <div class="rating">
    <svg class="rating__icon" v-for="fullStar in fullStars" :key="fullStar">
      <use xlink:href="@/assets/images/sprite.svg#icon-star-full"></use>
    </svg>

    <svg class="rating__icon" v-for="emptyStar in emptyStars" :key="emptyStar">
      <use xlink:href="@/assets/images/sprite.svg#icon-star-empty"></use>
    </svg>

    <span v-if="ratingsQuantity"> ({{ ratingsQuantity }})</span>
    <span v-if="ratingsQuantity == 0"> (没有评论)</span>
  </div>
</template>

<script>
export default {
  props: ["ratingsAverage", "ratingsQuantity"],
  setup(props) {
    const fullStars = Math.floor(props.ratingsAverage) * 1;
    const emptyStars = 5 - fullStars;

    return {
      fullStars,
      emptyStars,
    };
  },
};
</script>
